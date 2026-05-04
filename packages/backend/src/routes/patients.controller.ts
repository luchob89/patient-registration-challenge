import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { Prisma } from "../generated/prisma/client";
import { PatientGetPayload } from "../generated/prisma/models";
import { sendRegistrationNotification } from "../helpers/notifications";
import { sendRegistrationEmail } from "../helpers/email";
import { querySchema, createPatientSchema, editPatientSchema } from "../validation/patientSchemas";

export const patientListSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  countryCode: true,
  phone: true,
  createdAt: true,
} as const;

export type PatientListItem = PatientGetPayload<{ select: typeof patientListSelect }>;

/**
 * GET /patients
 *
 * Returns a paginated, sorted list of patients.
 *
 * @param {number} [req.query.page=1]          Page number
 * @param {number} [req.query.limit=10]         Items per page
 * @param {string} [req.query.sortBy=createdAt] Sort field: firstName | lastName | email | createdAt
 * @param {string} [req.query.order=desc]       Sort direction: asc | desc
 * @returns {200} { data: PatientListItem[], meta: { total, page, limit, totalPages } }
 * @returns {400} { errors } — invalid query params
 */
export async function listPatients(req: Request, res: Response): Promise<void> {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const { page, limit, sortBy, order } = parsed.data;
  const skip = (page - 1) * limit;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  // Name fields need LOWER() for case-insensitive ordering; other fields use findMany
  const isNameSort = sortBy === "firstName" || sortBy === "lastName";
  const nameCol = sortBy === "firstName" ? "first_name" : "last_name";
  const rawOrder = order === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

  const [patients, total] = await Promise.all([
    isNameSort
      ? prisma.$queryRaw<PatientListItem[]>(
          Prisma.sql`
            SELECT id,
                   first_name   AS "firstName",
                   last_name    AS "lastName",
                   email,
                   country_code AS "countryCode",
                   phone,
                   created_at   AS "createdAt"
            FROM patients
            ORDER BY LOWER(${Prisma.raw(nameCol)}) ${rawOrder}
            LIMIT ${limit} OFFSET ${skip}
          `,
        )
      : (prisma.patient.findMany({
          skip,
          take: limit,
          orderBy: { [sortBy]: order } as Prisma.PatientOrderByWithRelationInput,
          select: patientListSelect,
        }) as Promise<PatientListItem[]>),
    prisma.patient.count(),
  ]);

  res.json({
    data: patients.map((p) => ({
      ...p,
      photoUrl: `${baseUrl}/patients/${p.id}/photo`,
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/**
 * GET /patients/check-email
 *
 * Checks whether an email address is already registered.
 *
 * @param {string} req.query.email  The email address to check (required)
 * @returns {200} { exists: boolean }
 * @returns {400} { error } — missing email param
 */
export async function checkEmail(req: Request, res: Response): Promise<void> {
  const email = String(req.query.email ?? "")
    .trim()
    .toLowerCase();
  if (!email) {
    res.status(400).json({ error: "email query param is required." });
    return;
  }

  const existing = await prisma.patient.findUnique({
    where: { email },
    select: { id: true },
  });

  res.json({ exists: !!existing });
}

/**
 * GET /patients/:id/photo
 *
 * Returns the JPEG document photo for a given patient.
 *
 * @param {number} req.params.id  Patient ID
 * @returns {200} image/jpeg binary
 * @returns {400} { error } — invalid id
 * @returns {404} { error } — patient not found
 */
export async function getPatientPhoto(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid patient id." });
    return;
  }

  const patient = await prisma.patient.findUnique({
    where: { id },
    select: { photo: true },
  });

  if (!patient) {
    res.status(404).json({ error: "Patient not found." });
    return;
  }

  res.setHeader("Content-Type", "image/jpeg");
  res.send(Buffer.from(patient.photo));
}

/**
 * POST /patients
 *
 * Creates a new patient record and sends a registration confirmation email.
 *
 * @param {string}  req.body.firstName    Patient's first name
 * @param {string}  req.body.lastName     Patient's last name
 * @param {string}  req.body.email        Unique email address
 * @param {string}  req.body.countryCode  Phone country code (e.g. "+1")
 * @param {string}  req.body.phone        Phone number
 * @param {file}    req.file              JPEG document photo (required)
 * @returns {201} { data: PatientListItem }
 * @returns {409} { errors } — email already registered
 * @returns {422} { errors } — validation failure
 */
export async function createPatient(req: Request, res: Response): Promise<void> {
  const parsed = createPatientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  if (!req.file) {
    res.status(422).json({ errors: { photo: ["A JPEG photo is required."] } });
    return;
  }

  const { firstName, lastName, email, countryCode, phone } = parsed.data;

  const existing = await prisma.patient.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ errors: { email: ["This email is already registered."] } });
    return;
  }

  const patient = await prisma.patient.create({
    data: {
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      photo: Buffer.from(req.file.buffer) as unknown as Uint8Array<ArrayBuffer>,
    },
    select: patientListSelect,
  });

  sendRegistrationNotification({ firstName, lastName, email });

  res.status(201).json({ data: patient });
}

/**
 * DELETE /patients/:id
 *
 * Permanently deletes a patient record.
 *
 * @param {number} req.params.id  Patient ID
 * @returns {204} (no content)
 * @returns {400} { error } — invalid id
 * @returns {404} { error } — patient not found
 */
export async function deletePatient(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid patient id." });
    return;
  }

  try {
    await prisma.patient.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      res.status(404).json({ error: "Patient not found." });
      return;
    }
    throw err;
  }
}

/**
 * POST /patients/:id/resend-email
 *
 * Re-sends the registration confirmation email to a patient.
 *
 * @param {number} req.params.id  Patient ID
 * @returns {200} { message: string }
 * @returns {400} { error } — invalid id
 * @returns {404} { error } — patient not found
 */
export async function resendEmail(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid patient id." });
    return;
  }

  const patient = await prisma.patient.findUnique({
    where: { id },
    select: { firstName: true, lastName: true, email: true },
  });

  if (!patient) {
    res.status(404).json({ error: "Patient not found." });
    return;
  }

  sendRegistrationEmail(patient);

  res.json({ message: "Confirmation email queued." });
}

/**
 * PATCH /patients/:id
 *
 * Updates one or more fields of an existing patient record.
 *
 * @param {number} req.params.id              Patient ID
 * @param {string} [req.body.firstName]       Updated first name
 * @param {string} [req.body.lastName]        Updated last name
 * @param {string} [req.body.email]           Updated email (must be unique)
 * @param {string} [req.body.countryCode]     Updated phone country code (digits only)
 * @param {string} [req.body.phone]           Updated phone number
 * @returns {200} { data: PatientListItem }
 * @returns {400} { error } — invalid id
 * @returns {404} { error } — patient not found
 * @returns {409} { errors } — email already taken by another patient
 * @returns {422} { errors } — validation failure
 */
export async function editPatient(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid patient id." });
    return;
  }

  const parsed = editPatientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const { email, ...rest } = parsed.data;

  if (email) {
    const conflict = await prisma.patient.findUnique({
      where: { email },
      select: { id: true },
    });
    if (conflict && conflict.id !== id) {
      res.status(409).json({ errors: { email: ["This email is already registered."] } });
      return;
    }
  }

  try {
    const updated = await prisma.patient.update({
      where: { id },
      data: { ...rest, ...(email ? { email } : {}) },
      select: patientListSelect,
    });
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.json({ data: { ...updated, photoUrl: `${baseUrl}/patients/${id}/photo` } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      res.status(404).json({ error: "Patient not found." });
      return;
    }
    throw err;
  }
}

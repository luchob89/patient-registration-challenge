import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { Prisma } from "../generated/prisma/client";
import { PatientGetPayload } from "../generated/prisma/models";
import { upload } from "../helpers/upload";
import { sendRegistrationEmail } from "../helpers/email";
import { querySchema, createPatientSchema } from "../validation/patientSchemas";

const router = Router();

const patientListSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  countryCode: true,
  phone: true,
  createdAt: true,
} as const;

type PatientListItem = PatientGetPayload<{ select: typeof patientListSelect }>;

// ── GET /patients ───────────────────────────────────────────────────────────

router.get("/", async (req: Request, res: Response) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ errors: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const { page, limit, sortBy, order } = parsed.data;
  const skip = (page - 1) * limit;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const [patients, total] = (await Promise.all([
    prisma.patient.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: order } as Prisma.PatientOrderByWithRelationInput,
      select: patientListSelect,
    }),
    prisma.patient.count(),
  ])) as [PatientListItem[], number];

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
});

// ── GET /patients/check-email?email= ───────────────────────────────────────

router.get("/check-email", async (req: Request, res: Response) => {
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
});

// ── GET /patients/:id/photo ─────────────────────────────────────────────────

router.get("/:id/photo", async (req: Request, res: Response) => {
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
});

// ── POST /patients ──────────────────────────────────────────────────────────

router.post(
  "/",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    // Validate text fields
    const parsed = createPatientSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(422)
        .json({ errors: z.flattenError(parsed.error).fieldErrors });
      return;
    }

    if (!req.file) {
      res
        .status(422)
        .json({ errors: { photo: ["A JPEG photo is required."] } });
      return;
    }

    const { firstName, lastName, email, countryCode, phone } = parsed.data;

    const existing = await prisma.patient.findUnique({ where: { email } });
    if (existing) {
      res
        .status(409)
        .json({ errors: { email: ["This email is already registered."] } });
      return;
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
        countryCode,
        phone,
        photo: Buffer.from(
          req.file.buffer,
        ) as unknown as Uint8Array<ArrayBuffer>,
      },
      select: patientListSelect,
    });

    sendRegistrationEmail({ firstName, lastName, email });

    res.status(201).json({ data: patient });
  },
);

// ── DELETE /patients/:id ────────────────────────────────────────────────────

router.delete("/:id", async (req: Request, res: Response) => {
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
});

// ── POST /patients/:id/resend-email ─────────────────────────────────────────

router.post("/:id/resend-email", async (req: Request, res: Response) => {
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
});

export default router;

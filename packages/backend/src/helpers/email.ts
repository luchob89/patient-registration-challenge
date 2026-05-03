import nodemailer from "nodemailer";
import { registrationEmailText, registrationEmailHtml } from "./emailTemplates";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "sandbox.smtp.mailtrap.io",
  port: Number(process.env.SMTP_PORT ?? 2525),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function sendRegistrationEmail(patient: {
  firstName: string;
  lastName: string;
  email: string;
}): void {
  const fullName = `${patient.firstName} ${patient.lastName}`;

  transporter
    .sendMail({
      from:
        process.env.SMTP_FROM ??
        '"Patient Registration" <no-reply@yourdomain.com>',
      to: patient.email,
      subject: "You have been successfully registered",
      text: registrationEmailText(fullName, patient.email),
      html: registrationEmailHtml(fullName, patient.email),
    })
    .catch((err) => {
      console.error("[email] Failed to send registration email:", err);
    });
}

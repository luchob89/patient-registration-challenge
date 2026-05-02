import nodemailer from "nodemailer";

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
      from: process.env.SMTP_FROM ?? '"Patient Registration" <no-reply@yourdomain.com>',
      to: patient.email,
      subject: "You have been successfully registered",
      text: [
        `Hello ${fullName},`,
        "",
        "Your registration has been successfully completed.",
        "",
        "Here are your details:",
        `  Name:  ${fullName}`,
        `  Email: ${patient.email}`,
        "",
        "Thank you for registering.",
      ].join("\n"),
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#4f46e5;margin-bottom:8px;">Registration confirmed</h2>
          <p style="color:#374151;">Hello <strong>${fullName}</strong>,</p>
          <p style="color:#374151;">Your registration has been successfully completed.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px;">Name</td>
              <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:14px;">Email</td>
              <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${patient.email}</td>
            </tr>
          </table>
          <p style="color:#9ca3af;font-size:12px;">Thank you for registering.</p>
        </div>
      `,
    })
    .catch((err) => {
      console.error("[email] Failed to send registration email:", err);
    });
}

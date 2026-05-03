export function registrationEmailText(fullName: string, email: string): string {
  return [
    `Hello ${fullName},`,
    "",
    "Your registration has been successfully completed.",
    "",
    "Here are your details:",
    `  Name:  ${fullName}`,
    `  Email: ${email}`,
    "",
    "Thank you for registering.",
  ].join("\n");
}

export function registrationEmailHtml(fullName: string, email: string): string {
  return `
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
          <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${email}</td>
        </tr>
      </table>
      <p style="color:#9ca3af;font-size:12px;">Thank you for registering.</p>
    </div>
  `;
}

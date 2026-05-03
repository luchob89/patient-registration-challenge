import { sendRegistrationEmail } from "./email";

/**
 * Sends all registration notifications for a newly created patient.
 *
 * Today this dispatches an email confirmation only.
 * When SMS is ready, add the SMS call here —
 * no other file needs to change.
 *
 * @param patient  The registered patient's basic details
 */
export function sendRegistrationNotification(patient: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}): void {
  sendRegistrationEmail(patient);

  // TODO: SMS notification
  // When ready, install the provider SDK, add credentials to .env,
  // and uncomment / implement the call below:
  //
  // sendRegistrationSms({
  //   to: `${patient.countryCode}${patient.phone}`,
  //   message: `Hi ${patient.firstName}, your registration was successful.`,
  // });
}

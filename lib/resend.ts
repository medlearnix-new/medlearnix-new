import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing RESEND_API_KEY. Set it in .env.local (and in your Vercel project's environment variables)."
  );
}

// Server-only client (RESEND_API_KEY has no NEXT_PUBLIC_ prefix, so it's
// never bundled for the browser). Import this only from Route Handlers or
// other server-side code.
export const resend = new Resend(apiKey);

/** The "from" address for all outgoing mail — medlearnix.com is a verified
 * sending domain on Resend. */
export const MAIL_FROM = "MedLearnix <hello@medlearnix.com>";
export const MAIL_TO = "hello@medlearnix.com";

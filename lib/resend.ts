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

/** The "from" address for all outgoing, automated mail — medlearnix.com is a
 * verified sending domain on Resend. Kept separate from MAIL_TO: nothing
 * sent from this address expects a reply (set `replyTo` where a human
 * should get the response instead). */
export const MAIL_FROM = "MedLearnix <noreply@medlearnix.com>";
/** The team's real inbox — where contact-form notifications land and where
 * auto-replies point people if they hit "reply". */
export const MAIL_TO = "hello@medlearnix.com";

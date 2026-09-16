import { NextResponse } from "next/server";
import { resend, MAIL_FROM, MAIL_TO } from "@/lib/resend";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are all required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  try {
    // Notify the team, with reply-to set so they can respond directly.
    const { error: teamEmailError } = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: `
        <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
          <h2 style="color: #0891b2;">New message from the MedLearnix contact form</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin-top: 24px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0;">${safeMessage}</p>
        </div>
      `,
    });

    if (teamEmailError) {
      throw new Error(teamEmailError.message);
    }

    // Auto-reply confirmation to the person who submitted the form.
    await resend.emails.send({
      from: MAIL_FROM,
      to: email,
      replyTo: MAIL_TO,
      subject: "We've received your message — MedLearnix",
      html: `
        <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
          <h2 style="color: #0891b2;">Thanks for reaching out, ${safeName}!</h2>
          <p>We've received your message and a member of the MedLearnix team will get back to you shortly.</p>
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">For reference, here's what you sent us:</p>
          <p style="white-space: pre-wrap; background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; color: #4b5563; font-size: 14px;">${safeMessage}</p>
          <p style="margin-top: 24px;">— The MedLearnix Team</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form email failed:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 502 }
    );
  }
}

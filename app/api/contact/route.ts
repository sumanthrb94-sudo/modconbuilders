import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

// Fields any of the site's forms may send, in the order they appear in the email.
const FIELDS = {
  name: { label: 'Name', max: 120 },
  email: { label: 'Email', max: 200 },
  phone: { label: 'Phone', max: 40 },
  purpose: { label: 'Purpose of purchase', max: 100 },
  startDate: { label: 'Expecting to start', max: 40 },
  visitDate: { label: 'Preferred visit date', max: 40 },
  timeSlot: { label: 'Preferred time slot', max: 60 },
  message: { label: 'Message', max: 5000 },
  consent: { label: 'Marketing consent', max: 10 },
} as const;
type FieldKey = keyof typeof FIELDS;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{6,}$/;

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't retry.
  if (str(body.company, 200)) return NextResponse.json({ ok: true });

  const values = Object.fromEntries(
    (Object.keys(FIELDS) as FieldKey[]).map((k) => [k, str(body[k], FIELDS[k].max)]),
  ) as Record<FieldKey, string>;
  const source = str(body.source, 100) || 'Website';

  if (!values.name) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!values.email && !values.phone) {
    return NextResponse.json({ error: 'Please enter an email address or phone number.' }, { status: 400 });
  }
  if (values.email && !EMAIL_RE.test(values.email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (values.phone && !PHONE_RE.test(values.phone)) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || 'Modcon Builders Website <onboarding@resend.dev>';
  if (!apiKey || !to) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set');
    return NextResponse.json({ error: 'The form is not available right now. Please call or email us.' }, { status: 503 });
  }

  const rows: [string, string][] = [
    ['Form', source],
    ...(Object.keys(FIELDS) as FieldKey[]).filter((k) => values[k]).map((k): [string, string] => [FIELDS[k].label, values[k]]),
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#8E8E8E;vertical-align:top;white-space:nowrap">${k}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table>`;

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to: to.split(',').map((s) => s.trim()),
    ...(values.email ? { replyTo: values.email } : {}),
    subject: `New enquiry from ${values.name} (${source})`,
    text,
    html,
  });

  if (error) {
    console.error('Contact form: Resend error', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again or call us.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

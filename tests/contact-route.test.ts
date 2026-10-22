import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send } };
  }),
}));

const { POST } = await import('@/app/api/contact/route');

const post = (body: unknown) =>
  POST(new Request('http://localhost/api/contact', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }));

describe('POST /api/contact', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'sales@example.com, owner@example.com';
    send.mockReset().mockResolvedValue({ error: null });
  });
  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
  });

  it('rejects malformed JSON', async () => {
    expect((await post('nope')).status).toBe(400);
  });

  it('needs a name and an email or phone', async () => {
    expect((await post({ email: 'a@b.co' })).status).toBe(400);
    expect((await post({ name: 'Asha' })).status).toBe(400);
  });

  it('rejects an invalid email or phone', async () => {
    expect((await post({ name: 'Asha', email: 'not-an-email' })).status).toBe(400);
    expect((await post({ name: 'Asha', phone: 'call me' })).status).toBe(400);
  });

  it('silently accepts honeypot submissions without sending', async () => {
    const res = await post({ name: 'Bot', email: 'bot@spam.co', company: 'Spam Inc' });
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('returns 503 when email is not configured', async () => {
    delete process.env.RESEND_API_KEY;
    expect((await post({ name: 'Asha', phone: '+91 95348 69999' })).status).toBe(503);
  });

  it('sends the enquiry to every recipient with reply-to set', async () => {
    const res = await post({ name: 'Asha', email: 'asha@example.com', purpose: 'Business Use', source: 'Modcon One', extra: 'ignored' });
    expect(res.status).toBe(200);
    const msg = send.mock.calls[0][0];
    expect(msg.to).toEqual(['sales@example.com', 'owner@example.com']);
    expect(msg.replyTo).toBe('asha@example.com');
    expect(msg.subject).toBe('New enquiry from Asha (Modcon One)');
    expect(msg.text).toContain('Purpose of purchase: Business Use');
    expect(msg.text).not.toContain('ignored');
  });

  it('escapes HTML in the email body', async () => {
    await post({ name: 'Asha', phone: '+91 95348 69999', message: '<script>x</script>' });
    expect(send.mock.calls[0][0].html).toContain('&lt;script&gt;');
  });

  it('reports a Resend failure as 502', async () => {
    send.mockResolvedValue({ error: { message: 'bad key' } });
    expect((await post({ name: 'Asha', phone: '+91 95348 69999' })).status).toBe(502);
  });
});

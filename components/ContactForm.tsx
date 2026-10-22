'use client';

import { useState, type FormEvent } from 'react';

export type FieldName =
  | 'name'
  | 'email'
  | 'phone'
  | 'startDate'
  | 'visitDate'
  | 'purpose'
  | 'timeSlot'
  | 'message'
  | 'consent';

export type Field = {
  name: FieldName;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'month' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  options?: string[];
  autoComplete?: string;
  /** Tailwind column span on the form grid (desktop). */
  span?: string;
};

type Props = {
  fields: Field[];
  source: string;
  submitLabel: string;
  variant?: 'dark' | 'line';
  columns?: string;
  className?: string;
};

type Status = { state: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

export default function ContactForm({ fields, source, submitLabel, variant = 'line', columns = 'md:grid-cols-1', className = '' }: Props) {
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const dark = variant === 'dark';

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, string> = { source };
    data.forEach((v, k) => {
      if (typeof v === 'string') payload[k] = v;
    });
    setStatus({ state: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
      form.reset();
      setStatus({ state: 'sent', message: "Thanks! We've received your details and will get back to you soon." });
    } catch (err) {
      setStatus({ state: 'error', message: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    }
  }

  const control = dark
    ? 'w-full border-0 border-b border-white/70 bg-[#0B0B0B] px-3 py-2.5 text-[16px] text-white placeholder:text-[#ECF3D7] focus:border-gold focus:outline-none focus:ring-0'
    : 'w-full border-0 border-b border-black/70 bg-transparent px-0 py-2.5 font-form text-[16px] text-black focus:border-black focus:outline-none focus:ring-0';
  const labelCls = dark ? 'mb-2 block text-[16px] text-white' : 'mb-1 block font-form text-[14px] font-medium text-black';

  return (
    <form onSubmit={onSubmit} className={`grid gap-x-8 gap-y-5 ${columns} ${className}`}>
      {/* Honeypot for bots; hidden from people and screen readers. */}
      <div className="hidden" aria-hidden>
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {fields.map((f) => {
        const id = `${source}-${f.name}`.replace(/\W+/g, '-');
        const req = f.required ? ' *' : '';
        if (f.type === 'checkbox') {
          return (
            <label key={f.name} htmlFor={id} className={`flex items-start gap-3 font-form text-[15px] leading-6 text-black ${f.span ?? ''}`}>
              <input id={id} name={f.name} type="checkbox" value="yes" required={f.required} className="mt-1 h-4 w-4 shrink-0 rounded-none border-black/60" />
              <span>{f.label}</span>
            </label>
          );
        }
        return (
          <div key={f.name} className={f.span ?? ''}>
            {/* The dark form uses placeholders; date pickers have none, so they keep a visible label. */}
            <label htmlFor={id} className={dark && f.type !== 'date' && f.type !== 'month' ? 'sr-only' : labelCls}>
              {f.label}
              {req}
            </label>
            {f.type === 'textarea' ? (
              <textarea id={id} name={f.name} rows={4} required={f.required} placeholder={dark ? f.label : undefined} className={`${control} resize-y`} />
            ) : f.type === 'select' ? (
              <select id={id} name={f.name} required={f.required} defaultValue="" className={control}>
                <option value="" disabled>
                  {dark ? f.label : 'Select'}
                </option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={f.name}
                type={f.type ?? 'text'}
                required={f.required}
                autoComplete={f.autoComplete}
                placeholder={dark ? `${f.label}${req}` : undefined}
                className={`${control} ${dark && (f.type === 'date' || f.type === 'month') ? '[color-scheme:dark]' : ''}`}
              />
            )}
          </div>
        );
      })}

      <div className={`col-span-full ${dark ? 'text-center' : ''}`}>
        <button
          type="submit"
          disabled={status.state === 'sending'}
          className={
            dark
              ? 'min-h-[44px] px-6 font-display text-[17px] text-white transition-colors [font-variant-caps:small-caps] hover:text-gold disabled:opacity-60'
              : 'w-full border border-black px-6 py-3 text-[16px] text-black transition-colors hover:bg-black hover:text-white disabled:opacity-60'
          }
        >
          {status.state === 'sending' ? 'Sending…' : submitLabel}
        </button>
        <p role="status" aria-live="polite" className={`mt-4 text-[15px] ${status.state === 'error' ? 'text-red-500' : dark ? 'text-paper' : 'text-body'}`}>
          {status.message}
        </p>
      </div>
    </form>
  );
}

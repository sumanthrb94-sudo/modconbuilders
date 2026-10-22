import type { Metadata } from 'next';
import ContactForm, { type Field } from '@/components/ContactForm';
import { contact, site } from '@/content/site';

export const metadata: Metadata = {
  title: contact.seo.title,
  description: contact.seo.description,
  alternates: { canonical: '/contact' },
};

const fields: Field[] = [
  { name: 'name', label: 'Name Surname', required: true, autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Contact Number', type: 'tel', autoComplete: 'tel' },
  { name: 'startDate', label: 'When are you expecting to start?', type: 'month', required: true },
  { name: 'message', label: 'Your Message', type: 'textarea' },
];

export default function ContactPage() {
  return (
    <section className="bg-black px-5 pb-28 pt-36 text-white lg:pb-[150px] lg:pt-[168px]">
      <h1 className="text-center font-display text-[30px] leading-[1.3] [font-variant-caps:small-caps] sm:text-[42px] lg:text-[58px]" data-reveal>
        Let’s Discuss Your Next Project
      </h1>

      <div className="mx-auto mt-14 max-w-[696px] lg:mt-[90px]" data-reveal>
        <p className="mb-6 text-[18px] leading-[1.5]">
          {contact.title} {contact.body}
        </p>
        <ContactForm fields={fields} source="Contact page" submitLabel="Get a Quote" variant="dark" />

        <div className="mt-14 grid gap-6 border-t border-white/15 pt-8 text-[15px] text-paper/80 sm:grid-cols-2">
          {site.offices.map((o) => (
            <div key={o.label}>
              <p className="mb-1 text-white">{o.label}</p>
              {o.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          ))}
          <p className="sm:col-span-2">
            <a href={site.phoneHref} className="hover:text-white">{site.phone}</a>
            {'  ·  '}
            <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

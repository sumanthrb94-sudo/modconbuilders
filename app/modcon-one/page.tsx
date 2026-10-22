import type { Metadata } from 'next';
import Image from 'next/image';
import ContactForm, { type Field } from '@/components/ContactForm';
import Faq from '@/components/Faq';
import { brochureHref, images, mapEmbedSrc, modconOne, site } from '@/content/site';

export const metadata: Metadata = {
  title: modconOne.seo.title,
  description: modconOne.seo.description,
  alternates: { canonical: '/modcon-one' },
  openGraph: {
    title: modconOne.seo.title,
    description: modconOne.seo.description,
    images: [{ url: images.modconOneTower }],
  },
};

const quickVisitFields: Field[] = [
  { name: 'name', label: 'First name', required: true, autoComplete: 'given-name' },
  { name: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel' },
  { name: 'visitDate', label: 'Preferred Visit Date', type: 'date' },
];

const bookingFields: Field[] = [
  { name: 'name', label: 'First name', required: true, autoComplete: 'given-name' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', span: 'md:col-span-2' },
  { name: 'purpose', label: 'Purpose of Purchase', type: 'select', options: modconOne.visit.purposes, span: 'md:col-span-2' },
  { name: 'visitDate', label: 'Preferred Site Visit Date', type: 'date', span: 'md:col-span-2' },
  { name: 'timeSlot', label: 'Preferred Time Slot', type: 'select', options: modconOne.visit.timeSlots, span: 'md:col-span-2' },
  { name: 'consent', label: modconOne.visit.consent, type: 'checkbox', span: 'md:col-span-2' },
];

const eyebrow = 'mb-4 font-helvetica text-[13.5px] uppercase text-body';
const title = 'font-helvetica text-[26px] capitalize leading-[1.25] text-black lg:text-[32px]';

export default function ModconOnePage() {
  const { intro, about, philosophy, villaments, syl, commercial, wellness, location, visit, faq, closing } = modconOne;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#c3cfe2] via-[#dbe3ef] to-white pt-28 lg:pt-24">
        <div className="relative z-10 px-5 text-center" data-reveal>
          <h1 className="mx-auto max-w-[1132px] font-helvetica text-[40px] font-light leading-[1.05] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(60,80,110,0.35)] sm:text-[60px] lg:text-[91px]">
            {intro.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[360px] font-helvetica text-[16px] text-white [text-shadow:0_1px_12px_rgba(60,80,110,0.45)] lg:text-[18px]">
            {intro.body}
          </p>
        </div>
        <div className="relative mx-auto -mt-4 aspect-[1920/1080] w-full max-w-[1440px] lg:-mt-24">
          <Image
            src={images.m1HeroBuilding}
            alt="MODCON ONE: a white mid-rise with curved, planted balconies"
            fill
            priority
            sizes="100vw"
            className="object-contain object-bottom"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" aria-hidden />
      </section>

      {/* Experience it before you decide */}
      <section id="why" className="scroll-mt-20 px-5 pb-20 pt-12 lg:px-[38px] lg:pb-[180px]">
        <div className="text-center" data-reveal>
          <p className={eyebrow}>{intro.ctaTitle}</p>
          <h2 className={`${title} mx-auto max-w-[880px]`}>{intro.ctaBody}</h2>
        </div>
        <ContactForm
          fields={quickVisitFields}
          source="Modcon One: quick site visit"
          submitLabel="Schedule a Site Visit"
          columns="md:grid-cols-3"
          className="mt-12 lg:mt-[70px]"
        />
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 px-5 text-center" data-reveal>
        <p className={eyebrow}>{about.eyebrow}</p>
        <div className="mx-auto max-w-[728px] space-y-8 font-helvetica text-[21px] leading-[1.4] text-black lg:text-[26px]">
          {about.paragraphs.map((p) => (
            <p key={p} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#visit" className="rounded-md border border-black px-3 py-2 font-helvetica text-[15px] text-black hover:bg-black hover:text-white">
            Book a Site Visit
          </a>
          <a
            href={brochureHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-black px-3.5 py-2 font-helvetica text-[15px] text-black hover:bg-black hover:text-white"
          >
            Download Brochure
          </a>
        </div>
      </section>

      {/* Design philosophy */}
      <section className="pt-28 lg:pt-[160px]">
        <div className="px-5 text-center" data-reveal>
          <p className={eyebrow}>{philosophy.eyebrow}</p>
          <p className="mx-auto max-w-[558px] font-helvetica text-[21px] leading-[1.4] text-black lg:text-[26px]">{philosophy.title}</p>
        </div>
        <div className="mt-10 overflow-hidden" aria-hidden>
          <div className="flex w-max animate-marquee gap-4 motion-reduce:animate-none">
            {[...images.m1Gallery, ...images.m1Gallery].map((src, i) => (
              <div key={`${src}-${i}`} className="relative h-[220px] w-[294px] shrink-0 overflow-hidden rounded-lg lg:h-[309px] lg:w-[412px]">
                <Image src={src} alt="" fill sizes="412px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <p className="mt-12 whitespace-pre-line px-5 text-center font-helvetica text-[21px] leading-[1.4] text-black lg:text-[26px]" data-reveal>
          {philosophy.body.replace('living. ', 'living.\n')}
        </p>
      </section>

      {/* Villaments */}
      <section id="living" className="scroll-mt-20 px-5 pt-24 lg:px-20 lg:pt-28">
        <div className="text-center" data-reveal>
          <p className={eyebrow}>{villaments.eyebrow}</p>
          <h2 className={title}>{villaments.title}</h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-[1280px] gap-6 md:grid-cols-3">
          {villaments.items.map((item, i) => (
            <article key={item.title} data-reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={images.m1Villaments[i]} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h3 className="mt-5 font-helvetica text-[22px] text-black">{item.title}</h3>
              <p className="mt-2 font-helvetica text-[17px] leading-[1.45] text-body">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Syl Residences */}
      <section className="px-5 pt-24 lg:px-20 lg:pt-28">
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg" data-reveal>
            <Image src={images.m1SylTower} alt="MODCON Syl Residences tower against a clear sky" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div data-reveal>
            <h2 className={title}>
              {syl.title}
              <span className="block text-body">{syl.subtitle}</span>
            </h2>
            <p className="mt-6 font-helvetica text-[21px] leading-[1.4] text-black">
              {syl.lead[0]}
              <br />
              {syl.lead[1]}
            </p>
            <p className="mt-4 font-helvetica text-[17px] leading-[1.5] text-body">{syl.body}</p>
          </div>
        </div>
      </section>

      {/* Commercial zone */}
      <section className="px-5 pt-24 lg:px-9 lg:pt-[140px]">
        <div className="text-center" data-reveal>
          <p className={eyebrow}>{commercial.eyebrow}</p>
          <h2 className={`${title} text-ink`}>{commercial.title}</h2>
          <p className="mt-4 font-helvetica text-[16px] capitalize text-[#323232] lg:text-[18px]">{commercial.body}</p>
        </div>
        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:mt-[70px] lg:grid-cols-3">
          {commercial.items.map((item) => (
            <article key={item.title} className="rounded-lg bg-[#F7F7F7] px-6 pb-7 pt-7 text-center" data-reveal>
              <span className="mx-auto block h-px w-[244px] max-w-full bg-black/80" aria-hidden />
              <Image src={item.icon} alt="" width={64} height={64} className="mx-auto mt-6 h-16 w-16" />
              <h3 className="mt-5 font-helvetica text-[24px] capitalize text-black lg:text-[27px]">{item.title}</h3>
              <p className="mx-auto mt-4 max-w-[376px] font-helvetica text-[17px] leading-[1.3] text-ink">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Wellness & club-house */}
      <section className="px-5 pt-24 lg:px-9 lg:pt-[140px]">
        <div className="text-center" data-reveal>
          <p className={eyebrow}>{wellness.eyebrow}</p>
          <h2 className={`${title} mx-auto max-w-[690px] lg:leading-[1.5]`}>{wellness.title}</h2>
          <p className="mt-3 font-helvetica text-[16px] capitalize text-body lg:text-[18px]">{wellness.body}</p>
        </div>
        <div className="mt-9 grid gap-7 md:grid-cols-2">
          {wellness.items.map((item) => (
            <article key={item.title} className="rounded-lg bg-sand p-2.5" data-reveal>
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md sm:aspect-[651/336]">
                <Image src={item.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/35 to-black/60" aria-hidden />
                <div className="relative mt-[18%] px-6 text-center text-paper">
                  <span className="mx-auto block h-px w-[244px] max-w-full bg-paper" aria-hidden />
                  <h3 className="mt-5 font-helvetica text-[22px] capitalize lg:text-[27px]">{item.title}</h3>
                  <p className="mx-auto mt-3 max-w-[380px] font-helvetica text-[16px] leading-[1.25] lg:text-[20px]">{item.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Location */}
      <section id="location" className="scroll-mt-20 px-5 pt-24 lg:px-9 lg:pt-[140px]">
        <div className="text-center" data-reveal>
          <p className={eyebrow}>{location.eyebrow}</p>
          <h2 className="font-sans text-[28px] font-medium tracking-[-0.02em] text-black lg:text-[32px]">{location.title}</h2>
        </div>
        <div className="mt-10 h-[360px] overflow-hidden rounded-lg lg:h-[600px]">
          <iframe
            title={`Map: ${location.address}`}
            src={mapEmbedSrc}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <dl className="mt-10 grid gap-6 font-form md:grid-cols-3">
          <div>
            <dt className="text-[14px] text-body">Phone</dt>
            <dd className="mt-2 text-[16px] font-medium text-black">
              <a href={site.phoneHref}>{site.phone}</a>
            </dd>
          </div>
          <div>
            <dt className="text-[14px] text-body">Email</dt>
            <dd className="mt-2 text-[16px] font-medium text-black">
              <a href={`mailto:${site.salesEmail}`}>{site.salesEmail}</a>
            </dd>
          </div>
          <div>
            <dt className="text-[14px] text-body">Address</dt>
            <dd className="mt-2 text-[16px] font-medium text-black">{location.address}</dd>
          </div>
        </dl>
      </section>

      {/* Booking form */}
      <section id="visit" className="scroll-mt-20 px-5 pt-20 lg:px-9 lg:pt-24">
        <div className="text-center" data-reveal>
          <p className="mb-3 font-form text-[14px] text-body">{visit.eyebrow}</p>
          <h2 className="font-form text-[16px] font-medium capitalize text-black">{visit.body}</h2>
        </div>
        <ContactForm
          fields={bookingFields}
          source="Modcon One: site visit booking"
          submitLabel="Submit"
          columns="md:grid-cols-2"
          className="mt-8"
        />
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 px-5 pt-24 lg:px-9 lg:pt-[120px]">
        <div className="max-w-[830px]" data-reveal>
          <h2 className="font-form text-[20px] font-medium tracking-[-0.02em] text-black">{faq.title}</h2>
          <p className="mt-6 font-form text-[20px] leading-[1.5] tracking-[-0.02em] text-black">{faq.body}</p>
        </div>
        <div className="mt-12">
          <Faq items={faq.items} />
        </div>
      </section>

      {/* Closing */}
      <section className="relative mt-24 flex min-h-[900px] items-center justify-center px-5 py-24 lg:mt-[120px] lg:min-h-[1180px]">
        <Image src={images.m1Closing} alt="" fill sizes="100vw" className="object-cover" aria-hidden />
        <div className="relative flex min-h-[620px] w-full max-w-[604px] flex-col items-center justify-between bg-white px-6 py-10 text-center lg:min-h-[760px]" data-reveal>
          <p className="font-sans text-[20px] font-medium leading-[1.5] text-black lg:text-[22px]">
            {closing.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <Image src="/images/syl-mark.svg" alt="" width={140} height={140} className="h-[140px] w-[140px]" />
          <div className="font-form text-black">
            <p className="text-[18px]">Get in Touch</p>
            <p className="mt-1 text-[14px]">
              <a href={`mailto:${site.salesEmail}`} className="hover:underline">{site.salesEmail}</a>
            </p>
            <p className="mt-1 text-[14px]">
              <a href={site.phoneHref} className="hover:underline">{site.phone}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

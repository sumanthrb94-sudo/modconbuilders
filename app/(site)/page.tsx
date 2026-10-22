import Image from 'next/image';
import Link from 'next/link';
import HeroSlideshow from '@/components/HeroSlideshow';
import { ArrowDownRight, ArrowRight } from '@/components/Icons';
import RichText from '@/components/RichText';
import SectionTitle from '@/components/SectionTitle';
import { home, images } from '@/content/site';

export default function HomePage() {
  const { hero, legacy, about, solutions, sustainability, projects, award, growth, processIntro, process } = home;

  return (
    <>
      {/* 1. Hero */}
      <section className="relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden bg-paper lg:h-[900px]">
        <HeroSlideshow images={images.homeHero} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/10" aria-hidden />
        <div className="relative z-10 px-5 text-center text-paper" data-reveal>
          <h1 className="font-display text-[30px] uppercase leading-[1.2] sm:text-[44px] lg:text-[60px] lg:leading-[1.1] xl:whitespace-nowrap">
            {hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[400px] text-[16px] leading-[1.4]">{hero.body}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-[44px] items-end border-b-2 border-paper px-5 pb-2 text-[16px] transition-colors hover:border-gold hover:text-white"
          >
            Reach Us Out
          </Link>
        </div>
      </section>

      {/* 2. Welcome / legacy */}
      <section className="container-content section-space">
        <div className="grid gap-6 md:grid-cols-[3fr_2fr] md:gap-12 lg:grid-cols-[573fr_380fr] lg:gap-14">
          <SectionTitle eyebrow={legacy.eyebrow}>
            <RichText text={legacy.title} />
          </SectionTitle>
          <div className="flex flex-col justify-between gap-8" data-reveal>
            <p className="text-[18px] leading-[1.4] text-[#323232]">{legacy.body}</p>
            <Link href="#projects" className="btn-pill self-start">
              View Projects <ArrowDownRight />
            </Link>
          </div>
        </div>
        <div className="relative mt-8 aspect-[1008/527] overflow-hidden rounded-[20px]" data-reveal>
          <Image src={images.legacy} alt="Looking up at glass skyscrapers in the fog" fill sizes="(min-width: 1024px) 1008px, 100vw" className="object-cover" />
        </div>
      </section>

      {/* 3. About */}
      <section id="about" className="container-content section-space scroll-mt-8">
        <div className="grid gap-8 md:grid-cols-[562fr_410fr] md:gap-9">
          <div className="flex flex-col">
            <SectionTitle eyebrow={about.eyebrow}>
              <RichText text={about.title} />
            </SectionTitle>
            <div className="relative my-6 aspect-square overflow-hidden rounded-[20px] md:hidden">
              <Image src={images.about} alt="Cable-stayed bridge in black and white" fill sizes="100vw" className="object-cover" />
            </div>
            <div className="mt-2 space-y-6 text-[18px] leading-[1.4] text-muted md:mt-12" data-reveal>
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link href="/contact" className="btn-pill mt-10 self-start md:mt-auto" data-reveal>
              Get a Quote <ArrowDownRight />
            </Link>
          </div>
          <div className="relative hidden aspect-[410/535] overflow-hidden rounded-[20px] md:block" data-reveal>
            <Image src={images.about} alt="Cable-stayed bridge in black and white" fill sizes="(min-width: 768px) 41vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="container-content section-space scroll-mt-8">
        <SectionTitle eyebrow={solutions.eyebrow} align="center">
          <RichText text={solutions.title} />
        </SectionTitle>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:mt-10 lg:grid-cols-4 lg:gap-[10px]">
          {solutions.items.map((item) => (
            <article key={item.title} className="card flex flex-col p-2.5 pb-6 lg:min-h-[272px]" data-reveal>
              <Image src={item.icon} alt="" width={50} height={50} className="h-9 w-9 lg:mt-6 lg:h-[50px] lg:w-[50px]" />
              <h3 className="mt-8 text-[18px] leading-[1.4] text-ink lg:mt-10 lg:text-[23px]">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.4] text-black lg:text-[14px]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Why choose us */}
      <section className="container-content section-space">
        <SectionTitle eyebrow={sustainability.eyebrow} align="center" className="mx-auto max-w-[620px]">
          <RichText text={sustainability.title} accentClass="accent block" />
        </SectionTitle>
        <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-[692fr_298fr] lg:gap-[18px]">
          <div className="relative aspect-[692/319] overflow-hidden rounded-[20px]" data-reveal>
            <Image src={images.expertise} alt="Rooftop terrace overlooking a city skyline" fill sizes="(min-width: 1024px) 692px, 100vw" className="object-cover" />
          </div>
          <FeatureCard title={sustainability.items[0].title} body={sustainability.items[0].body} />
        </div>
        <div className="mt-4 grid gap-4 lg:mt-[18px] lg:grid-cols-[290fr_698fr] lg:gap-5">
          <FeatureCard title={sustainability.items[1].title} body={sustainability.items[1].body} className="order-2 lg:order-1" />
          <div className="relative order-1 aspect-[698/305] overflow-hidden rounded-[20px] lg:order-2" data-reveal>
            <Image src={images.innovation} alt="Modern office towers seen from below" fill sizes="(min-width: 1024px) 698px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* 6. Projects */}
      <section id="projects" className="container-content section-space scroll-mt-8">
        <SectionTitle eyebrow={projects.eyebrow} align="center">
          {projects.title}
        </SectionTitle>
        <div className="mt-8 grid gap-6 lg:mt-14 lg:grid-cols-[699fr_273fr] lg:gap-9">
          <div className="relative aspect-[699/388] overflow-hidden rounded-[20px]" data-reveal>
            <Image src={images.agartha} alt="Agartha: thatched eco-retreat buildings around a natural pool" fill sizes="(min-width: 1024px) 699px, 100vw" className="object-cover" />
          </div>
          <ProjectText
            title={projects.agartha.title}
            body={projects.agartha.body}
            href={projects.agartha.href}
            external
          />
        </div>
        <div className="mt-14 grid gap-6 lg:mt-9 lg:grid-cols-[272fr_700fr] lg:gap-9">
          <ProjectText
            title={projects.modconOne.title}
            body={projects.modconOne.body}
            href={projects.modconOne.href}
            className="order-2 lg:order-1"
          />
          <div className="relative order-1 aspect-[700/352] overflow-hidden rounded-[20px] lg:order-2" data-reveal>
            <Image src={images.modconOneTower} alt="MODCON ONE: a white tower with curved, planted balconies" fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* 7. Achievements */}
      <section className="container-content section-space">
        <SectionTitle eyebrow={award.eyebrow} align="center" className="mx-auto max-w-[980px]">
          <RichText text={award.title} />
        </SectionTitle>
        <div className="relative mt-8 aspect-[1008/567] overflow-hidden rounded-[20px]" data-reveal>
          <Image
            src={images.award}
            alt="The Modcon team receiving the Outlook Business Spotlight Entity Award 2024 from Business Mint"
            fill
            sizes="(min-width: 1024px) 1008px, 100vw"
            className="object-cover"
          />
        </div>
        <p className="mx-auto mt-8 max-w-[844px] text-center text-[16px] leading-[1.4] text-muted" data-reveal>
          <RichText text={award.body} />
        </p>
      </section>

      {/* 8. Empowering growth */}
      <section className="container-content section-space">
        <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[20px] bg-ink px-6 py-16 text-center text-paper lg:min-h-[500px]">
          <Image src={images.homeHero[1]} alt="" fill sizes="(min-width: 1024px) 1008px, 100vw" className="object-cover opacity-40" aria-hidden />
          <div className="relative" data-reveal>
            <h2 className="text-[38px] leading-[1.25] lg:text-[57px] lg:leading-[1.3]">
              <RichText text={growth.title} accentClass="font-accent italic text-paper" />
            </h2>
            <p className="mt-6 text-[18px]">{growth.eyebrow}</p>
            <Link href="/contact" className="btn-pill mt-6 text-[14px]">
              Get a Quote <ArrowDownRight />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. How we work */}
      <section className="container-content section-space pb-20 lg:pb-24">
        <div className="grid gap-8 md:grid-cols-[422fr_550fr] md:gap-9">
          <div className="relative aspect-[422/565] overflow-hidden rounded-[20px]" data-reveal>
            <Image src={images.process} alt="Sunlight on angled glass panels" fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
          </div>
          <div className="md:pt-3">
            <SectionTitle eyebrow={processIntro.eyebrow}>{processIntro.title}</SectionTitle>
            <ol className="mt-6 space-y-6">
              {process.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[52px_1fr] gap-x-0" data-reveal>
                  <span className="font-accent text-[38px] italic leading-none text-gold">{String(i + 1).padStart(2, '0')}.</span>
                  <div>
                    <h3 className="pt-2 text-[18px] font-medium text-ink">{step.title}</h3>
                    <p className="mt-3 text-[16px] leading-[1.2] text-body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ title, body, className = '' }: { title: string; body: string; className?: string }) {
  return (
    <div className={`card flex flex-col justify-center p-5 lg:px-[18px] lg:py-12 ${className}`} data-reveal>
      <h3 className="text-[24px] leading-[1.4] text-ink lg:text-[27px]">
        <RichText text={title} accentClass="accent block" />
      </h3>
      <p className="mt-6 text-[16px] leading-[1.4] text-ink lg:mt-12">{body}</p>
    </div>
  );
}

function ProjectText({
  title,
  body,
  href,
  external = false,
  className = '',
}: {
  title: string;
  body: string;
  href: string;
  external?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${className}`} data-reveal>
      <h3 className="text-[24px] uppercase leading-[1.4] text-ink lg:text-[27px]">{title}</h3>
      <p className="mt-5 text-[16px] leading-[1.4] text-muted">{body}</p>
      <Link
        href={href}
        className="btn-outline mt-8 self-start lg:mt-auto"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        View Project <ArrowRight />
      </Link>
    </div>
  );
}

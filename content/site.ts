// All site copy, contact details and navigation live here.
// Text is taken from the live site (modconbuilders.com), with typos fixed.
// In titles, *word* renders as a gold italic accent and **word** as bold (see components/RichText.tsx).

export const site = {
  name: 'Modcon Builders',
  url: 'https://www.modconbuilders.com',
  title: 'Luxury Real Estate | Construction | Modcon Builders | Hyderabad',
  description:
    'Modcon Builders is a Hyderabad-based construction and real-estate firm known for its dedication to excellence and innovative approach, delivering high-end projects that reflect quality, precision, and sophisticated design.',
  phone: '+91 9534869999',
  phoneHref: 'tel:+919534869999',
  email: 'modconbuilders@gmail.com',
  salesEmail: 'modconbuilderpvt.ltd@gmail.com',
  regions: 'Hyderabad | UAE',
  offices: [
    {
      label: 'Head Office Hyderabad',
      lines: ['8th floor, The District, Myscape Rd, Financial District,', 'Nanakramguda, Hyderabad, Telangana 500008'],
    },
    {
      label: 'Dubai',
      lines: ['Maya 4, 1501, Jumeirah Village Triangle (JVT), Dubai'],
    },
  ],
};

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/modconbuilders/' },
  { label: 'YouTube', href: 'https://youtube.com/@modconbuilders' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1Az3T16mny/' },
];

export const whatsappHref = 'https://wa.me/message/NF3QEBTUO5ISG1';
export const mapsHref = 'https://g.co/kgs/pQjH4TV';
export const brochureHref = 'https://drive.google.com/file/d/1bcJR2VKuC2n2l_NF8aEcS08FOMtzt7gG/view?usp=sharing';
// The District, Financial District (the pin used on the live site).
export const mapEmbedSrc = 'https://www.google.com/maps?q=17.4663867,78.3750654&z=15&output=embed';

// Full-screen menu (hamburger) on the main pages.
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Modcon One', href: '/modcon-one' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Agartha : Roots of Earth', href: 'https://www.agartha.in/' },
  { label: 'Contact Us', href: '/contact' },
];

// In-page links in the Modcon One header.
export const modconOneNav = [
  { label: 'About', href: '#about' },
  { label: 'Why Modcon One', href: '#why' },
  { label: 'Living Experience', href: '#living' },
  { label: 'Location', href: '#location' },
  { label: 'FAQ', href: '#faq' },
];

export const images = {
  homeHero: ['/images/home-hero-1.jpg', '/images/home-hero-2.jpg'],
  legacy: '/images/legacy.jpg',
  about: '/images/about.jpg',
  expertise: '/images/expertise.jpg',
  innovation: '/images/innovation.jpg',
  agartha: '/images/agartha.jpg',
  modconOneTower: '/images/modcon-one-tower.jpg',
  award: '/images/award.jpg',
  process: '/images/process.jpg',
  m1HeroBuilding: '/images/m1-hero-building.png',
  m1Gallery: [
    '/images/m1-courtyard.jpg',
    '/images/modcon-one-tower.jpg',
    '/images/m1-pavilion.jpg',
    '/images/m1-yoga.jpg',
    '/images/m1-pool.jpg',
  ],
  m1Villaments: ['/images/m1-bedroom.jpg', '/images/m1-lounge.jpg', '/images/m1-dining.jpg'],
  m1SylTower: '/images/m1-syl-tower.jpg',
  m1Closing: '/images/home-hero-2.jpg',
};

export const home = {
  award: {
    eyebrow: 'Our Achievements',
    title: 'Acknowledged for Transforming *Visions* into *Reality*',
    body: 'We are thrilled to receive the **Outlook Business Spotlight Entity Award - 2024** by **Business Mint** for our visionary **Agartha Project.** Guided by the dynamic leadership of **Chandu Reddy** and **Manikanta Sridhar Malladi**, this recognition celebrates our commitment to innovation, quality, and sustainable living.',
  },
  hero: {
    title: 'Building beyond expectations',
    body: "Modcon is a visionary construction and real-estate firm that's redefining the urban landscape.",
  },
  about: {
    eyebrow: 'About Us',
    title: 'A Team Dedicated to Building *Your Future*',
    paragraphs: [
      'We believe that architecture has the power to transform lives, foster connections and create a sense of belonging. Our approach is centered around innovation, creativity and a deep understanding of the human experience.',
      'To build trust, value, and long-lasting relationships with our clients, partners and stakeholders by delivering exceptional construction projects that meet the highest standards of quality, safety and sustainability.',
    ],
  },
  legacy: {
    eyebrow: 'Welcome to Modcon',
    title: 'A Legacy of Trust & *Quality*',
    body: "We're passionate about creating iconic, sustainable, and functional landmarks that inspire and elevate communities.",
  },
  solutions: {
    eyebrow: 'Our Speciality',
    title: 'Cutting Edge *Solutions*',
    items: [
      {
        title: 'Uncompromising Quality Standards',
        icon: '/images/icon-quality.webp',
        body: 'Every project is crafted with meticulous attention to quality, ensuring longevity and aesthetic appeal.',
      },
      {
        title: 'Sustainable Building Practices',
        icon: '/images/icon-sustainable.webp',
        body: 'We incorporate eco-friendly methods and materials, promoting a responsible approach to construction.',
      },
      {
        title: 'Experienced & Skilled Team',
        icon: '/images/icon-team.webp',
        body: 'Our professionals bring expertise and dedication to deliver projects that exceed expectations.',
      },
      {
        title: 'Timely Project Delivery',
        icon: '/images/icon-delivery.webp',
        body: 'With structured timelines and efficient processes, we meet deadlines without compromising on quality.',
      },
    ],
  },
  sustainability: {
    eyebrow: 'Why Choose Us',
    title: 'Sustainability Built into *Every Project*',
    items: [
      {
        title: 'Expertise In Modern *Construction*',
        body: 'With years of experience, we specialize in delivering cutting-edge architectural designs and robust construction, ensuring homes and spaces built to last.',
      },
      {
        title: 'Sustainability & *Innovation*',
        body: 'We are committed to building eco-friendly and energy-efficient structures that align with the latest industry trends and environmental standards.',
      },
    ],
  },
  projects: {
    eyebrow: 'Our Projects',
    title: 'Explore Our Diverse Projects',
    agartha: {
      title: 'AGARTHA : ROOTS OF EARTH',
      body: "Agartha is a regenerative permaculture farmland project where nature's wisdom guides our journey towards a more resilient and abundant future.",
      href: 'https://agartha.in',
    },
    modconOne: {
      eyebrow: 'UAE • HYDERABAD',
      title: 'MODCON ONE – Where Business Meets Future Growth',
      body: 'High-visibility commercial spaces designed for strong rental demand and long-term appreciation.',
      href: '/modcon-one',
    },
  },
  growth: {
    title: '*Empowering* Growth Across *Borders*',
    eyebrow: 'UAE • HYDERABAD',
  },
  processIntro: {
    eyebrow: 'How We Work',
    title: 'Step-by-Step to Your Vision',
  },
  process: [
    {
      title: 'Planning & Design',
      body: 'We will develop a comprehensive infrastructure plan, including amenities and utilities. Our team of architects will design eco-friendly, modern construction tailored to your specific needs.',
    },
    {
      title: 'Construction & Quality Control',
      body: 'Skilled professionals bring the design to life with precision and quality at the forefront. We adhere to strict quality standards.',
    },
    {
      title: 'Final Touches & Handover',
      body: 'After construction, we conduct rigorous inspections and finalize details, ensuring every element aligns with your vision.',
    },
  ],
};

export const modconOne = {
  seo: {
    title: 'MODCON ONE Tukkuguda | Commercial Investment Near Airport Hyderabad',
    description:
      'Discover MODCON ONE, a premium mixed-use project in Tukkuguda near ORR Exit 14. Ideal for retail, office & F&B investments with high rental potential and strong appreciation. Enquire now for price sheet & availability.',
  },
  hero: {
    eyebrow: 'A premium mixed development on 200 ft Srisailam Highway, Tukkuguda',
    title: 'Where Business Meets Peaceful Living',
  },
  intro: {
    title: 'A New Standard of Living & Business in Tukkuguda',
    body: 'A premium mixed development on 200 ft Srisailam Highway, Tukkuguda',
    ctaTitle: 'Experience It Before You Decide',
    ctaBody: 'Visit the location, evaluate the growth corridor, and make a confident investment decision.',
  },
  about: {
    eyebrow: 'About MODCON ONE',
    paragraphs: [
      'This is not just another real estate project.\nThis is a future-ready ecosystem designed for modern lifestyles.',
      'Spread across 4.5 acres in Tukkuguda',
      "Located on the fast-growing Srisailam Highway corridor, this project is positioned at the center of Hyderabad's next big growth zone.",
    ],
  },
  philosophy: {
    eyebrow: 'Design Philosophy',
    title: 'Inspired by Biophilic Design, the Project brings Nature into Everyday Living.',
    body: 'This is not just living. This is living Connected to Nature.',
  },
  villaments: {
    eyebrow: 'Residential Villament Living',
    title: '3 BHK & 4 BHK Premium Villaments',
    items: [
      {
        title: 'Your Own Private Living Sanctuary',
        body: 'Enjoy the freedom of expansive spaces, minimal shared walls, and a home designed for true personal privacy.',
      },
      {
        title: 'Effortless Living, Every Single Day',
        body: 'Experience low-maintenance living with modern utilities, seamless services, and everything you need within reach.',
      },
      {
        title: 'A Secure, Connected Way of Living',
        body: 'Be part of a well-planned gated community that offers safety, shared spaces, and a sense of belonging for your family.',
      },
    ],
  },
  commercial: {
    eyebrow: 'Commercial Zone',
    title: 'A Complete Commercial Ecosystem',
    body: 'MODCON ONE offers a well-planned commercial space designed for growth and convenience.',
    items: [
      { icon: '/images/icon-suite.png', title: '5-Star Suite Rooms', body: 'Premium suite spaces designed for high-value stays and elevated guest experiences.' },
      { icon: '/images/icon-hospital.png', title: 'Hospitals & Healthcare Spaces', body: 'Dedicated healthcare-ready spaces built for accessibility, trust, and continuous demand.' },
      { icon: '/images/icon-office.png', title: 'Modern Office Spaces', body: 'Future-ready offices designed for productivity, scalability, and business growth.' },
      { icon: '/images/icon-food.png', title: 'Food & Beverage', body: 'High-footfall dining zones (cafes, restaurants) crafted for daily traffic and destination experiences.' },
      { icon: '/images/icon-retail.png', title: 'Premium Retail Outlets', body: 'Front-facing retail spaces built to maximize visibility, walk-ins, and brand presence.' },
      // Same text as the retail item on the live site; needs its own copy.
      { icon: '/images/icon-convenience.png', title: 'Daily Convenience Stores', body: 'Front-facing retail spaces built to maximize visibility, walk-ins, and brand presence.' },
    ],
  },
  syl: {
    title: 'MODCON Syl Residences',
    subtitle: 'Where Nature Meets Peaceful Living',
    lead: ['Not just a home…', 'a calm and refreshing lifestyle.'],
    body: 'Welcome to MODCON Syl Residences, a premium villament community inside MODCON ONE, designed for those who value space, privacy, and a connection to nature.',
  },
  wellness: {
    eyebrow: 'Wellness & Club-House',
    title: 'This project is built around health, peace, and well-being.',
    body: 'A lifestyle where stress reduces, health improves, and life feels balanced.',
    // Copied from the live site, where these descriptions don't match their headings; needs new copy.
    items: [
      { image: '/images/m1-yoga.jpg', title: 'Yoga Pavilion & Meditation Zones', body: 'Wake up to uninterrupted green views that bring calm to your everyday living.' },
      { image: '/images/m1-gym.jpg', title: 'Fully Equipped Gym', body: 'Sunlit interiors designed to keep your home bright, open, and energizing all day.' },
      { image: '/images/m1-pool.jpg', title: 'Infinity Swimming Pool', body: 'Experience a quieter, more peaceful life away from the chaos, yet well connected.' },
      { image: '/images/m1-coworking.jpg', title: 'Co-Working Spaces', body: 'Experience a quieter, more peaceful life away from the chaos, yet well connected.' },
    ],
  },
  location: {
    eyebrow: 'Our Location',
    title: 'Nearby Conveniences',
    address: 'Modcon, The District, 8th floor, Financial District, Hyderabad, Telangana.',
  },
  visit: {
    eyebrow: 'Book Your Private Site Visit',
    purposes: ['Investment (Rental Income)', 'Business Use', 'Long-Term Appreciation'],
    timeSlots: ['Morning (10 AM – 1 PM)', 'Afternoon (1 PM – 4 PM)', 'Evening (4 PM – 7 PM)'],
    consent:
      'By providing Modcon Builders your contact information, you acknowledge and agree to receiving marketing communications, including through automated calls, texts, and emails, some of which may come from our sales team. This consent isn’t necessary for purchasing any products or services and you may opt out at any time.',
    body: 'Get access to live pricing, available units, and investment insights before the next price revision.',
  },
  faq: {
    title: 'Have questions about buying a home?',
    body: "We've gathered the most common ones to help you navigate the process with ease. If you need more details, feel free to reach out!",
    items: [
      {
        q: 'Why is MODCON ONE a strong investment?',
        a: "Because it sits in Hyderabad's airport-led 4th city growth corridor with integrated commercial and residential demand.",
      },
      { q: 'Is this good for rental income?', a: 'Yes. The mixed-use district and airport connectivity significantly improve leasing demand.' },
      { q: 'How close is the airport?', a: 'Rajiv Gandhi International Airport is approximately 10–15 minutes away.' },
      {
        q: 'Is this suitable for end-use families?',
        a: 'Absolutely. The Syl Residences section is built around wellness, privacy, and biophilic living.',
      },
      { q: 'Are commercial spaces available?', a: 'Yes, premium retail, office, and F&B formats are part of the commercial district.' },
      { q: 'Is this an early launch opportunity?', a: 'Yes, this is ideal for buyers targeting phase-entry appreciation upside.' },
      {
        q: 'What makes the location future-ready?',
        a: 'ORR connectivity, airport growth, Fab City proximity, and the 4th city development vision.',
      },
      { q: 'How do I get the latest price sheet?', a: 'Simply use the form below to request the latest inventory and pricing availability.' },
    ],
  },
  closing: ['A Complete Mixed Development', 'MODCON Syl Residences', 'A Peaceful Living Experience Within'],
};

export const contact = {
  seo: { title: 'Contact Modcon Builders', description: 'Get in touch with Modcon Builders in Hyderabad and Dubai.' },
  title: "We're here to serve your next high-end cutting-edge project.",
  body: "Please fill in the form and we'll get back to you asap.",
};

export interface WhyUsItem {
  id: string;
  number: string;
  title: string;
  description: string;
  highlightStat: string;
}

export interface ServiceItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  details: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  services: string[];
  result: string;
  description: string;
  imageUrl: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  stepNum: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  imageUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  hoverBio: string;
  socials: {
    linkedin: string;
    twitter: string;
    dribbble: string;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const whyUsData: WhyUsItem[] = [
  {
    id: "why-1",
    number: "01",
    title: "Data-Driven Creativity",
    description: "We merge cutting-edge aesthetics with robust behavioral analytics. Every pixel and micro-interaction is designed to influence conversion metrics.",
    highlightStat: "+145% Avg ROI"
  },
  {
    id: "why-2",
    number: "02",
    title: "Hyper-Performance Tech Stack",
    description: "No bloated builders. We engineer lightweight Next.js and React web apps with optimized animations that load under 1.2 seconds, boosting your SEO core vitals.",
    highlightStat: "99+ Lighthouse Score"
  },
  {
    id: "why-3",
    number: "03",
    title: "Full-Funnel Alignment",
    description: "We don't just build websites; we align your brand strategy, UX journeys, and performance marketing pipelines to construct a unified digital sales engine.",
    highlightStat: "3.2x Scale Factor"
  }
];

export const servicesData: ServiceItem[] = [
  {
    id: "srv-brand",
    iconName: "Compass",
    title: "Brand Strategy",
    description: "Positioning your brand in the future. We map out your target audience, messaging architecture, competitive differentiation, and design visual guidelines that leave a mark.",
    details: ["Market Research", "Identity Design", "Voice & Tone", "Brand Books"]
  },
  {
    id: "srv-uiux",
    iconName: "Figma",
    title: "UI/UX Design",
    description: "Bespoke digital product layouts. We craft intuitive flow architectures, high-fidelity interactive wireframes, and beautiful dark/light themes customized for modern apps.",
    details: ["User Personas", "Wireframing", "Interactive Prototypes", "Design Systems"]
  },
  {
    id: "srv-web",
    iconName: "Layout",
    title: "Web Design",
    description: "Award-winning layouts prioritizing storytelling and conversions. We balance elegant Space Grotesk typography, micro-interactions, and visual storytelling.",
    details: ["Creative Direction", "3D Web Graphics", "Motion Design", "Responsive Layouts"]
  },
  {
    id: "srv-dev",
    iconName: "Code",
    title: "Website Development",
    description: "Clean semantic markup optimized for search engines. We write highly modular React components and Next.js applications that load lighting-fast.",
    details: ["TypeScript", "CSS-in-JS (Emotion)", "GSAP Animations", "Tailored CMS Integrations"]
  },
  {
    id: "srv-app",
    iconName: "Cpu",
    title: "Web Applications",
    description: "Interactive SaaS solutions and customer portals. We build highly interactive web apps featuring complex states, dashboard graphs, and seamless animations.",
    details: ["State Management", "Performance Optimization", "Secure Routing", "Real-Time Interactivity"]
  },
  {
    id: "srv-seo",
    iconName: "Search",
    title: "SEO & Speed Optimization",
    description: "Climbing search rankings organically. We ensure clean semantic structures, server-side render strategies, image lazy-loading, and perfect Core Web Vitals.",
    details: ["SEO Audits", "Core Web Vitals", "Semantic HTML", "Schema Markup"]
  }
];

export const projectsData: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Apex Analytics",
    category: "SaaS Dashboard",
    year: "2025",
    services: ["UI/UX Design", "Next.js", "Web App"],
    result: "+240% User Engagement",
    description: "A futuristic AI-powered analytical dashboard that helps enterprise supply chains visualize real-time inventory anomalies and automate shipping routes.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: "proj-2",
    title: "Luminary Brand",
    category: "Brand Identity & Web",
    year: "2025",
    services: ["Brand Strategy", "Web Design", "GSAP Animations"],
    result: "$12M Series A Funding Raised",
    description: "Rebranding a silicon-valley venture capital firm. We conceptualized a minimal, dark-mode glassmorphic digital presence reflecting their futuristic investment approach.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: "proj-3",
    title: "Vortex Marketplace",
    category: "Web Applications",
    year: "2024",
    services: ["React Development", "SEO", "UX Design"],
    result: "4.8s Lower Bounce Rate",
    description: "A decentralized NFT and digital assets trading network with lightning-fast search filters, drag-and-drop file packaging, and custom animated product reveals.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: "proj-4",
    title: "Nova Health",
    category: "Healthcare UI/UX",
    year: "2024",
    services: ["UI/UX Design", "Landing Pages", "React"],
    result: "92% Patient Satisfaction",
    description: "A clean, modern interface for a telemedicine platform connecting patients to specialized practitioners within 60 seconds. Focused on accessibility and trust.",
    imageUrl: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=1200&h=800&q=80"
  }
];

export const statsData: StatItem[] = [
  {
    id: "stat-1",
    value: 120,
    suffix: "M+",
    label: "Client Revenue Generated",
    description: "We focus on building scalable assets that translate into enterprise value."
  },
  {
    id: "stat-2",
    value: 85,
    suffix: "%",
    label: "Average Traffic Growth",
    description: "Organically scaling brands via modern SEO and visual excellence."
  },
  {
    id: "stat-3",
    value: 300,
    suffix: "+",
    label: "Successful Deployments",
    description: "Flawless web products designed and coded to pixel perfection."
  },
  {
    id: "stat-4",
    value: 99,
    suffix: "%",
    label: "Client Satisfaction Score",
    description: "Our clients stay because we act as dedicated growth partners."
  }
];

export const processData: ProcessStep[] = [
  {
    id: "step-1",
    stepNum: "01",
    title: "Strategy",
    description: "We kick off with deep discovery workshops, auditing your competitors, defining user flows, and mapping the technical blueprints of the application.",
    deliverable: "Strategic Brand & Tech Roadmap"
  },
  {
    id: "step-2",
    stepNum: "02",
    title: "Research",
    description: "Conducting user testing, target demographic analysis, and exploring art directions to ensure our styling aligns with high-end modern expectations.",
    deliverable: "User Journeys & Moodboards"
  },
  {
    id: "step-3",
    stepNum: "03",
    title: "Design",
    description: "We build fully responsive, premium visual prototypes in Figma. Handcrafting typography pairings, custom vectors, grid systems, and motion guidelines.",
    deliverable: "High-Fidelity Figma Prototype"
  },
  {
    id: "step-4",
    stepNum: "04",
    title: "Development",
    description: "Our engineering team translates designs into high-quality TypeScript code. We write optimized Emotion components and implement premium GSAP scroll interactions.",
    deliverable: "Optimized Next.js/React Codebase"
  },
  {
    id: "step-5",
    stepNum: "05",
    title: "Launch",
    description: "Rigorous responsive layout testing, accessibility validation, and performance optimization audits before deploying your brand to the public web.",
    deliverable: "Production-Ready Live Deployment"
  },
  {
    id: "step-6",
    stepNum: "06",
    title: "Growth",
    description: "Analyzing post-launch visitor metrics, optimizing conversion copy, implementing technical SEO updates, and providing continuous design support.",
    deliverable: "Monthly Performance Optimization Report"
  }
];

export const industriesData: IndustryItem[] = [
  { id: "ind-1", name: "SaaS & Tech", description: "Bespoke marketing sites and interactive UI consoles for fast-scaling cloud networks.", iconName: "Cloud" },
  { id: "ind-2", name: "Artificial Intelligence", description: "Designing futuristic data dashboards and interactive graphics that simplify complex AI models.", iconName: "Brain" },
  { id: "ind-3", name: "E-Commerce", description: "High-end product showcase sliders and frictionless transaction flows built to convert.", iconName: "ShoppingBag" },
  { id: "ind-4", name: "Finance & Fintech", description: "Secure, trust-building web applications prioritizing clear data hierarchy and sleek styling.", iconName: "TrendingUp" },
  { id: "ind-5", name: "Healthcare & Biotech", description: "Clean, accessible portals and patient onboarding sequences built to industry compliance.", iconName: "Heart" },
  { id: "ind-6", name: "Real Estate & Spaces", description: "Immersive architectural layouts and interactive map systems mapping luxury residences.", iconName: "Home" },
  { id: "ind-7", name: "Education", description: "Engaging, micro-animated learning platforms designed to maximize information retention.", iconName: "BookOpen" },
  { id: "ind-8", name: "Startups & VCs", description: "Awwwards-worthy landing pages engineered to secure seed capital and talent.", iconName: "Zap" }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: "test-1",
    quote: "Working with MarkitMax transformed our platform completely. They didn't just build a website; they understood our business scaling parameters and engineered a dynamic, beautiful landing page that boosted our SaaS signup conversion rate by 140% in the first quarter alone.",
    author: "Elena Rostova",
    role: "VP of Product",
    company: "Apex Analytics",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    id: "test-2",
    quote: "The visual precision of their layouts is breathtaking. They implemented complex GSAP animations and Lenis scroll effects that flow seamlessly across desktop and mobile devices. Our brand looks premium, minimal, and premium in every aspect.",
    author: "Marcus Chen",
    role: "Creative Director",
    company: "Luminary Capital",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    id: "test-3",
    quote: "Our bounce rate dropped to an all-time low. MarkitMax's code is exceptionally clean and structured. Their team acted as a natural extension of our frontend engineers, delivering a production-ready application within our deadline.",
    author: "Sarah Jenkins",
    role: "Chief Marketing Officer",
    company: "Vortex Marketplace",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80"
  }
];

export const teamData: TeamMember[] = [
  {
    id: "team-1",
    name: "Alex Vane",
    role: "Founder & Creative Director",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&h=500&q=80",
    hoverBio: "10+ years designing digital experiences for global venture funds.",
    socials: { linkedin: "#", twitter: "#", dribbble: "#" }
  },
  {
    id: "team-2",
    name: "Sophia Sterling",
    role: "Lead UI/UX Designer",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&h=500&q=80",
    hoverBio: "Award-winning designer obsessed with dark mode glassmorphism.",
    socials: { linkedin: "#", twitter: "#", dribbble: "#" }
  },
  {
    id: "team-3",
    name: "Viktor Vance",
    role: "Lead Frontend Engineer",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=500&q=80",
    hoverBio: "GSAP wizard who compiles custom animations in his sleep.",
    socials: { linkedin: "#", twitter: "#", dribbble: "#" }
  },
  {
    id: "team-4",
    name: "Nadia K.",
    role: "SEO & Performance Specialist",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=500&q=80",
    hoverBio: "Committed to squeezing every millisecond out of client page-loads.",
    socials: { linkedin: "#", twitter: "#", dribbble: "#" }
  }
];

export const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is your onboarding timeline for new projects?",
    answer: "We typically kick off projects within 1-2 weeks of contract signing. The discovery phase lasts about a week, during which we align on goals, tech stack requirements, and branding directions."
  },
  {
    id: "faq-2",
    question: "Do you build custom CMS integrations?",
    answer: "Yes, we build custom headless CMS schemas (using Sanity, Storyblok, or Contentful) integrated directly with Next.js or React. This allows your team to easily edit copy and media assets without editing code."
  },
  {
    id: "faq-3",
    question: "How do you guarantee site speed with custom animations?",
    answer: "We optimize all animations by using GSAP and CSS transforms which leverage hardware GPU acceleration. We avoid triggering layout repaints, lazy-load all images through responsive formats, and audit assets rigorously."
  },
  {
    id: "faq-4",
    question: "Can we hire you for ongoing design and development support?",
    answer: "Yes, we offer retainer-based growth partnerships for established brands. This grants you dedicated hours per month for product upgrades, new landing page creations, and search engine optimization updates."
  },
  {
    id: "faq-5",
    question: "What assets will we receive at the end of the project?",
    answer: "You will receive full ownership of the production-ready source code repository, final interactive Figma files, a documented custom design system, and custom video walkthrough tutorials for your CMS manager."
  }
];

import type {
  PortfolioData,
  ColorTheme,
} from './types'

export const STORAGE_KEY = 'portfolio-builder:data'

export function createId(): string {
  return crypto.randomUUID()
}

export const DEFAULT_THEME: ColorTheme = {
  primary: '#0f172a',
  secondary: '#1e293b',
  accent: '#3b82f6',
  background: '#0b1120',
  surface: '#131c31',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
}

export function createEmptyPortfolioData(): PortfolioData {
  return {
    hero: {
      name: '',
      title: '',
      tagline: '',
      profileImage: '',
      resumeUrl: '',
      videoUrl: '',
      socialLinks: [],
    },
    about: {
      title: '',
      description: '',
      image: '',
      stats: [],
    },
    services: [],
    skills: [],
    stats: [],
    projects: [],
    testimonials: [],
    blog: [],
    contact: {
      email: '',
      phone: '',
      address: '',
      newsletterTitle: '',
      newsletterDescription: '',
    },
    footer: {
      copyright: '',
      madeWith: '',
      socialLinks: [],
    },
    theme: { ...DEFAULT_THEME },
    sections: {
      hero: true,
      about: true,
      services: true,
      skills: true,
      stats: true,
      projects: true,
      testimonials: true,
      blog: true,
      contact: true,
      footer: true,
    },
  }
}

export function createSamplePortfolioData(): PortfolioData {
  return {
    hero: {
      name: 'John Doe',
      title: 'UI/UX Designer',
      tagline: 'Specializing in modern web & mobile design',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      resumeUrl: '#',
      videoUrl: '#',
      socialLinks: [
        { platform: 'Facebook', url: '#', icon: 'facebook' },
        { platform: 'Dribbble', url: '#', icon: 'dribbble' },
        { platform: 'Behance', url: '#', icon: 'behance' },
        { platform: 'LinkedIn', url: '#', icon: 'linkedin' },
      ],
    },
    about: {
      title: 'About Me',
      description:
        'I am a passionate UI/UX Designer with over 8 years of experience creating beautiful, functional digital experiences. I specialize in turning complex problems into simple, elegant solutions that delight users and drive business growth.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop',
      stats: [
        { label: 'Years Experience', value: '8+' },
        { label: 'Happy Clients', value: '150+' },
        { label: 'Projects Done', value: '300+' },
        { label: 'Awards Won', value: '12' },
      ],
    },
    services: [
      {
        id: createId(),
        title: 'UI/UX Design',
        description:
          'Crafting intuitive interfaces and seamless user experiences through research, wireframing, prototyping, and visual design.',
        icon: 'palette',
      },
      {
        id: createId(),
        title: 'Web Development',
        description:
          'Building responsive, performant websites and applications using modern frameworks and best practices.',
        icon: 'code',
      },
      {
        id: createId(),
        title: 'Illustration',
        description:
          'Creating custom illustrations, icons, and visual assets that bring your brand story to life.',
        icon: 'pen-tool',
      },
      {
        id: createId(),
        title: 'Brand Identity',
        description:
          'Developing cohesive brand identities including logos, color systems, typography, and brand guidelines.',
        icon: 'award',
      },
      {
        id: createId(),
        title: 'Mobile Design',
        description:
          'Designing native and cross-platform mobile experiences that feel natural and engaging on every device.',
        icon: 'smartphone',
      },
      {
        id: createId(),
        title: 'Consulting',
        description:
          'Providing expert design and technology consulting to help you make informed decisions for your projects.',
        icon: 'users',
      },
    ],
    skills: [
      { id: createId(), name: 'Communication', percentage: 75 },
      { id: createId(), name: 'Leadership', percentage: 70 },
      { id: createId(), name: 'Teamwork', percentage: 90 },
      { id: createId(), name: 'Flexibility', percentage: 80 },
      { id: createId(), name: 'Creativity', percentage: 95 },
      { id: createId(), name: 'Problem Solving', percentage: 85 },
    ],
    stats: [
      { id: createId(), label: 'Happy Clients', value: '258', suffix: '+' },
      { id: createId(), label: 'Project Complete', value: '590', suffix: 'K' },
      { id: createId(), label: 'Years of Experience', value: '28', suffix: '+' },
      { id: createId(), label: 'Awards Won', value: '45', suffix: '+' },
    ],
    projects: [
      {
        id: createId(),
        title: 'E-Commerce Platform Redesign',
        category: 'Web Design',
        description:
          'A complete redesign of a major e-commerce platform focusing on conversion optimization and user experience.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        tags: ['UI/UX', 'Research', 'Prototyping'],
        link: '#',
      },
      {
        id: createId(),
        title: 'Mobile Banking App',
        category: 'Mobile App',
        description:
          'Designed a secure, user-friendly mobile banking experience with biometric authentication and real-time notifications.',
        image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=600&h=400&fit=crop',
        tags: ['Mobile', 'Fintech', 'UX'],
        link: '#',
      },
      {
        id: createId(),
        title: 'Healthcare Dashboard',
        category: 'Dashboard',
        description:
          'An intuitive analytics dashboard for healthcare providers to track patient outcomes and operational metrics.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        tags: ['Dashboard', 'Data Viz', 'Healthcare'],
        link: '#',
      },
      {
        id: createId(),
        title: 'SaaS Landing Page',
        category: 'Web Design',
        description:
          'High-converting landing page design for a B2B SaaS startup, featuring animated illustrations and clear CTAs.',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
        tags: ['Landing Page', 'SaaS', 'Conversion'],
        link: '#',
      },
      {
        id: createId(),
        title: 'Brand Identity System',
        category: 'Branding',
        description:
          'Comprehensive brand identity including logo, color palette, typography, and brand guidelines for a tech startup.',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        tags: ['Branding', 'Identity', 'Design System'],
        link: '#',
      },
      {
        id: createId(),
        title: 'Fitness Tracking App',
        category: 'Mobile App',
        description:
          'A cross-platform fitness app with workout tracking, nutrition planning, and social features for community motivation.',
        image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop',
        tags: ['Mobile', 'Health', 'Social'],
        link: '#',
      },
    ],
    testimonials: [
      {
        id: createId(),
        name: 'Sarah Johnson',
        role: 'CEO',
        company: 'TechCorp',
        quote:
          'Working with John was an absolute pleasure. He transformed our outdated website into a modern, user-friendly platform that our customers love. His attention to detail and creative vision exceeded our expectations.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        rating: 5,
      },
      {
        id: createId(),
        name: 'Michael Chen',
        role: 'Product Manager',
        company: 'StartupHub',
        quote:
          'John has an incredible ability to understand user needs and translate them into beautiful, functional designs. Our conversion rates improved by 40% after the redesign he led.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 5,
      },
      {
        id: createId(),
        name: 'Emily Rodriguez',
        role: 'Marketing Director',
        company: 'BrandWave',
        quote:
          'The branding package John created for us was nothing short of exceptional. He captured our vision perfectly and delivered a cohesive identity that resonates with our target audience.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        rating: 4,
      },
    ],
    blog: [
      {
        id: createId(),
        title: 'The Future of UI Design: Trends to Watch in 2024',
        excerpt:
          'Explore the emerging trends shaping the world of user interface design, from neumorphism to micro-interactions and beyond.',
        date: 'Jan 15, 2024',
        image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&h=400&fit=crop',
        category: 'Design',
        link: '#',
        author: 'John Doe',
      },
      {
        id: createId(),
        title: 'Building Accessible Web Applications',
        excerpt:
          'Learn how to make your web applications more inclusive with practical accessibility techniques and best practices.',
        date: 'Feb 3, 2024',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        category: 'Development',
        link: '#',
        author: 'John Doe',
      },
      {
        id: createId(),
        title: 'Mastering Design Systems for Scale',
        excerpt:
          'A comprehensive guide to creating and maintaining design systems that enable teams to build consistent products at scale.',
        date: 'Mar 22, 2024',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=400&fit=crop',
        category: 'Design Systems',
        link: '#',
        author: 'John Doe',
      },
    ],
    contact: {
      email: 'hello@johndoe.com',
      phone: '+1 (555) 123-4567',
      address: 'San Francisco, CA 94105',
      newsletterTitle: 'Subscribe to My Newsletter',
      newsletterDescription:
        'Stay updated with my latest projects, design tips, and industry insights. No spam, unsubscribe anytime.',
    },
    footer: {
      copyright: '© 2024 John Doe. All rights reserved.',
      madeWith: 'Made with ❤️ by John Doe',
      socialLinks: [
        { platform: 'Facebook', url: '#', icon: 'facebook' },
        { platform: 'Twitter', url: '#', icon: 'twitter' },
        { platform: 'Dribbble', url: '#', icon: 'dribbble' },
        { platform: 'LinkedIn', url: '#', icon: 'linkedin' },
        { platform: 'GitHub', url: '#', icon: 'github' },
      ],
    },
    theme: { ...DEFAULT_THEME },
    sections: {
      hero: true,
      about: true,
      services: true,
      skills: true,
      stats: true,
      projects: true,
      testimonials: true,
      blog: true,
      contact: true,
      footer: true,
    },
  }
}

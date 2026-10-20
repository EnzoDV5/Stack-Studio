import type { StackBuild, Technology, TechnologyLayer } from '@/types/technology'

export const technologyContent = {
  heading: 'The stack behind the work',
  pauseLabel: 'Pause animation',
  resumeLabel: 'Resume animation',
}

// Brand assets are served locally. Versions and sources: public/logos/technologies/README.md.
// These are capabilities, not partner endorsements or a list of this site's dependencies.
export const technologies: readonly Technology[] = [
  {
    id: 'figma',
    name: 'Figma',
    categories: ['Design'],
    description: 'UX/UI design and interface prototyping',
    logo: '/logos/technologies/figma.svg',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    categories: ['Languages', 'Frontend', 'Backend'],
    description: 'Web and server-side application development',
    logo: '/logos/technologies/javascript.svg',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    categories: ['Languages', 'Frontend', 'Backend', 'Mobile', 'Desktop'],
    description: 'Typed applications across web, mobile and desktop',
    logo: '/logos/technologies/typescript.svg',
  },
  {
    id: 'html5',
    name: 'HTML5',
    categories: ['Languages', 'Frontend'],
    description: 'Semantic, accessible websites',
    logo: '/logos/technologies/html5.svg',
  },
  {
    id: 'css3',
    name: 'CSS3',
    categories: ['Languages', 'Frontend'],
    description: 'Responsive layouts and interface styling',
    logo: '/logos/technologies/css3.svg',
  },
  {
    id: 'python',
    name: 'Python',
    categories: ['Languages', 'Backend', 'AI'],
    description: 'Backend systems, automation and data processing',
    logo: '/logos/technologies/python.svg',
  },
  {
    id: 'react',
    name: 'React',
    categories: ['Frontend', 'Desktop'],
    description: 'Interactive web and desktop interfaces',
    logo: '/logos/technologies/react.svg',
  },
  {
    id: 'vite',
    name: 'Vite',
    categories: ['Frontend', 'Tools'],
    description: 'Fast frontend builds and development',
    logo: '/logos/technologies/vite.svg',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    categories: ['Frontend', 'Backend'],
    description: 'Full-stack React websites and web apps',
    logo: '/logos/technologies/nextdotjs.svg',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    categories: ['Frontend'],
    description: 'Consistent, responsive interface styling',
    logo: '/logos/technologies/tailwindcss.svg',
  },
  {
    id: 'shadcn',
    name: 'shadcn/ui',
    categories: ['Frontend'],
    description: 'Composable interface components',
    logo: '/logos/technologies/shadcnui.svg',
  },
  {
    id: 'gsap',
    name: 'GSAP',
    categories: ['Frontend'],
    description: 'Interface animation and scroll experiences',
    logo: '/logos/technologies/gsap.svg',
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    categories: ['Frontend'],
    description: 'Motion for React interfaces',
    logo: '/logos/technologies/framermotion.svg',
  },
  {
    id: 'threejs',
    name: 'Three.js',
    categories: ['Frontend'],
    description: 'Interactive 3D web experiences',
    logo: '/logos/technologies/threedotjs.svg',
  },
  {
    id: 'react-native',
    name: 'React Native',
    categories: ['Mobile'],
    description: 'Cross-platform Android and iOS applications',
    logo: '/logos/technologies/react.svg',
  },
  {
    id: 'expo',
    name: 'Expo',
    categories: ['Mobile'],
    description: 'React Native development and delivery for Android and iOS',
    logo: '/logos/technologies/expo.svg',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    categories: ['Mobile'],
    description: 'Cross-platform Android and iOS applications',
    logo: '/logos/technologies/flutter.svg',
  },
  {
    id: 'electron',
    name: 'Electron',
    categories: ['Desktop'],
    description: 'Desktop applications using web technologies',
    logo: '/logos/technologies/electron.svg',
  },
  {
    id: 'tauri',
    name: 'Tauri',
    categories: ['Desktop'],
    description: 'Lightweight desktop applications with web interfaces',
    logo: '/logos/technologies/tauri.svg',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    categories: ['Backend'],
    description: 'Server-side applications and REST APIs',
    logo: '/logos/technologies/nodedotjs.svg',
  },
  {
    id: 'express',
    name: 'Express',
    categories: ['Backend'],
    description: 'REST APIs, authentication and business systems',
    logo: '/logos/technologies/express.svg',
  },
  {
    id: 'sql',
    name: 'SQL',
    categories: ['Database', 'Languages'],
    description: 'Relational database queries and data modelling',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    categories: ['Database'],
    description: 'Relational SQL databases',
    logo: '/logos/technologies/postgresql.svg',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    categories: ['Database'],
    description: 'NoSQL document databases',
    logo: '/logos/technologies/mongodb.svg',
  },
  {
    id: 'firebase',
    name: 'Firebase / Firestore',
    categories: ['Database', 'Backend', 'Infrastructure'],
    description: 'Firestore NoSQL databases, authentication and Firebase Hosting',
    logo: '/logos/technologies/firebase.svg',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    categories: ['Database', 'Backend'],
    description: 'PostgreSQL databases, authentication and storage',
    logo: '/logos/technologies/supabase.svg',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    categories: ['AI'],
    description: 'API integrations, assistants and document processing',
    logo: '/logos/technologies/openai.svg',
  },
  {
    id: 'claude',
    name: 'Anthropic / Claude',
    categories: ['AI'],
    description: 'AI workflows, data processing and business-system integrations',
    logo: '/logos/technologies/claude.svg',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    categories: ['AI'],
    description: 'Multimodal AI features and automation through APIs',
    logo: '/logos/technologies/googlegemini.svg',
  },
  {
    id: 'docker',
    name: 'Docker',
    categories: ['Infrastructure'],
    description: 'Containerised applications and infrastructure',
    logo: '/logos/technologies/docker.svg',
  },
  {
    id: 'git',
    name: 'Git',
    categories: ['Infrastructure', 'Tools'],
    description: 'Version control',
    logo: '/logos/technologies/git.svg',
  },
  {
    id: 'github',
    name: 'GitHub',
    categories: ['Infrastructure', 'Tools'],
    description: 'Code hosting and collaborative development',
    logo: '/logos/technologies/github.svg',
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    categories: ['Infrastructure'],
    description: 'CI/CD pipelines and automated deployment',
    logo: '/logos/technologies/githubactions.svg',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    categories: ['Infrastructure'],
    description: 'Web application deployment and hosting',
    logo: '/logos/technologies/vercel.svg',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    categories: ['Infrastructure'],
    description: 'Website deployment and hosting',
    logo: '/logos/technologies/netlify.svg',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    categories: ['Infrastructure'],
    description: 'DNS, content delivery and edge infrastructure',
    logo: '/logos/technologies/cloudflare.svg',
  },
  {
    id: 'postman',
    name: 'Postman',
    categories: ['Tools', 'Backend'],
    description: 'API development and testing',
    logo: '/logos/technologies/postman.svg',
  },
  {
    id: 'npm',
    name: 'npm',
    categories: ['Tools'],
    description: 'Package management and development tooling',
    logo: '/logos/technologies/npm.svg',
  },
  {
    id: 'zod',
    name: 'Zod',
    categories: ['Tools', 'Backend'],
    description: 'Schema validation and typed application data',
    logo: '/logos/technologies/zod.svg',
  },
]

// The stack diagram on Studio: the layers in build order, then the kinds of build it filters to.
export const stackContent = {
  eyebrow: 'Our stack', // COPY:
  title: 'The tools behind every build.', // COPY:
  intro:
    'Pick what you need built to see the stack we reach for, layer by layer. Hover or tap a tool for what we use it for.', // COPY:
  filterLabel: 'Show the stack for', // COPY:
  buildsLabel: 'Used for', // COPY:
  closeLabel: 'Close', // COPY:
  countLabel: (shown: number, total: number) =>
    shown === total ? `${total} tools` : `${shown} of ${total} tools`, // COPY:
}

export const technologyLayers: readonly TechnologyLayer[] = [
  { id: 'design', label: 'Design', line: 'How it looks and works', categories: ['Design'] }, // COPY:
  { id: 'languages', label: 'Languages', line: 'What it’s written in', categories: ['Languages'] }, // COPY:
  { id: 'frontend', label: 'Frontend', line: 'What people see and use', categories: ['Frontend'] }, // COPY:
  { id: 'apps', label: 'Apps', line: 'Mobile and desktop', categories: ['Mobile', 'Desktop'] }, // COPY:
  {
    id: 'backend',
    label: 'Backend & data', // COPY:
    line: 'The logic and the data behind it', // COPY:
    categories: ['Backend', 'Database'],
  },
  { id: 'ai', label: 'AI', line: 'Models and assistants', categories: ['AI'] }, // COPY:
  {
    id: 'shipping',
    label: 'Shipping', // COPY:
    line: 'Where it runs and how we ship it', // COPY:
    categories: ['Infrastructure', 'Tools'],
  },
]

// COPY: which tools each kind of build uses. Review against real projects.
export const stackBuilds: readonly StackBuild[] = [
  {
    id: 'all',
    label: 'Everything', // COPY:
    summary: 'Everything we design, build and run with.', // COPY:
    technologies: [],
  },
  {
    id: 'websites',
    label: 'Websites', // COPY:
    summary: 'Fast, animated websites that are easy to find and to run.', // COPY:
    technologies: [
      'figma',
      'html5',
      'css3',
      'javascript',
      'typescript',
      'react',
      'vite',
      'nextjs',
      'tailwind',
      'gsap',
      'threejs',
      'nodejs',
      'git',
      'github',
      'vercel',
      'netlify',
      'cloudflare',
    ],
  },
  {
    id: 'web-apps',
    label: 'Web apps', // COPY:
    summary: 'Typed, tested apps with accounts, data and payments.', // COPY:
    technologies: [
      'figma',
      'typescript',
      'sql',
      'react',
      'nextjs',
      'tailwind',
      'shadcn',
      'framer-motion',
      'nodejs',
      'express',
      'postgresql',
      'supabase',
      'firebase',
      'docker',
      'git',
      'github',
      'github-actions',
      'vercel',
      'postman',
      'zod',
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile apps', // COPY:
    summary: 'One codebase for Android and iOS, with a backend behind it.', // COPY:
    technologies: [
      'figma',
      'typescript',
      'react-native',
      'expo',
      'flutter',
      'nodejs',
      'firebase',
      'supabase',
      'git',
      'github',
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop apps', // COPY:
    summary: 'Desktop tools for your team, built with web technology.', // COPY:
    technologies: [
      'figma',
      'typescript',
      'sql',
      'react',
      'electron',
      'tauri',
      'nodejs',
      'git',
      'github',
      'github-actions',
    ],
  },
  {
    id: 'ai',
    label: 'AI systems', // COPY:
    summary: 'AI built into your business: assistants, documents and workflows.', // COPY:
    technologies: [
      'python',
      'typescript',
      'openai',
      'claude',
      'gemini',
      'nodejs',
      'postgresql',
      'supabase',
      'docker',
      'github',
      'zod',
    ],
  },
]

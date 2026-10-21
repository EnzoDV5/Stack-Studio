import type { CodeEditorContent, Founder, StudioFact, ValueItem } from '@/types'
import { media } from './media'

export const founders: Founder[] = [
  {
    id: 'enzo',
    name: 'Enzo De Vittorio',
    role: 'Co-founder · Front-end and design', // COPY: confirm title
    line: 'Designs and builds the front-end you click through, and works on the back-end too.', // COPY:
    bio: 'Enzo leads UX, visual design, motion and front-end development, and works on the back-end as well, so the whole build hangs together. He cares about sites that are visually strong and actually work.', // COPY:
    focus: ['Front-end', 'UX / UI', 'Motion', 'Back-end'], // COPY:
    portrait: media.founders.enzo,
    // COPY: add the personal LinkedIn URL (the button stays hidden until then)
    linkedin: undefined,
  },
  {
    id: 'armand',
    name: 'Armand Naudé',
    role: 'Co-founder · Back-end and delivery', // COPY: confirm title
    line: 'Builds what runs underneath, helps on the front-end and keeps it all running.', // COPY:
    bio: 'Armand focuses on back-end development, hosting and client delivery, and helps build the front-end too. He makes sure every project ships on time and keeps running smoothly long after launch.', // COPY:
    focus: ['Back-end', 'Hosting', 'Client delivery', 'Front-end'], // COPY:
    portrait: media.founders.armand,
    // COPY: add the personal LinkedIn URL (the button stays hidden until then)
    linkedin: undefined,
  },
]

export const values: ValueItem[] = [
  {
    id: 'proof',
    title: 'Proof over promises', // COPY:
    body: 'We show real work, real process and real prices. You shouldn’t have to take our word for it.', // COPY:
    icon: media.studio.values.proof,
  },
  {
    id: 'craft',
    title: 'Craft, not decoration', // COPY:
    body: 'Every animation, every word, every pixel has a job. If it doesn’t help someone decide, it goes.', // COPY:
    icon: media.studio.values.craft,
  },
  {
    id: 'clarity',
    title: 'Clarity at every step', // COPY:
    body: 'Plain language, honest timelines and a staging link from day one. No black boxes.', // COPY:
    icon: media.studio.values.clarity,
  },
  {
    id: 'partnership',
    title: 'In it for the long run', // COPY:
    body: 'We support the websites and apps we build after launch, with hosting, maintenance and improvements when you need them.', // COPY:
    icon: media.studio.values.longRun,
  },
]

export const principles: ValueItem[] = [
  {
    id: 'direct',
    title: 'Founders on every project', // COPY:
    body: 'We stay involved from the first call to launch, so the thinking behind your project carries all the way through.', // COPY:
  },
  {
    id: 'growing',
    title: 'Growing with our clients', // COPY:
    body: 'We’re building a studio that grows with the businesses we work for: more people and more capability, with the same attention on every project.', // COPY:
  },
  {
    id: 'real',
    title: 'Real, deployed products', // COPY:
    body: 'Design and development under one roof, so what you approve is what gets built.', // COPY:
  },
]

/** Under the Studio page title, beside the team illustration. */
export const studioFacts: StudioFact[] = [
  { label: 'Based in', value: 'Centurion, South Africa' }, // COPY:
  { label: 'Founded by', value: 'Enzo and Armand' }, // COPY:
  { label: 'We build', value: 'Websites, apps and software' }, // COPY:
]

/**
 * "Who we are" as code: the founders take turns typing one build, each in their own area
 * (Enzo design and front-end, Armand back-end and delivery) and across both. Keep every line
 * under ~46 characters so it fits the editor on a phone.
 */
export const teamEditor: CodeEditorContent = {
  label:
    'A code editor where Enzo and Armand write one build together: strategy, UX, visual design and motion, then the API and data, then launch with hosting and care. The build passes.', // COPY:
  project: 'stack-studio',
  explorerTitle: 'Explorer', // COPY:
  explorer: [
    { name: 'design', depth: 0, folder: true },
    { name: 'strategy.ts', depth: 1 },
    { name: 'ux.ts', depth: 1 },
    { name: 'visual.ts', depth: 1 },
    { name: 'motion.ts', depth: 1 },
    { name: 'dev', depth: 0, folder: true },
    { name: 'api.ts', depth: 1 },
    { name: 'data.ts', depth: 1 },
    { name: 'hosting.ts', depth: 1 },
    { name: 'one-team.ts', depth: 0 },
  ],
  tabs: ['one-team.ts', 'motion.ts', 'api.ts'],
  breadcrumb: ['stack-studio', 'one-team.ts', 'build()'],
  // COPY: the code itself (it should read like the "Who we are" paragraphs)
  runs: [
    {
      author: 'Enzo',
      lines: [
        '// one team, both ends of every build',
        'import { strategy, ux, visual, motion }',
        "  from './design'",
      ],
    },
    {
      author: 'Armand',
      lines: ["import { api, data, hosting } from './dev'", ''],
    },
    {
      author: 'Enzo',
      lines: [
        'export const team = {',
        "  base: 'Centurion, ZA',",
        "  founders: ['Enzo', 'Armand'],",
        "  crafts: ['strategy', 'ux', 'visual',",
        "    'motion', 'front-end', 'back-end'],",
        '}',
        '',
      ],
    },
    {
      author: 'Armand',
      lines: ['export async function build(business) {'],
    },
    {
      author: 'Enzo',
      lines: [
        '  const story = strategy(business.difference)',
        '  const site = await ux(story, business.users)',
        '    .then(visual)',
        '    .then(motion)',
      ],
    },
    {
      author: 'Armand',
      lines: [
        '  await api(site).connect(data)',
        '  // after launch: host, care, keep improving',
        '  return hosting.launch(site, { care: true })',
        '}',
      ],
    },
  ],
  terminal: {
    tabs: ['Terminal', 'Problems', 'Output'], // COPY:
    prompt: '~/stack-studio $',
    command: 'npm run build',
    output: [
      'design   strategy · ux · visual · motion', // COPY:
      'develop  front-end · back-end · data', // COPY:
      'launch   live, hosted and cared for', // COPY:
    ],
  },
  status: {
    branch: 'main',
    live: 'Live · Enzo, Armand', // COPY:
    items: ['TypeScript', 'UTF-8'],
    position: (line, column) => `Ln ${line}, Col ${column}`, // COPY:
  },
}

import type { ProcessStep } from '@/types'

export const processSteps: ProcessStep[] = [
  {
    id: 'discover',
    title: 'Discover', // COPY:
    duration: 'Week 1', // COPY:
    span: { from: 1, to: 1 },
    summary:
      'A short call and a structured brief, so we understand the business, not just the website.', // COPY:
    points: ['Goals and audience', 'What exists today', 'Fixed quote and timeline'], // COPY:
  },
  {
    id: 'define',
    title: 'Define', // COPY:
    duration: 'Week 1–2', // COPY:
    span: { from: 1, to: 2 },
    summary: 'Sitemap, user flow and content plan, agreed before any pixels are pushed.', // COPY:
    points: ['Sitemap and user flow', 'Content plan', 'Wireframes'], // COPY:
  },
  {
    id: 'design',
    title: 'Design', // COPY:
    duration: 'Week 2–4', // COPY:
    span: { from: 2, to: 4 },
    summary: 'High-fidelity design for desktop and mobile, with motion direction you can feel.', // COPY:
    points: ['Visual direction', 'Desktop and mobile', 'Two rounds of feedback'], // COPY:
  },
  {
    id: 'build',
    title: 'Build', // COPY:
    duration: 'Week 3–6', // COPY:
    span: { from: 3, to: 6 },
    summary: 'A real, responsive build on a staging link you can click through as it grows.', // COPY:
    points: ['Responsive development', 'CMS and integrations', 'Speed and accessibility'], // COPY:
  },
  {
    id: 'launch',
    title: 'Launch', // COPY:
    duration: 'Week 6', // COPY:
    span: { from: 6, to: 6 },
    summary: 'Testing, deployment, analytics and a handover session. Then we go live together.', // COPY:
    points: ['Cross-device testing', 'Deployment and DNS', 'Training and handover'], // COPY:
  },
  {
    id: 'care',
    title: 'Care', // COPY:
    duration: 'Ongoing', // COPY:
    span: { from: 7, to: 7 },
    summary:
      'Hosting, updates and monthly improvements, so the site keeps working as hard as you do.', // COPY:
    points: ['Hosting and backups', 'Monthly edits', 'Growth reporting'], // COPY:
  },
]

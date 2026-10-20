// The Skills page (S, /skills), under About in the index (Jayanth, 2026-10-19). Every item comes
// from about-me.md: §6 Skills, the product areas in §3 (Jayanth, 2026-10-16) and the scope of
// each [GP] item, and §5 for certifications. Workday is left off on purpose (§6: end user only).
// No dashes, at Jayanth's request.

export type SkillGroup = { name: string; items: string[] }

export const skillGroups: SkillGroup[] = [
  {
    name: 'Product',
    items: [
      'Customer discovery and pain-point research',
      '0-to-1 product work',
      'Requirements and PRDs',
      'Roadmap prioritization',
      'User personas and journeys',
      'Market sizing (TAM, SAM, SOM) and competitive research',
      'User testing and UAT',
      'Supporting go-to-market',
      'Building under HIPAA',
    ],
  },
  {
    name: 'Business analysis',
    items: ['Business architecture', 'BRDs, user stories and functional specs'],
  },
  {
    name: 'AI',
    items: [
      'Writing prompts and running evals for an AI assistant',
      'Report extraction (OCR, LLM and VLM) with field-level evals',
      'Drafting PRDs, user stories and acceptance criteria with Claude Code',
      'Prototyping and building with Claude and Claude Code',
      'Competitive scans with Perplexity and Claude',
    ],
  },
  {
    name: 'Design',
    items: ['Wireframes and prototypes in Figma and Miro', 'Graphic design'],
  },
  {
    name: 'Platforms',
    items: ['Salesforce (CRM)', 'Pega (BPM)', 'Enterprise systems (B2B)', 'Consumer product (B2C)'],
  },
  {
    name: 'Technical',
    items: [
      'Electronics, IoT and control systems',
      'Technical specs and API contracts',
      'Working closely with engineering teams',
    ],
  },
  {
    name: 'Data',
    items: ['SQL', 'Python (working knowledge)', 'R', 'KPI dashboards, funnel and engagement tracking'],
  },
  {
    name: 'Tools',
    items: ['Jira', 'Asana', 'Miro', 'Notion', 'Figma', 'Salesforce', 'Pega', 'GitHub', 'Vercel', 'Supabase', 'GA4', 'Claude Code'],
  },
  {
    name: 'Certifications',
    items: ['Certified Salesforce Administrator', 'Pega Certified Business Architect', 'Pega Certified System Architect'],
  },
]

// Spoken languages sit with the skills, as in about-me.md §6.
export const languages = { name: 'Languages', items: ['English', 'Hindi (fluent)', 'Telugu (native)'] }

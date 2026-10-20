// Facts come only from about-me.md. Anything marked TODO is still TBD there.

export const intro = {
  // The home page tells Jayanth's story in order (Jayanth, 2026-10-19): who, where from,
  // education, career (timeline below), life, what's next. No Stage Zero story or cancer line
  // on the home screens. Wording from about-me.md, approved by Jayanth 2026-10-19; the closing
  // "ride" line is Jayanth's.
  greeting: "Hey, I'm Jayanth.",
  summary:
    'A product manager who trained as an engineer and built enterprise systems on Pega and Salesforce before moving into product. Want to know more? Buckle up, you\'re in for a ride.',
  // The big line on blue at the end of the hero. Same wording as the approved About me page.
  headline: 'Atlanta, by way of Hyderabad and Boston.',
  education:
    'I studied Electronics and Instrumentation Engineering at Keshav Memorial Institute of Technology in Hyderabad, 2019 to 2023. Then an MS in Information Systems at Northeastern University in Boston, 2024 to 2026.',
  // Life outside work, one line at a time (rack focus). From the approved interest pages.
  life: ['I love cooking.', 'Drake fan since 2012.', 'Gooner, because of Özil.', 'Most at peace in the ocean.'],
  // What's next: Jayanth's aspirations (about-me.md §2, 2026-10-19), lightly edited.
  next:
    "I love being around people, so I end up close to the users: understanding their problems, then planning and building software that helps them stay happy and healthy. Next, I want to do that as a full-time product manager, anywhere in the US.",
  body: [
    'I trained as an engineer in electronics and instrumentation, then moved into enterprise systems, starting as a Pega business architect, then building on Salesforce and Pega as a developer.',
    'Most recently, I was a technical product manager co-op at Stage Zero Health, an early cancer detection startup, where I helped take the product from zero to one.',
    'Cancer has touched my family closely, so healthcare is where I most want to be useful.',
    "I'm looking for full-time PM roles anywhere in the US.",
  ],
}

// The work timeline on the home page's rolling road, oldest first (Jayanth, 2026-10-19).
// From about-me.md §3's timeline. The NGO (Period Society Hyderabad) is left off until it has
// dates. No en dashes in ranges, at Jayanth's request (as on the Work page).
export const timeline = [
  { when: 'Jan to Jun 2023', role: 'Pega Business Architect', org: 'Bluevoir' },
  { when: 'Nov 2023 to Jan 2024', role: 'SDE Intern', org: 'FormulaQ Solutions' },
  { when: 'Feb to Jul 2024', role: 'Pega Developer', org: 'Bluevoir' },
  { when: 'Aug to Dec 2025', role: 'Technical Product Manager, co-op', org: 'Stage Zero Health' },
  { when: 'Jan to Apr 2026', role: 'Graduate Teaching Assistant', org: 'Northeastern University' },
]

export const links = {
  email: 'mailto:jayanthadityaaa@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jayanth-kappagantula',
  github: 'https://github.com/ThisisjayK/',
}

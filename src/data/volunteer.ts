export type VolunteerItem = {
  id: string;
  short: string;
  role: string;
  org: string;
  meta: string;
  url: string;
  image?: string;
  // Optional portrait artwork shown beside the copy on the detail page. Lives in
  // public/ (referenced through BASE_URL so it resolves under the /Portfolio/ base).
  photo?: string;
  photoAlt?: string;
  // Intrinsic pixel size of `photo`. Required whenever `photo` is set: the media
  // grid track is `auto` and the img is `width:auto`, so the column is sized by
  // the image. Without these the box has no aspect ratio to reserve space from
  // and collapses to its borders until the bytes arrive.
  photoW?: number;
  photoH?: number;
  did: string[];
};

export const VOLUNTEER_ITEMS: VolunteerItem[] = [
  {
    id: "fifa-world-cup-2026",
    short: "FIFA World Cup 2026",
    role: "Fan Operations Volunteer",
    org: "FIFA World Cup 2026, Boston Host City",
    meta: "Gillette Stadium, Foxborough · Jun–Jul 2026",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/boston-host-seven-matches-stadium",
    // Hover preview in the volunteer marquee and the detail-page artwork are the
    // same poster; the marquee crops it to a pill via background-size:cover.
    image: "bos.jpg",
    photo: "bos.jpg",
    photoW: 1100,
    photoH: 1414,
    photoAlt:
      "Official FIFA World Cup 26 Boston host-city poster: an illustrated Charles River scene with lobsters, swan boats and the Boston skyline.",
    did: [
      "Worked fan operations across all seven Boston matches, the biggest international soccer event in the world, with around 65,000 fans a match.",
      "Handed out FIFA Fan IDs to fans on each match day.",
      "Guided fans and answered wayfinding questions around the stadium.",
    ],
  },
  {
    id: "the-period-society",
    short: "The Period Society",
    role: "Graphic Designer",
    org: "The Period Society, Hyderabad, India",
    meta: "Youth-run menstrual-equity nonprofit",
    url: "https://www.instagram.com/periodsociety/",
    did: [
      "Designed social-media posts for a youth-run nonprofit working to end the stigma around menstruation.",
      "Supported campaigns widening access to menstrual-health and sex education.",
    ],
  },
  {
    id: "muskurahat-foundation",
    short: "Muskurahat Foundation",
    role: "Fundraiser",
    org: "Muskurahat Foundation, Mumbai, India",
    meta: "Education NGO for children in need",
    url: "https://www.muskurahat.org.in/",
    did: [
      "Raised roughly $1,000 over nine months for the foundation.",
      "Supported an NGO that provides free education to children in Mumbai's slums, orphanages, and shelter homes.",
    ],
  },
];

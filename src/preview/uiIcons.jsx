// Inline SVG icons + HubSpot-style tag for the preview surfaces — replaces emoji
// so the demo reads like product UI. Same pattern as hubIcons.jsx: stroke-based,
// currentColor, viewBox 0 0 24 24, aria-hidden, width/height overridable via props.

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconCalendar = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export const IconMail = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
)

export const IconCheck = (p) => (
  <svg {...base} {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const IconCheckCircle = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
)

export const IconDoc = (p) => (
  <svg {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
)

export const IconBell = (p) => (
  <svg {...base} {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export const IconEye = (p) => (
  <svg {...base} {...p}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const IconStar = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export const IconWarning = (p) => (
  <svg {...base} {...p}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export const IconSearch = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export const IconBook = (p) => (
  <svg {...base} {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

export const IconDollar = (p) => (
  <svg {...base} {...p}>
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export const IconBuilding = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <line x1="9" y1="7" x2="9" y2="7.01" />
    <line x1="15" y1="7" x2="15" y2="7.01" />
    <line x1="9" y1="11" x2="9" y2="11.01" />
    <line x1="15" y1="11" x2="15" y2="11.01" />
    <path d="M10 22v-4h4v4" />
  </svg>
)

export const IconUser = (p) => (
  <svg {...base} {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const IconUsers = (p) => (
  <svg {...base} {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const IconPhone = (p) => (
  <svg {...base} {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const IconNote = (p) => (
  <svg {...base} {...p}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
  </svg>
)

export const IconInfo = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

export const IconSquare = (p) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
)

export const IconTicket = (p) => (
  <svg {...base} {...p}>
    <path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    <line x1="13" y1="5" x2="13" y2="7" />
    <line x1="13" y1="11" x2="13" y2="13" />
    <line x1="13" y1="17" x2="13" y2="19" />
  </svg>
)

export const IconPuzzle = (p) => (
  <svg {...base} {...p}>
    <path d="M19.4 13.5a1.9 1.9 0 0 1 0-3l1.1-1a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0l-1 1.1a1.9 1.9 0 0 1-3 0l-1-1.1a1 1 0 0 0-1.4 0L7.5 8.1a1 1 0 0 0 0 1.4l1.1 1a1.9 1.9 0 0 1 0 3l-1.1 1a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l1-1.1a1.9 1.9 0 0 1 3 0l1 1.1a1 1 0 0 0 1.4 0l2.6-2.6a1 1 0 0 0 0-1.4z" />
  </svg>
)

export const IconBolt = (p) => (
  <svg {...base} {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

export const IconTarget = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

export const IconRefresh = (p) => (
  <svg {...base} {...p}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

export const IconDownload = (p) => (
  <svg {...base} {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export const IconClose = (p) => (
  <svg {...base} {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ---- HubSpot-style tag: 3px radius, tinted background + solid color text ----
const TAG_COLORS = {
  green: { bg: 'rgba(0,189,165,0.12)', fg: '#00A38D' },
  blue: { bg: 'rgba(0,145,174,0.12)', fg: '#0091AE' },
  orange: { bg: 'rgba(255,122,89,0.14)', fg: '#E66E50' },
  red: { bg: 'rgba(242,84,91,0.12)', fg: '#F2545B' },
  gray: { bg: 'rgba(124,152,182,0.14)', fg: '#516F90' },
  purple: { bg: 'rgba(106,120,209,0.12)', fg: '#6A78D1' },
  marigold: { bg: 'rgba(245,194,107,0.2)', fg: '#B8860B' },
}

export function Tag({ color = 'gray', children }) {
  const c = TAG_COLORS[color] || TAG_COLORS.gray
  return (
    <span
      className="inline-block text-[10px] font-semibold rounded-[3px] px-1.5 py-0.5 whitespace-nowrap"
      style={{ background: c.bg, color: c.fg, fontFamily: 'Lexend Deca' }}
    >
      {children}
    </span>
  )
}

// ---- Initials avatar: deterministic color from the name ----
const AVATAR_COLORS = ['#FF7A59', '#0091AE', '#00BDA5', '#6A78D1', '#F2545B', '#2D3E50']

export function avatarColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length
  return AVATAR_COLORS[h]
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function Avatar({ name, size = 28, square = false }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-semibold text-white shrink-0 ${
        square ? 'rounded-[3px]' : 'rounded-full'
      }`}
      style={{ width: size, height: size, background: avatarColor(name), fontSize: Math.max(9, size * 0.36) }}
      title={name}
    >
      {initials(name)}
    </span>
  )
}

// Shared chart library for HubSpot-style preview reports. Pure SVG/JSX, no deps.
// Design goal: charts that feel like real HubSpot reporting — axes, gridlines,
// labels, legends, realistic numbers — not placeholder glyphs.
// Font: Lexend Deca (font-preview). Colors: HubSpot tokens.

export const CHART_COLORS = ['#FF7A59', '#0091AE', '#00BDA5', '#6A78D1', '#F2545B', '#F5C26B']

const fmt = (n) =>
  n >= 1000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : n >= 1000
      ? `$${Math.round(n / 1000)}K`
      : String(n)

const fmtPlain = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n))

// ---- Report card wrapper (title bar like a HubSpot report tile) ----
export function ReportCard({ title, subtitle, children, footer }) {
  return (
    <div className="bg-white rounded-lg border border-hs-border overflow-hidden">
      <div className="px-4 pt-3 pb-1.5">
        <h4 className="text-[13px] font-preview font-semibold text-hs-navy leading-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="text-[11px] font-preview text-hs-text-light">{subtitle}</p>
        )}
      </div>
      <div className="px-4 pb-3">{children}</div>
      {footer && (
        <div className="px-4 py-2 border-t border-hs-border text-[11px] font-preview text-hs-text-light">
          {footer}
        </div>
      )}
    </div>
  )
}

// ---- Big-number stat with delta ----
export function StatCard({ label, value, delta, deltaGood = true }) {
  return (
    <div className="bg-white rounded-lg border border-hs-border px-4 py-3">
      <p className="text-[11px] font-preview text-hs-text-light">{label}</p>
      <p className="text-[22px] font-preview font-semibold text-hs-navy leading-tight">{value}</p>
      {delta && (
        <p
          className={`text-[11px] font-preview ${deltaGood ? 'text-hs-green' : 'text-hs-red'}`}
        >
          {deltaGood ? '▲' : '▼'} {delta} vs. last month
        </p>
      )}
    </div>
  )
}

// ---- Vertical bar chart with axis labels + gridlines ----
// data: [{ label, value, color? }] ; money: format y values as $
export function BarChart({ data, height = 150, money = false, color = '#0091AE' }) {
  const max = Math.max(...data.map((d) => d.value)) * 1.15
  const W = 320
  const H = height
  const padL = 42
  const padB = 22
  const chartW = W - padL - 8
  const chartH = H - padB - 8
  const bw = Math.min(38, (chartW / data.length) * 0.62)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: 'Lexend Deca' }}>
      {ticks.map((t, i) => {
        const y = 8 + chartH - (t / max) * chartH
        return (
          <g key={i}>
            <line x1={padL} x2={W - 8} y1={y} y2={y} stroke="#EAF0F6" strokeWidth="1" />
            <text x={padL - 5} y={y + 3} textAnchor="end" fontSize="8" fill="#7C98B6">
              {money ? fmt(t) : fmtPlain(t)}
            </text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = padL + (chartW / data.length) * (i + 0.5) - bw / 2
        const h = (d.value / max) * chartH
        const y = 8 + chartH - h
        return (
          <g key={`${d.label}-${i}`}>
            <rect x={x} y={y} width={bw} height={h} rx="3" fill={d.color || color} />
            <text
              x={x + bw / 2}
              y={y - 3}
              textAnchor="middle"
              fontSize="8"
              fill="#33475B"
              fontWeight="600"
            >
              {money ? fmt(d.value) : fmtPlain(d.value)}
            </text>
            <text
              x={x + bw / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="8"
              fill="#7C98B6"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ---- Horizontal bar chart (rep leaderboards, sources) ----
export function HBarChart({ data, money = false, color = '#00BDA5' }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="space-y-1.5" style={{ fontFamily: 'Lexend Deca' }}>
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2">
          <span className="w-24 text-[10px] text-hs-text-dark truncate text-right shrink-0">
            {d.label}
          </span>
          <div className="flex-1 h-4 bg-hs-canvas rounded overflow-hidden">
            <div
              className="h-full rounded"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color || color }}
            />
          </div>
          <span className="w-12 text-[10px] font-semibold text-hs-navy shrink-0">
            {money ? fmt(d.value) : fmtPlain(d.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ---- Line/area chart with axes ----
// series: [{ name, color, points: [numbers] }] ; labels: x labels
export function LineChart({ series, labels, height = 150, money = false }) {
  const W = 320
  const H = height
  const padL = 42
  const padB = 22
  const chartW = W - padL - 10
  const chartH = H - padB - 10
  const allVals = series.flatMap((s) => s.points)
  const max = Math.max(...allVals) * 1.15
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t))
  const px = (i, n) => padL + (chartW / Math.max(1, n - 1)) * i
  const py = (v) => 10 + chartH - (v / max) * chartH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: 'Lexend Deca' }}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - 10} y1={py(t)} y2={py(t)} stroke="#EAF0F6" />
          <text x={padL - 5} y={py(t) + 3} textAnchor="end" fontSize="8" fill="#7C98B6">
            {money ? fmt(t) : fmtPlain(t)}
          </text>
        </g>
      ))}
      {series.map((s) => {
        const n = s.points.length
        const pts = s.points.map((v, i) => `${px(i, n)},${py(v)}`).join(' ')
        const area = `${padL},${py(0)} ${pts} ${px(n - 1, n)},${py(0)}`
        return (
          <g key={s.name}>
            <polygon points={area} fill={s.color} opacity="0.08" />
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" />
            {s.points.map((v, i) => (
              <circle key={i} cx={px(i, n)} cy={py(v)} r="2.5" fill="#fff" stroke={s.color} strokeWidth="1.5" />
            ))}
          </g>
        )
      })}
      {labels.map((l, i) => (
        <text
          key={`${l}-${i}`}
          x={px(i, labels.length)}
          y={H - 8}
          textAnchor="middle"
          fontSize="8"
          fill="#7C98B6"
        >
          {l}
        </text>
      ))}
      {series.length > 1 && (
        <g>
          {series.map((s, i) => (
            <g key={s.name} transform={`translate(${padL + i * 80}, 2)`}>
              <rect width="8" height="8" rx="2" fill={s.color} y="-1" />
              <text x="11" y="6" fontSize="8" fill="#33475B">
                {s.name}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

// ---- Donut with center stat + legend ----
export function DonutChart({ data, centerLabel, centerValue, size = 110 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let acc = 0
  const r = 38
  const c = 2 * Math.PI * r

  return (
    <div className="flex items-center gap-3" style={{ fontFamily: 'Lexend Deca' }}>
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="shrink-0">
        {data.map((d, i) => {
          const frac = d.value / total
          const dash = `${frac * c} ${c}`
          const offset = -acc * c
          acc += frac
          return (
            <circle
              key={d.label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={d.color || CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth="13"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            />
          )
        })}
        <text x="50" y="47" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2D3E50">
          {centerValue}
        </text>
        <text x="50" y="59" textAnchor="middle" fontSize="7" fill="#7C98B6">
          {centerLabel}
        </text>
      </svg>
      <div className="space-y-1 min-w-0">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-1.5 text-[10px]">
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: d.color || CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="text-hs-text-dark truncate">{d.label}</span>
            <span className="text-hs-text-light ml-auto shrink-0">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- HubSpot-style data table ----
// columns: [{key, label, align?, render?}] ; rows: objects
export function DataTable({ columns, rows, compact = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ fontFamily: 'Lexend Deca' }}>
        <thead>
          <tr className="border-b border-hs-border">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`text-[10px] font-semibold uppercase tracking-wide text-hs-text-light py-1.5 px-2 ${
                  c.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-hs-canvas hover:bg-hs-canvas/60">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`text-[11px] text-hs-text-dark ${compact ? 'py-1' : 'py-1.5'} px-2 ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {c.render ? c.render(r[c.key], r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---- Status pill (deal stages, ticket priority, invoice status) ----
const PILL_COLORS = {
  green: { bg: '#E5F8F6', fg: '#00BDA5' },
  blue: { bg: '#E5F5F8', fg: '#0091AE' },
  orange: { bg: '#FFF1EE', fg: '#FF7A59' },
  red: { bg: '#FDEDEE', fg: '#F2545B' },
  gray: { bg: '#F5F8FA', fg: '#7C98B6' },
  purple: { bg: '#F0F1FA', fg: '#6A78D1' },
}
export function Pill({ color = 'gray', children }) {
  const c = PILL_COLORS[color] || PILL_COLORS.gray
  return (
    <span
      className="inline-block text-[10px] font-medium rounded-full px-2 py-0.5"
      style={{ background: c.bg, color: c.fg, fontFamily: 'Lexend Deca' }}
    >
      {children}
    </span>
  )
}

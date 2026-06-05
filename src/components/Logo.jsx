// Crescent Connect LA wordmark — simple inline SVG crescent + label.
export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M22 4a12 12 0 1 0 0 24 9 9 0 0 1 0-24Z"
          fill="#FF7A59"
        />
        <circle cx="23" cy="16" r="2.5" fill="#2D3E50" />
      </svg>
      {!compact && (
        <span className="font-ui font-semibold text-hs-navy leading-tight text-[15px]">
          Crescent Connect
        </span>
      )}
    </div>
  )
}

// Crescent Connect LA logo — the real Louisiana hub-and-spoke mark + wordmark.
export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <img
        src="/cc-mark.png"
        alt="Crescent Connect"
        className="h-7 w-auto"
        width="28"
        height="28"
      />
      {!compact && (
        <span className="font-ui font-semibold text-hs-navy leading-tight text-[15px]">
          Crescent Connect
        </span>
      )}
    </div>
  )
}

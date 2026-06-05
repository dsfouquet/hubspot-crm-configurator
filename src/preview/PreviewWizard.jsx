import { useStore } from '../store/useStore'
import { WIZARD_QUESTIONS } from '../constants/wizardQuestions'

// Preview for Step 1: a clean "business profile" summary card that fills in as answered.
export default function PreviewWizard() {
  const wizard = useStore((s) => s.session.wizard)
  const name = useStore((s) => s.session.gate.name)

  const answered = WIZARD_QUESTIONS.filter((q) => {
    const a = wizard[q.key]
    return Array.isArray(a) ? a.length > 0 : Boolean(a)
  }).length

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg border border-hs-border overflow-hidden">
        <div className="bg-hs-navy px-5 py-4">
          <p className="text-[12px] font-preview text-white/70">Business Profile</p>
          <h2 className="font-preview font-semibold text-white text-lg">
            {name ? `${name}'s Team` : 'Your Team'}
          </h2>
          <p className="text-[12px] font-preview text-white/70 mt-1">
            {answered} of {WIZARD_QUESTIONS.length} answered
          </p>
        </div>

        <div className="p-5 space-y-4">
          {WIZARD_QUESTIONS.map((q) => {
            const a = wizard[q.key]
            const has = Array.isArray(a) ? a.length > 0 : Boolean(a)
            return (
              <div key={q.key}>
                <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-text-light">
                  {q.prompt}
                </p>
                {!has ? (
                  <p className="text-[13px] font-preview text-hs-border italic">Not answered yet</p>
                ) : Array.isArray(a) ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {a.map((item) => (
                      <span
                        key={item}
                        className="text-[12px] font-preview bg-hs-blue/10 text-hs-blue rounded px-2 py-0.5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] font-preview text-hs-text-dark mt-0.5">{a}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <p className="text-center text-[12px] font-preview text-hs-text-light mt-4">
        We'll use this to recommend your views, dashboards, and automations.
      </p>
    </div>
  )
}

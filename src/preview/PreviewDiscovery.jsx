import { useStore } from '../store/useStore'
import {
  DISCOVERY_QUESTIONS,
  DISCOVERY_SECTIONS,
  painParts,
} from '../constants/discoveryQuestions'

// Step 1 preview: a discovery summary card that fills in as the prospect answers.
export default function PreviewDiscovery() {
  const wizard = useStore((s) => s.session.wizard)
  const name = useStore((s) => s.session.gate.name)

  // Resolve a question's display answer (pains filter the shared id array).
  const answerFor = (q) => {
    const a = wizard[q.key]
    if (q.type === 'pain-multi') {
      const ids = (Array.isArray(a) ? a : []).filter((id) => q.painIds.includes(id))
      return ids.length ? ids.map((id) => painParts(id).pain) : null
    }
    if (q.type === 'single-from-pains') return a ? [painParts(a).pain] : null
    if (Array.isArray(a)) return a.length ? a : null
    return a && String(a).trim() ? a : null
  }

  const answered = DISCOVERY_QUESTIONS.filter((q) => answerFor(q)).length

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg border border-hs-border overflow-hidden">
        <div className="bg-hs-navy px-5 py-4">
          <p className="text-[12px] font-preview text-white/70">Discovery Summary</p>
          <h2 className="font-preview font-semibold text-white text-lg">
            {name ? `${name}'s Business` : 'Your Business'}
          </h2>
          <p className="text-[12px] font-preview text-white/70 mt-1">
            {answered} of {DISCOVERY_QUESTIONS.length} answered
          </p>
        </div>

        <div className="p-5 space-y-4">
          {DISCOVERY_SECTIONS.map((sec) => {
            const qs = DISCOVERY_QUESTIONS.filter((q) => q.section === sec.key)
            const any = qs.some((q) => answerFor(q))
            return (
              <div key={sec.key}>
                <p className="text-[11px] font-preview font-semibold uppercase tracking-wide text-hs-orange mb-1.5">
                  {sec.label}
                </p>
                {!any ? (
                  <p className="text-[12px] font-preview text-hs-border italic">Not started</p>
                ) : (
                  <div className="space-y-2">
                    {qs.map((q) => {
                      const a = answerFor(q)
                      if (!a) return null
                      return (
                        <div key={q.qid}>
                          <p className="text-[10px] font-preview text-hs-text-light">{q.prompt}</p>
                          {Array.isArray(a) ? (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {a.map((item) => (
                                <span
                                  key={item}
                                  className="text-[11px] font-preview bg-hs-blue/10 text-hs-blue rounded px-1.5 py-0.5"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[12px] font-preview text-hs-text-dark">{a}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <p className="text-center text-[12px] font-preview text-hs-text-light mt-4">
        Finish discovery and we'll pre-build your entire HubSpot from this.
      </p>
    </div>
  )
}

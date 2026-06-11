import { useStore } from '../store/useStore'
import { calculateRequiredTier } from '../utils/tierCalculator'
import { activeViews } from '../utils/recommendations'
import { scopeOffers, OFFERS } from '../utils/offerScoper'
import { WIDGET_LABELS, AUTOMATION_HEALTH_WIDGETS } from '../constants/defaultWidgets'
import { actionCount } from '../constants/workflowTemplates'

// Off-screen, print-optimized rendering of the full blueprint (spec Section 8).
// html2pdf rasterizes #blueprint-doc into a multi-page A4 PDF. Each <Page> forces
// a page break; cards avoid breaking across pages.

const NODE_COLOR = {
  trigger: '#FF7A59',
  condition: '#0091AE',
  action: '#7C98B6',
  delay: '#6A78D1',
  end: '#00BDA5',
}

const Page = ({ children, first }) => (
  <div
    style={{
      breakBefore: first ? 'auto' : 'page',
      pageBreakBefore: first ? 'auto' : 'always',
      padding: '40px 44px',
      minHeight: '1040px',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      color: '#33475B',
    }}
  >
    {children}
  </div>
)

const SectionTitle = ({ children, kicker }) => (
  <div style={{ marginBottom: 18, borderBottom: '2px solid #FF7A59', paddingBottom: 8 }}>
    {kicker && (
      <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#7C98B6' }}>
        {kicker}
      </div>
    )}
    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#2D3E50', margin: 0 }}>{children}</h2>
  </div>
)

const Card = ({ title, children }) => (
  <div
    style={{
      border: '1px solid #CBD6E2',
      borderRadius: 8,
      padding: 14,
      marginBottom: 12,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    }}
  >
    {title && (
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#2D3E50', margin: '0 0 8px' }}>
        {title}
      </h3>
    )}
    {children}
  </div>
)

const Chips = ({ items, color = '#0091AE' }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {items.map((it, i) => (
      <span
        key={i}
        style={{
          fontSize: 12,
          background: `${color}18`,
          color,
          borderRadius: 4,
          padding: '2px 8px',
        }}
      >
        {it}
      </span>
    ))}
  </div>
)

function RecordCard({ label, record }) {
  const props = record.properties.filter((p) => p.enabled).map((p) => p.label)
  const sections = record.sections.filter((s) => s.enabled).map((s) => s.label)
  return (
    <Card title={label}>
      <div style={{ fontSize: 11, color: '#7C98B6', marginBottom: 2 }}>Properties</div>
      <Chips items={props} />
      {record.pipelineStages && (
        <>
          <div style={{ fontSize: 11, color: '#7C98B6', margin: '8px 0 2px' }}>Pipeline stages</div>
          <div style={{ fontSize: 13, color: '#33475B' }}>
            {record.pipelineStages.map((s) => s.label).join('  →  ')}
          </div>
        </>
      )}
      <div style={{ fontSize: 11, color: '#7C98B6', margin: '8px 0 2px' }}>Record sections</div>
      <div style={{ fontSize: 13, color: '#33475B' }}>{sections.join(' · ')}</div>
    </Card>
  )
}

function MiniWorkflow({ workflow }) {
  // Walk the chain from the trigger, following `next` (branches noted inline).
  const byId = Object.fromEntries(workflow.nodes.map((n) => [n.id, n]))
  const ordered = []
  let cur = workflow.nodes.find((n) => n.type === 'trigger') || workflow.nodes[0]
  const seen = new Set()
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id)
    ordered.push(cur)
    cur = cur.next ? byId[cur.next] : null
  }
  // Append any unreached (e.g. else-branch ends).
  workflow.nodes.forEach((n) => !seen.has(n.id) && ordered.push(n))

  return (
    <Card title={`${workflow.name}  ·  ${workflow.tier?.toUpperCase?.() || ''}`}>
      <div style={{ fontSize: 12, color: '#7C98B6', marginBottom: 8 }}>
        ⚡ {workflow.triggerSummary} · {actionCount(workflow)} actions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ordered.map((n) => (
          <div
            key={n.id}
            style={{
              borderLeft: `4px solid ${NODE_COLOR[n.type] || '#CBD6E2'}`,
              background: '#F5F8FA',
              borderRadius: 4,
              padding: '4px 10px',
              fontSize: 12,
            }}
          >
            <span style={{ color: NODE_COLOR[n.type], textTransform: 'uppercase', fontSize: 9 }}>
              {n.type}
            </span>
            <span style={{ color: '#33475B', marginLeft: 8 }}>{n.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function BlueprintDocument() {
  const session = useStore((s) => s.session)
  const tier = calculateRequiredTier(session)
  const views = activeViews(session)
  const w = session.wizard || {}
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  const name = session.gate?.name || 'Your'
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const widgets = session.dashboards?.widgets || []
  const customWidgets = session.dashboards?.customWidgets || []
  const meetings = session.cadence?.meetings?.filter((m) => m.enabled) || []

  return (
    <div id="blueprint-doc" style={{ width: 794, background: '#fff' }}>
      {/* ---- Page 1: Cover ---- */}
      <Page first>
        <div style={{ textAlign: 'center', paddingTop: 120 }}>
          <div style={{ fontSize: 13, letterSpacing: 2, color: '#FF7A59', textTransform: 'uppercase' }}>
            Crescent Connect LA
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#2D3E50', margin: '24px 0 8px' }}>
            Your Custom HubSpot Blueprint
          </h1>
          <div style={{ fontSize: 18, color: '#7C98B6' }}>
            Prepared for {name === 'Your' ? 'your team' : name}
          </div>
          <div style={{ fontSize: 14, color: '#7C98B6', marginTop: 6 }}>{dateStr}</div>

          <div
            style={{
              display: 'inline-block',
              marginTop: 48,
              padding: '14px 28px',
              borderRadius: 10,
              background: `${tier.requiredColor}15`,
            }}
          >
            <div style={{ fontSize: 12, color: '#7C98B6' }}>Recommended HubSpot tier</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: tier.requiredColor }}>
              {tier.requiredLabel}
            </div>
            {tier.monthlyPerSeat > 0 && (
              <div style={{ fontSize: 12, color: '#7C98B6' }}>~${tier.monthlyPerSeat}/seat/mo</div>
            )}
          </div>
        </div>
      </Page>

      {/* ---- Page 2: Business summary + tier ---- */}
      <Page>
        <SectionTitle kicker="01">Business Summary</SectionTitle>
        <Card title="About your business">
          {[
            ['What you do', arr(w.businessDescription)],
            ['Industry', arr(w.industry)],
            ['How you sell', arr(w.teamType)],
            ['Team size', arr(w.teamSize)],
            ['Monthly lead/quote volume', arr(w.monthlyVolume)],
            ['Recurring revenue', arr(w.recurringRevenue)],
            ['New business comes from', arr(w.leadSources)],
            ['Average deal size', arr(w.avgDealSize)],
            ['Sales cycle', arr(w.salesCycle)],
            ['Currently tracking with', arr(w.currentTracking)],
          ].map(([label, vals]) => (
            <div key={label} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: '#7C98B6' }}>{label}</div>
              {vals.length ? (
                <Chips items={vals} />
              ) : (
                <div style={{ fontSize: 13, color: '#CBD6E2' }}>—</div>
              )}
            </div>
          ))}
        </Card>

        <Card title="Required HubSpot tier">
          <div style={{ fontSize: 15, fontWeight: 600, color: tier.requiredColor }}>
            HubSpot {tier.requiredLabel}
            {tier.monthlyPerSeat > 0 && (
              <span style={{ color: '#7C98B6', fontWeight: 400 }}> · ~${tier.monthlyPerSeat}/seat/mo</span>
            )}
          </div>
          {tier.drivers.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: '#7C98B6' }}>Features driving this tier</div>
              <Chips items={tier.drivers.map((d) => d.label)} color="#FF7A59" />
            </div>
          )}
        </Card>
      </Page>

      {/* ---- Fix Plan: Problems → Solutions (only when discovery was completed) ---- */}
      {session.fixPlan && session.fixPlan.problems.length > 0 && (
        <Page>
          <SectionTitle kicker="Fix Plan">Your Problems → Our Solutions</SectionTitle>
          {session.fixPlan.topLeakCost && (
            <div style={{ fontSize: 13, color: '#F2545B', marginBottom: 10 }}>
              You estimated your biggest leak at: {session.fixPlan.topLeakCost}
            </div>
          )}
          {session.fixPlan.problems.map((p) => (
            <Card key={p.id} title={`${p.isTop ? '🔥 ' : ''}${p.title}`}>
              <div style={{ fontSize: 11, color: '#7C98B6', marginBottom: 4 }}>
                You said: “{p.saidLabel}”
              </div>
              <div style={{ fontSize: 13, color: '#33475B', marginBottom: 8 }}>{p.narrative}</div>
              <div
                style={{
                  background: '#2D3E50',
                  borderRadius: 6,
                  padding: '8px 12px',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: '#FF7A59',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  Built for you by Crescent Connect
                </div>
                {p.ccBuild.map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>
                    › {item}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </Page>
      )}

      {/* ---- Implementation scope: what Crescent Connect builds ---- */}
      {session.fixPlan && (
        <Page>
          <SectionTitle kicker="Implementation">What Crescent Connect Builds</SectionTitle>
          <div style={{ fontSize: 13, color: '#33475B', marginBottom: 14, lineHeight: 1.5 }}>
            HubSpot out of the box is an empty toolkit — blank pipelines, no automations, generic
            properties, nothing connected. Everything in this blueprint is implementation work:
            designed around your process, built, tested, and trained by Crescent Connect.
          </div>
          <Card title="Your implementation scope">
            {session.fixPlan.globalBuild.map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: '#33475B', marginBottom: 5 }}>
                <span style={{ color: '#00BDA5' }}>✓</span> {item}
              </div>
            ))}
          </Card>
          {session.fixPlan.mondayScreen && (
            <Card title="Your Monday-morning screen">
              <div style={{ fontSize: 13, color: '#33475B', fontStyle: 'italic' }}>
                “{session.fixPlan.mondayScreen}”
              </div>
              <div style={{ fontSize: 12, color: '#7C98B6', marginTop: 4 }}>
                Built as your default dashboard view.
              </div>
            </Card>
          )}
        </Page>
      )}

      {/* ---- Scope of work mapped to the Crescent Connect offer ladder ---- */}
      {session.fixPlan && (
        <Page>
          <SectionTitle kicker="Scope of Work">How This Gets Built</SectionTitle>
          {(() => {
            const scope = scopeOffers(session)
            const block = (offer, items, footnote, recommended) =>
              items.length > 0 && (
                <div
                  key={offer.key}
                  style={{
                    border: `2px solid ${recommended ? '#FF7A59' : '#CBD6E2'}`,
                    borderRadius: 8,
                    marginBottom: 12,
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ background: `${offer.color}12`, padding: '8px 14px' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: offer.color }}>
                      {offer.name}
                    </span>
                    {recommended && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#fff',
                          background: '#FF7A59',
                          borderRadius: 3,
                          padding: '2px 6px',
                          marginLeft: 8,
                        }}
                      >
                        Your starting point
                      </span>
                    )}
                    <div style={{ fontSize: 11, color: '#33475B', marginTop: 2 }}>
                      {offer.tagline}
                    </div>
                  </div>
                  <div style={{ padding: '8px 14px' }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#33475B', marginBottom: 3 }}>
                        <span style={{ color: offer.color }}>✓</span> {item}
                      </div>
                    ))}
                    {footnote && (
                      <div
                        style={{
                          fontSize: 10,
                          color: '#7C98B6',
                          fontStyle: 'italic',
                          marginTop: 6,
                        }}
                      >
                        {footnote}
                      </div>
                    )}
                  </div>
                </div>
              )
            return (
              <>
                {block(
                  OFFERS.free,
                  scope.free,
                  '7-day done-for-you setup. Capped scope, 4 businesses per month.',
                  scope.recommended === 'free'
                )}
                {block(
                  OFFERS.machine,
                  scope.machine,
                  'The 30-day full install — built, tested, and trained.',
                  scope.recommended === 'machine'
                )}
                {block(
                  OFFERS.retainer,
                  scope.retainer,
                  'Optional, after your install. We run it so you don’t have to.',
                  false
                )}
              </>
            )
          })()}
        </Page>
      )}

      {/* ---- Page 3: Record configuration ---- */}
      <Page>
        <SectionTitle kicker="02">Record Configuration</SectionTitle>
        <RecordCard label="Contacts" record={session.contacts} />
        <RecordCard label="Companies" record={session.companies} />
        <RecordCard label="Deals" record={session.deals} />
        <RecordCard label="Tickets / Support" record={session.tickets} />
        {session.customObjects.length > 0 && (
          <Card title="Custom Objects">
            {session.customObjects.map((o) => (
              <div key={o.id} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#2D3E50' }}>
                  {o.plural || o.singular || 'Untitled'}
                </div>
                {o.description && (
                  <div style={{ fontSize: 12, color: '#7C98B6' }}>{o.description}</div>
                )}
                {o.properties.length > 0 && (
                  <Chips items={o.properties.map((p) => p.label)} color="#6A78D1" />
                )}
              </div>
            ))}
          </Card>
        )}
      </Page>

      {/* ---- Page 4: Automation workflows ---- */}
      <Page>
        <SectionTitle kicker="03">Automation Workflows</SectionTitle>
        {session.workflows.length === 0 ? (
          <div style={{ fontSize: 13, color: '#7C98B6' }}>No automations configured.</div>
        ) : (
          session.workflows.map((wf) => <MiniWorkflow key={wf.id} workflow={wf} />)
        )}
      </Page>

      {/* ---- Page 5: Views & tabs ---- */}
      <Page>
        <SectionTitle kicker="04">Views &amp; Tabs</SectionTitle>
        {['Contacts', 'Companies', 'Deals', 'Tickets'].map((rt) => {
          const rv = views.filter((v) => v.recordType === rt)
          if (rv.length === 0) return null
          return (
            <Card key={rt} title={rt}>
              {rv.map((v) => (
                <div key={v.id} style={{ fontSize: 13, marginBottom: 3 }}>
                  <span style={{ color: '#FF7A59' }}>★</span> {v.name}
                  <span style={{ color: '#7C98B6' }}> — {v.description}</span>
                </div>
              ))}
            </Card>
          )
        })}
        {views.length === 0 && (
          <div style={{ fontSize: 13, color: '#7C98B6' }}>No custom views configured yet.</div>
        )}
      </Page>

      {/* ---- Page 6: Dashboard ---- */}
      <Page>
        <SectionTitle kicker="05">Dashboard Layout</SectionTitle>
        <Card title={session.dashboards?.name || 'Dashboard'}>
          <Chips
            items={[
              ...widgets.map((id) => WIDGET_LABELS[id] || id),
              ...customWidgets.map((cw) => cw.label),
            ]}
          />
          {session.workflows.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: '#7C98B6', margin: '10px 0 2px' }}>
                ⚡ Automation Health
              </div>
              <Chips
                items={AUTOMATION_HEALTH_WIDGETS.filter((x) => widgets.includes(x.id)).map(
                  (x) => x.label
                )}
                color="#00BDA5"
              />
            </>
          )}
        </Card>
      </Page>

      {/* ---- Page 7: Accountability cadence ---- */}
      <Page>
        <SectionTitle kicker="06">Accountability Cadence</SectionTitle>
        <Card title="Meeting cadence">
          {meetings.length === 0 ? (
            <div style={{ fontSize: 13, color: '#7C98B6' }}>No meetings scheduled.</div>
          ) : (
            meetings.map((m) => (
              <div key={m.key} style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>{m.label}</strong>{' '}
                <span style={{ color: '#7C98B6' }}>
                  — {m.day} {m.time} · {m.agenda}
                </span>
              </div>
            ))
          )}
        </Card>
        <Card title="Notifications">
          <div style={{ fontSize: 13 }}>
            {(session.cadence?.notifications?.channels || []).join(', ')} ·{' '}
            {session.cadence?.notifications?.frequency}
          </div>
        </Card>
      </Page>

      {/* ---- Page 8: Back cover ---- */}
      <Page>
        <div style={{ textAlign: 'center', paddingTop: 200 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#2D3E50' }}>Ready to build this?</h2>
          <p style={{ fontSize: 16, color: '#7C98B6', marginTop: 10 }}>
            Crescent Connect LA installs this HubSpot setup for you — done right, done fast.
          </p>
          <div
            style={{
              display: 'inline-block',
              marginTop: 24,
              padding: '12px 28px',
              background: '#FF7A59',
              color: '#fff',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Book a call →
          </div>
          <div style={{ marginTop: 40, fontSize: 13, color: '#7C98B6' }}>
            crescentconnectla.com
          </div>
        </div>
      </Page>
    </div>
  )
}

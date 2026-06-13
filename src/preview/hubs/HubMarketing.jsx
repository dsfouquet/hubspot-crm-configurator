// HubMarketing — "HubSpot light" Marketing Hub demo view.
// Benefits-only, demo-ready. Sub-tabs: Email | Forms | CTAs | Campaigns.
// Pure presentational, no real data. Newsletter mock is the showpiece.

import { useState } from 'react'
import { useStore } from '../../store/useStore'
import {
  ReportCard,
  StatCard,
  LineChart,
  DonutChart,
  DataTable,
} from '../charts'
import { Tag, IconRefresh, IconDownload } from '../uiIcons'
import {
  EMAIL_PERFORMANCE,
  FORMS_DEMO,
  CAMPAIGNS_DEMO,
  LEAD_SOURCES,
  MONTHS,
} from '../demoData'
import { industryCopy } from '../industryCopy'

const TABS = ['Email', 'Forms', 'CTAs', 'Campaigns']

export default function HubMarketing() {
  const [tab, setTab] = useState('Email')
  const companyName = useStore((s) => s.session?.gate?.name) || 'Your Company'

  return (
    <div className="h-full flex flex-col font-preview">
      {/* Sub-tab bar */}
      <div className="border-b border-hs-border bg-white flex items-center px-2 shrink-0">
        {TABS.map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-2.5 text-[13px] transition-colors ${
                active
                  ? 'text-hs-navy font-medium'
                  : 'text-hs-text-light hover:text-hs-text-dark'
              }`}
            >
              {t}
              {active && (
                <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-hs-orange rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-hs-canvas p-4">
        {tab === 'Email' && <EmailTab companyName={companyName} />}
        {tab === 'Forms' && <FormsTab />}
        {tab === 'CTAs' && <CTAsTab />}
        {tab === 'Campaigns' && <CampaignsTab />}
      </div>
    </div>
  )
}

/* ============================== EMAIL ============================== */

function EmailTab({ companyName }) {
  const e = EMAIL_PERFORMANCE
  return (
    <div className="space-y-4">
      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Emails sent" value="1,240" />
        <StatCard label="Open rate" value="41.2%" delta="5.1%" deltaGood />
        <StatCard label="Click rate" value="6.8%" />
        <StatCard label="Replies" value="87" />
      </div>

      {/* 2-col: newsletter mock + trend/nurture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NewsletterMock companyName={companyName} />

        <div className="space-y-4">
          <ReportCard
            title="Open rate trend"
            subtitle="Last 6 months · % of recipients who opened"
          >
            <LineChart
              series={[{ name: 'Open rate', color: '#FF7A59', points: e.trend }]}
              labels={MONTHS}
            />
          </ReportCard>

          <div className="bg-white rounded-lg border border-hs-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-md bg-hs-orange/10 flex items-center justify-center text-hs-orange">
                <IconRefresh width={13} height={13} />
              </span>
              <h4 className="text-[13px] font-semibold text-hs-navy">
                Nurture sequence
              </h4>
            </div>
            <p className="text-[12px] text-hs-text-dark leading-snug">
              5 emails · 312 enrolled · runs itself
            </p>
            <p className="text-[11px] text-hs-text-light mt-1.5 leading-snug">
              New contacts drop into the sequence automatically and get a timed
              series of touches — no manual sending, no one slips through.
            </p>
            <div className="flex items-center gap-1.5 mt-2.5">
              {[1, 2, 3, 4, 5].map((n, i) => (
                <span key={n} className="flex items-center">
                  <span className="w-5 h-5 rounded-full bg-hs-canvas border border-hs-border text-[9px] text-hs-text-light flex items-center justify-center">
                    {n}
                  </span>
                  {i < 4 && <span className="w-3 h-px bg-hs-border" />}
                </span>
              ))}
              <Tag color="green">Active</Tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsletterMock({ companyName }) {
  const industry = useStore((s) => s.session?.wizard?.industry)
  const copy = industryCopy(industry)
  const nl = copy.newsletter
  return (
    <ReportCard
      title="Email preview"
      subtitle="Branded template · sends to your contact list in one click"
    >
      {/* Gray outer email frame */}
      <div className="bg-hs-canvas rounded-md p-4">
        {/* White email body */}
        <div className="bg-white rounded shadow-sm border border-hs-border overflow-hidden max-w-md mx-auto">
          {/* Navy header bar */}
          <div className="bg-hs-navy px-4 py-3">
            <p className="text-white text-[13px] font-semibold tracking-tight">
              {companyName} {nl.title}
            </p>
            <p className="text-white/60 text-[10px] mt-0.5">
              June 2026 · Issue #14
            </p>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            {/* Hero headline */}
            <h3 className="text-[15px] font-bold text-hs-navy leading-snug">
              {nl.headline}
            </h3>
            <p className="text-[11px] text-hs-text-light mt-1.5 leading-relaxed">
              {nl.intro}
            </p>

            {/* Article teasers */}
            {nl.articles.map((a, i) => (
              <div key={a.title} className={`flex gap-3 ${i === 0 ? 'mt-4' : 'mt-3'}`}>
                <div
                  className={`w-16 h-16 rounded shrink-0 ${i === 0 ? 'bg-hs-blue/80' : 'bg-hs-green/80'}`}
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-hs-text-dark leading-snug">
                    {a.title}
                  </p>
                  <p className="text-[10px] text-hs-text-light mt-1 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}

            {/* CTA button */}
            <div className="mt-5 text-center">
              <span className="inline-block bg-hs-orange text-white text-[12px] font-semibold rounded px-5 py-2.5">
                {nl.cta}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-hs-canvas px-4 py-3 border-t border-hs-border text-center">
            <p className="text-[9px] text-hs-text-light leading-relaxed">
              {companyName} · Baton Rouge, LA
              <br />
              You're receiving this because you're a valued customer.{' '}
              <span className="underline">Unsubscribe</span>
            </p>
          </div>
        </div>
      </div>
    </ReportCard>
  )
}

/* ============================== FORMS ============================== */

function FormsTab() {
  const formCols = [
    { key: 'name', label: 'Form Name' },
    { key: 'submissions', label: 'Submissions', align: 'right' },
    { key: 'conversion', label: 'Conversion', align: 'right' },
  ]
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ReportCard
        title="Forms"
        subtitle="Every submission becomes a tracked contact"
      >
        <DataTable columns={formCols} rows={FORMS_DEMO} />
      </ReportCard>

      <ReportCard
        title="Embedded form preview"
        subtitle="Drops onto your website — no developer needed"
      >
        <div className="bg-hs-canvas rounded-md p-4">
          <div className="bg-white rounded border border-hs-border shadow-sm p-5 max-w-sm mx-auto">
            <h3 className="text-[14px] font-bold text-hs-navy">Request a Quote</h3>
            <p className="text-[11px] text-hs-text-light mt-0.5 mb-4">
              Tell us what you need and we'll get right back to you.
            </p>

            <FormField label="Name" placeholder="Jane Doe" />
            <FormField label="Email" placeholder="jane@company.com" />
            <FormField
              label="What do you need?"
              placeholder="Pump model, application, timeline…"
              textarea
            />

            <button className="w-full bg-hs-orange text-white text-[12px] font-semibold rounded py-2.5 mt-1">
              Submit
            </button>
          </div>
        </div>
        <p className="text-[11px] text-hs-text-light mt-3 leading-snug">
          Submissions create contacts, route to an owner, and trigger follow-up
          automatically.
        </p>
      </ReportCard>
    </div>
  )
}

function FormField({ label, placeholder, textarea }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-hs-text-dark mb-1">
        {label}
      </label>
      {textarea ? (
        <div className="w-full border border-hs-border rounded px-2.5 py-2 text-[11px] text-hs-text-light bg-white h-16">
          {placeholder}
        </div>
      ) : (
        <div className="w-full border border-hs-border rounded px-2.5 py-2 text-[11px] text-hs-text-light bg-white">
          {placeholder}
        </div>
      )}
    </div>
  )
}

/* ============================== CTAs ============================== */

function CTAsTab() {
  const ctaCols = [
    { key: 'cta', label: 'CTA' },
    { key: 'views', label: 'Views', align: 'right' },
    { key: 'clicks', label: 'Clicks', align: 'right' },
    { key: 'conversion', label: 'Conversion', align: 'right' },
  ]
  const ctaRows = [
    { cta: 'Spring maintenance banner', views: '2,114', clicks: '173', conversion: '8.2%' },
    { cta: 'Maintenance checklist (inline)', views: '1,486', clicks: '161', conversion: '10.8%' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Banner CTA */}
        <ReportCard
          title="Banner CTA"
          subtitle="Sits at the top of a page or post"
        >
          <div className="rounded-md bg-hs-navy px-5 py-6 text-center">
            <h3 className="text-white text-[16px] font-bold leading-snug">
              Spring maintenance slots are open
            </h3>
            <p className="text-white/60 text-[11px] mt-1">
              Limited availability through June.
            </p>
            <span className="inline-block bg-hs-orange text-white text-[12px] font-semibold rounded px-5 py-2.5 mt-3">
              Book now
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <ChipStat>2,114 views</ChipStat>
            <ChipStat>8.2% click rate</ChipStat>
          </div>
        </ReportCard>

        {/* Inline card CTA */}
        <ReportCard
          title="Inline card CTA"
          subtitle="Embeds mid-article to capture interest"
        >
          <div className="rounded-md border border-hs-border bg-white p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded bg-hs-orange/10 flex items-center justify-center text-hs-orange shrink-0">
              <IconDownload width={22} height={22} />
            </div>
            <div className="min-w-0">
              <h3 className="text-hs-navy text-[14px] font-bold leading-snug">
                Download the maintenance checklist
              </h3>
              <p className="text-hs-text-light text-[11px] mt-0.5">
                Free PDF — everything to check before summer.
              </p>
              <span className="inline-block bg-hs-orange text-white text-[11px] font-semibold rounded px-4 py-1.5 mt-2">
                Get the checklist
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <ChipStat>1,486 views</ChipStat>
            <ChipStat>10.8% click rate</ChipStat>
          </div>
        </ReportCard>
      </div>

      <ReportCard
        title="CTA performance"
        subtitle="See which calls-to-action drive the most action"
      >
        <DataTable columns={ctaCols} rows={ctaRows} />
      </ReportCard>
    </div>
  )
}

function ChipStat({ children }) {
  return (
    <span className="inline-block text-[10px] font-medium text-hs-text-dark bg-hs-canvas border border-hs-border rounded-[3px] px-2.5 py-1">
      {children}
    </span>
  )
}

/* ============================== CAMPAIGNS ============================== */

function CampaignsTab() {
  const usd = (n) => `$${n.toLocaleString('en-US')}`
  const campCols = [
    { key: 'name', label: 'Campaign' },
    {
      key: 'channel',
      label: 'Channel',
      render: (v) => <Tag color={channelColor(v)}>{v}</Tag>,
    },
    { key: 'leads', label: 'Leads', align: 'right' },
    {
      key: 'revenue',
      label: 'Closed Revenue',
      align: 'right',
      render: (v) => (
        <span className="font-semibold text-hs-green">{usd(v)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Filters bar mock */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-white border border-hs-border rounded-md px-3 py-1.5 text-[12px] text-hs-text-dark">
          Last 6 months
          <span className="text-hs-text-light">▾</span>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-white border border-hs-border rounded-md px-3 py-1.5 text-[12px] text-hs-text-light">
          All channels
          <span>▾</span>
        </span>
      </div>

      <ReportCard
        title="Campaign ROI — leads and closed revenue by campaign"
        subtitle="Tie marketing spend directly to revenue won"
      >
        <DataTable columns={campCols} rows={CAMPAIGNS_DEMO} />
      </ReportCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReportCard
          title="Where leads come from"
          subtitle="Last 6 months · by source"
        >
          <DonutChart
            data={LEAD_SOURCES}
            centerValue="103"
            centerLabel="leads · 6 mo"
          />
        </ReportCard>

        <div className="grid grid-cols-1 gap-3">
          <StatCard label="Cost per lead" value="$42" />
          <StatCard label="Marketing-sourced revenue" value="$285K" />
          <StatCard label="Best channel" value="Email" />
        </div>
      </div>
    </div>
  )
}

function channelColor(channel) {
  if (channel.includes('Paid Search')) return 'blue'
  if (channel.includes('Paid Social')) return 'purple'
  if (channel.includes('Calls')) return 'green'
  return 'orange'
}

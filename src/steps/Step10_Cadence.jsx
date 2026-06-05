import { useStore } from '../store/useStore'
import { StepHeader, ConfigSection, StepBody } from '../shared/StepLayout'
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_FREQUENCIES,
  DAYS,
} from '../constants/defaultCadence'

function MeetingRow({ meeting }) {
  const toggleMeeting = useStore((s) => s.toggleMeeting)
  const setMeetingField = useStore((s) => s.setMeetingField)
  return (
    <div
      className={`rounded-lg border p-3 ${
        meeting.enabled ? 'border-hs-blue/40 bg-hs-blue/5' : 'border-hs-border bg-white'
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => toggleMeeting(meeting.key)}
          className={`w-9 h-5 rounded-full shrink-0 relative transition-colors ${
            meeting.enabled ? 'bg-hs-orange' : 'bg-hs-border'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
              meeting.enabled ? 'left-[18px]' : 'left-0.5'
            }`}
          />
        </button>
        <span className="flex-1 font-ui font-semibold text-hs-navy text-[13px]">
          {meeting.label}
        </span>
      </div>
      {meeting.enabled && (
        <div className="mt-2 pl-11 space-y-2">
          <div className="flex gap-2">
            <select
              value={meeting.day}
              onChange={(e) => setMeetingField(meeting.key, 'day', e.target.value)}
              className="rounded border border-hs-border px-2 py-1 text-[12px] font-ui focus:outline-none focus:border-hs-blue"
            >
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <input
              value={meeting.time}
              onChange={(e) => setMeetingField(meeting.key, 'time', e.target.value)}
              className="w-24 rounded border border-hs-border px-2 py-1 text-[12px] font-ui focus:outline-none focus:border-hs-blue"
              placeholder="9:00 AM"
            />
          </div>
          <input
            value={meeting.agenda}
            onChange={(e) => setMeetingField(meeting.key, 'agenda', e.target.value)}
            placeholder="Agenda topics"
            className="w-full rounded border border-hs-border px-2 py-1 text-[12px] font-ui focus:outline-none focus:border-hs-blue"
          />
        </div>
      )}
    </div>
  )
}

// Rule row with an enable toggle and an inline numeric/text value.
function RuleRow({ enabledField, label, children }) {
  const enabled = useStore((s) => s.session.cadence.rules[enabledField])
  const setRule = useStore((s) => s.setRule)
  return (
    <div className="flex items-center gap-2 py-1.5">
      <input
        type="checkbox"
        checked={!!enabled}
        onChange={() => setRule(enabledField, !enabled)}
        className="accent-hs-orange"
      />
      <span className="text-[13px] font-ui text-hs-text-dark flex-1 flex items-center gap-1.5 flex-wrap">
        {label}
        {children}
      </span>
    </div>
  )
}

function NumberInput({ field, width = 'w-14' }) {
  const value = useStore((s) => s.session.cadence.rules[field])
  const setRule = useStore((s) => s.setRule)
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => setRule(field, Number(e.target.value))}
      className={`${width} rounded border border-hs-border px-1.5 py-0.5 text-[13px] font-ui text-center focus:outline-none focus:border-hs-blue`}
    />
  )
}

export default function Step10_Cadence({ index }) {
  const cadence = useStore((s) => s.session.cadence)
  const setRule = useStore((s) => s.setRule)
  const toggleNotificationChannel = useStore((s) => s.toggleNotificationChannel)
  const setNotificationFrequency = useStore((s) => s.setNotificationFrequency)

  return (
    <StepBody>
      <StepHeader
        index={index}
        intro="Set the rhythm and rules that keep your team accountable."
      />

      <ConfigSection title="Meeting Cadence">
        <div className="space-y-2">
          {cadence.meetings.map((m) => (
            <MeetingRow key={m.key} meeting={m} />
          ))}
        </div>
      </ConfigSection>

      <ConfigSection title="Rep Accountability Rules">
        <div className="divide-y divide-hs-border">
          <RuleRow enabledField="flagNoActivityEnabled" label="Flag deals with no activity in">
            <NumberInput field="flagNoActivityDays" /> days
          </RuleRow>
          <div className="flex items-center gap-2 py-1.5">
            <input
              type="checkbox"
              checked={cadence.rules.requireNextStep}
              onChange={() => setRule('requireNextStep', !cadence.rules.requireNextStep)}
              className="accent-hs-orange"
            />
            <span className="text-[13px] font-ui text-hs-text-dark">
              Require a next step on every open deal
            </span>
          </div>
          <RuleRow enabledField="autoRemindEnabled" label="Auto-remind if a task is overdue by">
            <NumberInput field="autoRemindOverdueDays" /> days
          </RuleRow>
          <RuleRow enabledField="requireCloseDateEnabled" label="Require a close date past stage">
            <select
              value={cadence.rules.requireCloseDatePastStage}
              onChange={(e) => setRule('requireCloseDatePastStage', e.target.value)}
              className="rounded border border-hs-border px-2 py-0.5 text-[13px] font-ui focus:outline-none focus:border-hs-blue"
            >
              {['Prospecting', 'Qualified', 'Proposal Sent', 'Negotiation'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </RuleRow>
          <RuleRow enabledField="minCallsEnabled" label="Log a minimum of">
            <NumberInput field="minCallsPerWeek" /> calls/week
          </RuleRow>
        </div>
      </ConfigSection>

      <ConfigSection title="Notification Preferences">
        <div className="mb-3">
          <p className="text-[12px] font-ui font-semibold text-hs-text-dark mb-1.5">Channels</p>
          <div className="flex flex-wrap gap-1.5">
            {NOTIFICATION_CHANNELS.map((ch) => {
              const on = cadence.notifications.channels.includes(ch)
              return (
                <button
                  key={ch}
                  onClick={() => toggleNotificationChannel(ch)}
                  className={`text-[13px] font-ui px-2.5 py-1 rounded-full border ${
                    on
                      ? 'border-hs-green/40 bg-hs-green/10 text-hs-text-dark'
                      : 'border-hs-border bg-white text-hs-text-light hover:border-hs-text-light'
                  }`}
                >
                  {on ? '✓ ' : '+ '}
                  {ch}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <p className="text-[12px] font-ui font-semibold text-hs-text-dark mb-1.5">Frequency</p>
          <div className="flex gap-1.5">
            {NOTIFICATION_FREQUENCIES.map((f) => (
              <button
                key={f}
                onClick={() => setNotificationFrequency(f)}
                className={`text-[13px] font-ui px-3 py-1 rounded-full border ${
                  cadence.notifications.frequency === f
                    ? 'border-hs-orange bg-hs-orange/10 text-hs-navy font-medium'
                    : 'border-hs-border bg-white text-hs-text-light hover:border-hs-text-light'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </ConfigSection>
    </StepBody>
  )
}

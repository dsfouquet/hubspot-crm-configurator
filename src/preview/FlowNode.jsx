import { Handle, Position } from 'reactflow'

// Per-type styling (spec Section 9 — ReactFlow node colors).
const KIND = {
  trigger: { border: '#FF7A59', bg: '#FFF5F2', icon: '⚡', label: 'Trigger' },
  condition: { border: '#0091AE', bg: '#F0FAFC', icon: '◇', label: 'If / Else' },
  action: { border: '#CBD6E2', bg: '#FFFFFF', icon: '⚙', label: 'Action' },
  delay: { border: '#6A78D1', bg: '#F5F4FF', icon: '⏱', label: 'Delay' },
  end: { border: '#00BDA5', bg: '#F0FDF9', icon: '✓', label: 'End' },
}

// Single registered node type; renders by data.kind.
export default function FlowNode({ data, selected }) {
  const k = KIND[data.kind] || KIND.action
  const isCondition = data.kind === 'condition'

  return (
    <div
      className="rounded-lg shadow-sm"
      style={{
        border: `2px solid ${k.border}`,
        background: k.bg,
        width: 200,
        padding: '8px 10px',
        fontFamily: 'Lexend Deca, sans-serif',
        boxShadow: selected ? `0 0 0 3px rgba(255,122,89,0.35)` : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: k.border }} />

      <div className="flex items-center gap-1.5 mb-0.5">
        <span style={{ fontSize: 12 }}>{k.icon}</span>
        <span
          style={{ fontSize: 9, color: k.border, textTransform: 'uppercase', letterSpacing: 0.5 }}
          className="font-semibold"
        >
          {k.label}
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#33475B', lineHeight: 1.25 }} className="font-medium">
        {data.label}
      </div>
      {data.detail && (
        <div style={{ fontSize: 10, color: '#7C98B6', marginTop: 2 }}>{data.detail}</div>
      )}

      {/* Source handles: condition gets Yes (bottom) + No (right); others bottom only. */}
      {isCondition ? (
        <>
          <Handle
            id="yes"
            type="source"
            position={Position.Bottom}
            style={{ background: '#00BDA5' }}
          />
          <Handle
            id="no"
            type="source"
            position={Position.Right}
            style={{ background: '#F2545B' }}
          />
        </>
      ) : (
        data.kind !== 'end' && (
          <Handle type="source" position={Position.Bottom} style={{ background: k.border }} />
        )
      )}
    </div>
  )
}

export const nodeTypes = { hsNode: FlowNode }

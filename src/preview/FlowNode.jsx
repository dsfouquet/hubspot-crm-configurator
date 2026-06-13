import { Handle, Position } from 'reactflow'

// Tiny per-kind SVG icons (stroke = node accent color), replacing emoji.
const ic = { width: 11, height: 11, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const NodeIcon = ({ kind, color }) => {
  switch (kind) {
    case 'trigger':
      return (
        <svg {...ic} stroke={color}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    case 'condition':
      return (
        <svg {...ic} stroke={color}>
          <rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)" />
        </svg>
      )
    case 'delay':
      return (
        <svg {...ic} stroke={color}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15.5 14" />
        </svg>
      )
    case 'end':
      return (
        <svg {...ic} stroke={color}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    default:
      return (
        <svg {...ic} stroke={color}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
        </svg>
      )
  }
}

// Per-type styling (spec Section 9 — ReactFlow node colors).
const KIND = {
  trigger: { border: '#FF7A59', bg: '#FFF5F2', label: 'Trigger' },
  condition: { border: '#0091AE', bg: '#F0FAFC', label: 'If / Else' },
  action: { border: '#7C98B6', bg: '#FFFFFF', label: 'Action' },
  delay: { border: '#6A78D1', bg: '#F5F4FF', label: 'Delay' },
  end: { border: '#00BDA5', bg: '#F0FDF9', label: 'End' },
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
        <NodeIcon kind={data.kind} color={k.border} />
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

import { useMemo, useState, useRef, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from './FlowNode'
import { workflowToFlow } from '../utils/workflowToFlow'
import Spotlight from './Spotlight'

// Per-kind accent (matches FlowNode) + a plain-English explanation of the stage,
// so a presenter can click any step and say exactly what it does.
const KIND_META = {
  trigger: {
    accent: '#FF7A59',
    label: 'Trigger',
    explain:
      'This is what kicks the automation off. The moment it happens for a contact or deal, HubSpot enrolls them and every step below runs automatically.',
  },
  delay: {
    accent: '#6A78D1',
    label: 'Delay',
    explain:
      'HubSpot waits before the next step — so follow-ups land at the right time instead of all at once. You set the timing once; it holds forever.',
  },
  condition: {
    accent: '#0091AE',
    label: 'If / Else branch',
    explain:
      'The path splits here based on the contact’s behavior (did they reply? open it? click?). Each branch gets its own follow-up, so nobody gets the wrong message.',
  },
  action: {
    accent: '#7C98B6',
    label: 'Action',
    explain:
      'HubSpot does this for you automatically — send an email, create a task, update a property, or notify a rep. No one has to remember to do it.',
  },
  end: {
    accent: '#00BDA5',
    label: 'Workflow ends',
    explain:
      'The contact exits the automation here — they’ve either converted or been handed off to a person to take it from here.',
  },
}

// Public component: wrap in an explicit ReactFlowProvider so the flow store is
// always present and initializes (the implicit wrapper intermittently failed to
// process nodes here, leaving the diagram with no edges).
export default function WorkflowDiagram({ workflow }) {
  return (
    <ReactFlowProvider>
      <Diagram workflow={workflow} />
    </ReactFlowProvider>
  )
}

// Renders one workflow's ReactFlow diagram. Click a node to spotlight that stage.
// Re-fits the view when its container resizes (e.g. dragging the split handle).
function Diagram({ workflow }) {
  const flow = useMemo(() => workflowToFlow(workflow), [workflow])
  // ReactFlow OWNS node/edge state via these hooks. The onNodesChange handler is
  // what applies ReactFlow's internal dimension-measurement events — without it
  // (plain controlled props) nodes never register dimensions/handleBounds, so
  // edges never render and fitView no-ops. We do NOT re-seed via useEffect (that
  // would wipe the measured dimensions on mount); the parent remounts this
  // component with key={workflow.id} when the focused workflow changes.
  const [nodes, , onNodesChange] = useNodesState(flow.nodes)
  const [edges, , onEdgesChange] = useEdgesState(flow.edges)
  const [selected, setSelected] = useState(null) // { node, rect }
  const rfRef = useRef(null)
  const wrapRef = useRef(null)

  // Observe container size; re-fit the diagram on resize (rAF-debounced).
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        rfRef.current?.fitView({ padding: 0.2, duration: 150 })
      })
    })
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={(inst) => {
          rfRef.current = inst
          requestAnimationFrame(() => inst.fitView({ padding: 0.2 }))
        }}
        onNodeClick={(e, node) => {
          const el = e.target.closest('.react-flow__node')
          setSelected({ node, rect: el ? el.getBoundingClientRect() : null })
        }}
        onPaneClick={() => setSelected(null)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Background color="#CBD6E2" gap={18} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>

      {/* Stage spotlight — the clicked node zooms to center with a plain-English
          explanation of what that step does; click-out shrinks it back. */}
      {selected && selected.rect && (() => {
        const kind = selected.node.data.kind || 'action'
        const meta = KIND_META[kind] || KIND_META.action
        return (
          <Spotlight
            originRect={selected.rect}
            accent={meta.accent}
            onClose={() => setSelected(null)}
          >
            <div className="px-6 py-5">
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-wide text-white rounded-[3px] px-2 py-0.5"
                style={{ backgroundColor: meta.accent }}
              >
                {meta.label}
              </span>
              <h3 className="text-[18px] font-semibold text-hs-navy leading-snug mt-3">
                {selected.node.data.label}
              </h3>
              {selected.node.data.detail && (
                <p className="text-[13px] text-hs-text-dark mt-1.5 font-medium">
                  {selected.node.data.detail}
                </p>
              )}
              <p className="text-[13px] text-hs-text-dark leading-relaxed mt-3">{meta.explain}</p>
              <p className="text-[11px] text-hs-text-light mt-4">
                This runs automatically inside HubSpot — built and tuned for you by Crescent Connect.
              </p>
            </div>
          </Spotlight>
        )
      })()}
    </div>
  )
}

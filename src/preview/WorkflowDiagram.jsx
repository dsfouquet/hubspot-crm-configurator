import { useMemo, useState, useRef, useEffect } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from './FlowNode'
import { workflowToFlow } from '../utils/workflowToFlow'

// Renders one workflow's ReactFlow diagram. Click a node to see its detail.
// Re-fits the view when its container resizes (e.g. dragging the split handle).
export default function WorkflowDiagram({ workflow }) {
  const { nodes, edges } = useMemo(() => workflowToFlow(workflow), [workflow])
  const [selected, setSelected] = useState(null)
  const rfRef = useRef(null)
  const wrapRef = useRef(null)

  const styledNodes = nodes.map((n) => ({ ...n, selected: n.id === selected?.id }))

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
        nodes={styledNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={(inst) => (rfRef.current = inst)}
        onNodeClick={(_, node) => setSelected(node)}
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

      {/* Node detail popover */}
      {selected && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-white border border-hs-border rounded-lg shadow-lg px-4 py-2.5 font-preview">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-hs-navy">{selected.data.label}</p>
              <p className="text-[12px] text-hs-text-light">
                {selected.data.detail || `${selected.data.kind} step`}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-hs-text-light hover:text-hs-navy text-sm"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

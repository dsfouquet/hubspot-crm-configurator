import { lazy, Suspense } from 'react'

// ReactFlow is the heaviest dependency in the bundle — load it only when a
// workflow diagram actually renders, keeping it out of the initial chunk.
const WorkflowDiagram = lazy(() => import('./WorkflowDiagram'))

export default function LazyWorkflowDiagram(props) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center text-[12px] font-preview text-hs-text-light">
          Loading diagram…
        </div>
      }
    >
      <WorkflowDiagram {...props} />
    </Suspense>
  )
}

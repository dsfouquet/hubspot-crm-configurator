// Convert a workflow node graph ({id,type,label,detail,next,nextElse}) into
// positioned ReactFlow nodes + edges. Simple layered tree layout: follow `next`
// down a column; `nextElse` branches one column to the right.

const COL_W = 250
const ROW_H = 120

export function workflowToFlow(workflow) {
  if (!workflow || !workflow.nodes?.length) return { nodes: [], edges: [] }

  const byId = Object.fromEntries(workflow.nodes.map((n) => [n.id, n]))
  const trigger = workflow.nodes.find((n) => n.type === 'trigger') || workflow.nodes[0]

  const pos = {} // id -> {col,row}
  let maxRowInCol = {} // col -> next free row

  // Assign grid positions via DFS; first assignment wins (handles merges).
  const assign = (id, col, row) => {
    if (!id || !byId[id] || pos[id]) return
    // Keep nodes from overlapping in the same column.
    const startRow = Math.max(row, maxRowInCol[col] ?? 0)
    pos[id] = { col, row: startRow }
    maxRowInCol[col] = startRow + 1
    const node = byId[id]
    if (node.next) assign(node.next, col, startRow + 1)
    if (node.nextElse) assign(node.nextElse, col + 1, startRow + 1)
  }
  assign(trigger.id, 0, 0)

  // Any unreached nodes (shouldn't happen) get appended in a new column.
  workflow.nodes.forEach((n) => {
    if (!pos[n.id]) {
      const col = Math.max(0, ...Object.values(pos).map((p) => p.col)) + 1
      pos[n.id] = { col, row: maxRowInCol[col] ?? 0 }
      maxRowInCol[col] = pos[n.id].row + 1
    }
  })

  const nodes = workflow.nodes.map((n) => ({
    id: n.id,
    type: 'hsNode',
    position: { x: pos[n.id].col * COL_W, y: pos[n.id].row * ROW_H },
    data: { kind: n.type, label: n.label, detail: n.detail },
  }))

  const edges = []
  workflow.nodes.forEach((n) => {
    if (n.next) {
      edges.push({
        id: `${n.id}-${n.next}`,
        source: n.id,
        target: n.next,
        sourceHandle: n.type === 'condition' ? 'yes' : null,
        label: n.type === 'condition' ? 'Yes' : undefined,
        animated: true,
        style: { stroke: '#CBD6E2', strokeWidth: 2 },
        labelStyle: { fontSize: 10, fill: '#7C98B6', fontFamily: 'Lexend Deca' },
      })
    }
    if (n.nextElse) {
      edges.push({
        id: `${n.id}-${n.nextElse}-else`,
        source: n.id,
        target: n.nextElse,
        sourceHandle: 'no',
        label: 'No',
        animated: true,
        style: { stroke: '#CBD6E2', strokeWidth: 2 },
        labelStyle: { fontSize: 10, fill: '#7C98B6', fontFamily: 'Lexend Deca' },
      })
    }
  })

  return { nodes, edges }
}

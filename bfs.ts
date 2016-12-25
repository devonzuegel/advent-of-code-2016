// const bfs = (nodes: Node[], start: Node, finish: Node, grid: boolean[][]): Node[] => {
//   let path: Node[] = [start]
//   let bfsNodes = {}
//   nodes.map(n => bfsNodes[toKey(n)] = { parent: null, distance: Infinity })
//   p(R.keys(bfsNodes).length)
//   // let q            = R.filter(R.where({ distance: R.equals(0) }), bfsNodes)
//   // p(JSON.stringify(q))
//   return path
//   // while (!q.empty()) {
//   //   let smallest: Node = q.dequeue()

//   //   if (sameNode(smallest, finish)) {
//   //     while (previous[toKey(smallest)]) {
//   //       path.push(smallest)
//   //       smallest = previous[toKey(smallest)]
//   //     }
//   //     return path
//   //   }

//   //   if (!smallest || costs[toKey(smallest)] === Infinity) {
//   //     continue
//   //   }

//   //   const neighbors = getNeighbors(smallest, nodes, grid)
//   //   for (var i = 0; i < neighbors.length; ++i) {
//   //     const neighbor = neighbors[i]
//   //     const alt: number = costs[toKey(smallest)] + 1

//   //     if (alt < costs[toKey(neighbor)]) {
//   //       costs[toKey(neighbor)] = alt
//   //       previous[toKey(neighbor)] = smallest
//   //       q.enqueue(alt, neighbor)
//   //     }
//   //   }
//   // }

//   // throw Error()
// }

/**
 * Breadth-First-Search(Graph, root):

    for each node n in Graph:
        n.distance = INFINITY
        n.parent = NIL

    create empty queue Q

    root.distance = 0
    Q.enqueue(root)

    while Q is not empty:
        current = Q.dequeue()
        for each node n that is adjacent to current:
            if n.distance == INFINITY:
                n.distance = current.distance + 1
                n.parent = current
                Q.enqueue(n)
 */

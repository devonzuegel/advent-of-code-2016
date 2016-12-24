import * as R from 'ramda'
import * as C from 'chalk'
import { PriorityQueue } from './priority_queue'
import { cmp, getLines, p } from './utils'

const EXAMPLE = `###########
#0.1.....2#
#.#######.#
#4.......3#
###########`

interface Node {
  [index: string]: number|boolean,
  x:               number,
  y:               number,
  blocked:         boolean,
}

/**
 * - generate grid from input
 * - find location of 0
 * - Dijkstra's between each individual node
 * - return min of all possible combinations (if 012, then min of 0=>1/1=>2 or 0=2/2=>1)
 */

const sameNode = (A: Node, B: Node): boolean => (A.x == B.x && A.y == B.y)
const initialCost = (node: Node, start: Node): number => sameNode(node, start) ? 0 : Infinity
const toKey = (node: Node): string => JSON.stringify({ x: node.x, y: node.y })

const getNeighbors = (node: Node, nodes: Node[], grid: boolean[][]) =>
  R.reduce(
    (acc: Node[], elem: Node): Node[] => {
      if (Math.abs(node.x - elem.x) === 1 && Math.abs(node.y - elem.y) === 0 ||
          Math.abs(node.x - elem.x) === 0 && Math.abs(node.y - elem.y) === 1) {
        if (!grid[elem.x][elem.y]) {
          return [...acc, elem]
        }
      }
      return acc
    },
    [],
    nodes,
  )

const shortestPath = (nodes: Node[], start: Node, finish: Node, grid: boolean[][]): Node[] => {
  const initNode = (acc, node: Node) => {
    const key = toKey(node)
    const cost = initialCost(node, start)
    q.enqueue(cost, node)
    return R.merge(acc, { [key]: cost })
  }

  let path: Node[] = [start]
  let previous     = {}
  let q            = new PriorityQueue()
  let costs        = R.reduce(initNode, {}, nodes)

  while (!q.empty()) {
    let smallest: Node = q.dequeue()

    if (sameNode(smallest, finish)) {
      while (previous[toKey(smallest)]) {
        path.push(smallest)
        smallest = previous[toKey(smallest)]
      }
      return path
    }

    if (!smallest || costs[toKey(smallest)] === Infinity) {
      continue
    }

    const neighbors = getNeighbors(smallest, nodes, grid)
    p(C.blue(JSON.stringify(neighbors)))
    for (var i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i]
      const alt: number = costs[toKey(smallest)] + 1

      if (alt < costs[toKey(neighbor)]) {
        costs[toKey(neighbor)] = alt
        previous[toKey(neighbor)] = smallest
        q.enqueue(alt, neighbor)
      }
    }
  }

  throw Error()
}

const buildGrid = (lines: string[]) => R.map(
  R.pipe(
    R.split(''),
    R.map((char: string) => (char === '#')),
  ),
  lines,
)

const getLocations = (lines: string[]) => {
  let locations = {}
  const parsed = R.map(
    R.pipe(
      R.split(''),
      R.map(parseInt),
    ),
    lines,
  )
  parsed.map((row, x) => {
    row.map((elem, y) => {
      if (!!elem) {
        locations = R.merge(locations, { [elem]: { x, y } })
      }
    })
  })
  return locations
}

const fn = (grid: boolean[][]) => {
  const nodes  = R.flatten(grid.map((row, x) => row.map((blocked, y) => ({ x, y, blocked }))))
  const start  = { x: 1, y: 1, blocked: false }
  const finish = { x: 3, y: 1, blocked: false }
  return shortestPath(R.flatten(nodes), start, finish, grid)
}

const TESTS = [
  /******************** ____ ************************/
    () => [
      buildGrid(R.split("\n", EXAMPLE)),
      [[true,true,true,true,true,true,true,true,true,true,true],[true,false,false,false,false,false,false,false,false,false,true],[true,false,true,true,true,true,true,true,true,false,true],[true,false,false,false,false,false,false,false,false,false,true],[true,true,true,true,true,true,true,true,true,true,true]],
    ],
    () => [
      getLocations(R.split("\n", EXAMPLE)),
      {
        '1': { x: 1, y: 3 },
        '2': { x: 1, y: 9 },
        '3': { x: 3, y: 9 },
        '4': { x: 3, y: 1 },
      },
    ],
    () => [
      fn(buildGrid(R.split("\n", EXAMPLE))),
      undefined,
    ],
    // () => [
    //   ____(getLines('12.txt')),
    //   undefined,
    // ],
]

const OLD_TESTS = [
]

R.concat(TESTS, OLD_TESTS).forEach(test => {
// TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

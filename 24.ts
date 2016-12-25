import * as R from 'ramda'
import * as C from 'chalk'
import { PriorityQueue } from './priority_queue'
import { cmp, getLines, p, range } from './utils'

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

const dijkstras = (nodes: Node[], start: Node, finish: Node, grid: boolean[][]): Node[] => {
  const initNode = (node: Node) => {
    const cost = initialCost(node, start)
    q.enqueue(cost, node)
    return cost
  }

  let path: Node[] = [start]
  let previous     = {}
  let q            = new PriorityQueue()
  let costs        = {}
  nodes.map(n => costs[toKey(n)] = initNode(n))

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
      if (elem !== null && elem >= 0) {
        locations = R.merge(locations, { [elem]: { x, y } })
      }
    })
  })
  return locations
}

const permute = (arr: any[]) => {
  var results = [],
      l = arr.length,
      used = Array(l), // Array of bools. Keeps track of used items
      data = Array(l); // Stores items of the current permutation
  (function backtracking(pos) {
    if(pos == l) return results.push(data.slice());
    for(var i=0; i<l; ++i) if(!used[i]) { // Iterate unused items
      used[i] = true;      // Mark item as used
      data[pos] = arr[i];  // Assign item at the current position
      backtracking(pos+1); // Recursive call
      used[i] = false;     // Mark item as not used
    }
  })(0);
  return results;
}

const shortestPath = (start: Node, finish: Node, grid: boolean[][]) => {
  const nodes  = R.flatten(grid.map((row, x) => row.map((blocked, y) => ({ x, y, blocked }))))
  return dijkstras(R.flatten(nodes), start, finish, grid)
}

const possibleOrderings = (list: number[]) => R.filter(
  (numbers: number[]) => R.pipe(R.head, R.equals(0))(numbers),
  permute(list)
)

const costOfOrdering = (steps: number[], stepCosts) => {
  let costs = {}
  for (var i = 0; i < steps.length - 1; ++i) {
    const [A, B] = [steps[i], steps[i + 1]]
    costs[`${A}-${B}`] = stepCosts[`${A}-${B}`]
  }
  return costs
}

const getMinCost = (num: number, inputLines: string[]) => {
  const locations = getLocations(inputLines)
  const pairs = R.pipe(
    R.reject(pair => pair[0] === pair[1]),
    R.map(R.sort((a: number, b: number) => (a - b))),
    R.uniq,
  )(R.xprod(range(0, num), range(0, num)))

  p(C.blue(String(pairs.length)))

  let stepCosts = {}
  const grid = buildGrid(inputLines)
  R.map(
    ([ A, B ]: number[]): void => {
      const [start, finish] = [locations[`${A}`], locations[`${B}`]]
      // p(`calculating shortest path between ${[start.x, start.y]} and ${[finish.x, finish.y]}`)

      const pathLength = shortestPath(start, finish, grid).length - 1
      stepCosts[`${A}-${B}`] = pathLength
      stepCosts[`${B}-${A}`] = pathLength
    },
    pairs
  )
  const costs = R.map(o => costOfOrdering([...o, 0], stepCosts), possibleOrderings(range(0, num)))
  const summedCosts = R.map(R.pipe(R.values, R.sum), costs)
  return R.reduce(R.min, Infinity, summedCosts)
}

const TESTS = [
    // () => [
    //   buildGrid(R.split("\n", EXAMPLE)),
    //   [[true,true,true,true,true,true,true,true,true,true,true],[true,false,false,false,false,false,false,false,false,false,true],[true,false,true,true,true,true,true,true,true,false,true],[true,false,false,false,false,false,false,false,false,false,true],[true,true,true,true,true,true,true,true,true,true,true]],
    // ],
    // () => [
    //   getLocations(R.split("\n", EXAMPLE)),
    //   {
    //     '0': { x: 1, y: 1},
    //     '1': { x: 1, y: 3 },
    //     '2': { x: 1, y: 9 },
    //     '3': { x: 3, y: 9 },
    //     '4': { x: 3, y: 1 },
    //   },
    // ],
    // () => [
    //   shortestPath(
    //     { x: 1, y: 1, blocked: false },
    //     { x: 3, y: 1, blocked: false },
    //     buildGrid(R.split("\n", EXAMPLE))
    //   ),
    //   undefined,
    // ],
    // () => [
    //   possibleOrderings([0,1,2]),
    //   [[0,1,2],[0,2,1]],
    // ],
    // () => [
    //   costOfOrdering(
    //     [0,1,2],
    //     getLocations(R.split("\n", EXAMPLE)),
    //     buildGrid(R.split("\n", EXAMPLE))
    //   ),
    //   {}
    // ],
    // () => [
    //   costOfOrdering(
    //     [0,4,1,2,3],
    //     getLocations(R.split("\n", EXAMPLE)),
    //     buildGrid(R.split("\n", EXAMPLE))
    //   ),
    //   {
    //     '0-4': 2,
    //     '4-1': 4,
    //     '1-2': 6,
    //     '2-3': 2,
    //   },
    // ],
    () => [
      getMinCost(4, R.split("\n", EXAMPLE)),
      14,
    ],
    () => [
      getMinCost(7, getLines('24.txt')),
      464,
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


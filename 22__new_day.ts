// import * as XRegExp from 'xregexp'
import { PriorityQueue } from './priority_queue'
import * as R from 'ramda'
import { cmp, p, getLines, range } from './utils'
import * as C from 'chalk'

interface Coord {
  x: number,
  y: number,
}

interface Node {
  x:          number,
  y:          number,
  size:       number,
  used:       number,
  avail:      number,
  percentage: number,
}

const viablePair = (A: Node, B: Node): boolean => {
  if (A.used === 0) return false
  if (A.x === B.x && A.y === B.y) return false
  return A.used < B.avail
}

const extractNums = (str: string): number[] =>
  R.map(parseInt, R.match(/\d+/g, str))

const parseLine = (line: string): Node => {
  const nums = extractNums(line)
  return {
    x:          nums[0],
    y:          nums[1],
    size:       nums[2],
    used:       nums[3],
    avail:      nums[4],
    percentage: nums[5],
  }
}

const countViable = (nodes: Node[]): number => {
  let count = 0
  for (var i = 0; i < nodes.length; ++i) {
    for (var j = 0; j < nodes.length; ++j) {
      if (viablePair(nodes[i], nodes[j])) {
        count += 1
      }
    }
  }
  return count
}

const getNodes = (lines: string[]): Node[] => R.filter(
  R.test(/^\/dev\/grid\/.*/),
  lines,
).map(parseLine)

const getDimension = (dimension: string) => (nodes: Node[]) =>
  R.pipe(
    R.map(R.prop('x')),
    R.sort((a: number, b: number) => { return a - b }),
    (coords: number[]) => R.last(coords),
    R.add(1),
  )(nodes)

const emptyGrid = ({ x, y }) => R.times(() => R.times(() => null, x), y)

const buildGrid = (nodes: Node[]): Node[][] => {
  const x = getDimension('x')(nodes)
  const y = getDimension('y')(nodes)
  let grid = emptyGrid({ x, y })
  nodes.map(node => grid[node.x][node.y] = node )
  return R.transpose(grid)
}

const isValidNeighbor = (A: Node) => (B: Node): boolean =>
  (Math.abs(A.x - B.x) === 1 && Math.abs(A.y - B.y) === 0) ||
  (Math.abs(A.x - B.x) === 0 && Math.abs(A.y - B.y) === 1)

const getNeighbors = (node: Node, nodes: Node[]): Node[] =>
  R.filter(isValidNeighbor(node))(nodes)

const sameNode = (A: Node|Coord, B: Node|Coord): boolean => (A.x == B.x && A.y == B.y)
const initialCost = (node: Node, start: Node): number => sameNode(node, start) ? 0 : Infinity

const toCoord = (node: Node): Coord => ({ x: node.x, y: node.y })
const toCoordKey = (node: Node|Coord): string => JSON.stringify({ x: node.x, y: node.y })

const fillStatus = (node: Node, nodes: Node[]): number => {
    if (node.percentage === 0) return 0
    for (var i = 0; i < nodes.length; ++i) {
      if (node.used > nodes[i].size) return 2
    }
    return 1
}
const initialData = (nodes: Node[]) =>
  R.reduce((acc, node: Node) => R.merge(acc, {
    [toCoordKey(node)]: fillStatus(node, nodes)
  }), {}, nodes)

const shortestPath = (nodes: Node[], start: Node, finish: Node): Coord[] => {
  const initNode = (acc, node: Node) => {
    const key = toCoordKey(node)
    const cost = initialCost(node, start)
    q.enqueue(cost, node)
    return R.merge(acc, { [key]: cost })
  }

  let data     = initialData(nodes)
  let path     = []
  let previous = {}
  let q        = new PriorityQueue()
  let costs    = R.reduce(initNode, {}, nodes)

  // p(JSON.stringify(data, null, 2))

  while (!q.empty()) {
    let smallest: Node = q.dequeue()

    if (sameNode(smallest, finish)) {
      while (previous[toCoordKey(smallest)]) {
        path.push(R.pick(['x', 'y'], smallest))
        smallest = previous[toCoordKey(smallest)]
      }
      return path
    }

    if (!smallest || costs[toCoordKey(smallest)] === Infinity) {
      continue
    }

    const neighbors = getNeighbors(smallest, nodes)
    for (var i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i]
      const key = toCoordKey(smallest)
      const alt: number = costs[key] + ((data[key] === 2) ? Infinity : 1)

      if (alt < costs[toCoordKey(neighbor)]) {
        costs[toCoordKey(neighbor)] = alt
        previous[toCoordKey(neighbor)] = smallest
        q.enqueue(alt, neighbor)
      }
    }
  }
}

const dummyNode = ({ x, y }: { x: number, y: number }): Node => (
  { x: x, y: y, size: 111, used: 111, avail: 111, percentage: 111 }
)

const dummyInput = ({ xDim, yDim }): Node[] =>
  R.flatten(
    R.times(
      x => R.times(y => dummyNode({ x: x, y: y }), yDim),
      xDim
    )
  )

const drawPath = (path: Coord[], nodes: Node[]): void => {
  const grid = buildGrid(nodes)
  const data = initialData(nodes)
  for (var i = 0; i < grid.length; ++i) {
    const row = grid[i]
    const toPrint = row.map(coord => R.reduce(
      (defaultVal, pathStep) => {
        // if (coord.x === 1 && coord.y === 1) p(defaultVal)
        if (!R.isNil(coord)) {
          if (sameNode(R.head(path), coord)) return C.yellow('  ⦿   ')
          if (sameNode(R.last(path), coord)) return C.green('  ⦿   ')
          if (sameNode(pathStep, coord))     return C.white('  ⦿   ')
          if (data[toCoordKey(coord)] === 0) return C.gray('  _   ')
          if (data[toCoordKey(coord)] === 2) return C.gray('  #   ')
        }
        return defaultVal
      },
      C.black('  •   '),
      path
    ))
    // p('')
    p(R.join('', toPrint))
    // p(C.black(JSON.stringify(R.map(({ x, y }) => [x, y], row))))
  }
  p('')
}

const drawShortestPath = (nodes: Node[], start: Node, finish: Node): Coord[] => {
  const path = shortestPath(nodes, start, finish)
  drawPath([start, ...path, finish], nodes)
  return path
}

const moveGoalDataTo00 = (nodes: Node[]): number => {
  const [x, y] = [getDimension('x')(nodes), getDimension('y')(nodes)]

  const empty = R.head(R.filter(node => fillStatus(node, nodes) === 0, nodes))
  const grid = buildGrid(nodes)
  // p(JSON.stringify(grid))
  p(JSON.stringify(nodes))
  // p(grid[0][0])
  // p(grid[x - 1][0])
  const path = drawShortestPath(
    nodes,
    grid[0][0],
    grid[grid.length - 2][0],
    // R.head(R.filter(
    //   (node) => node.x === 0 && node.y === 0,
    //   nodes
    // )),
    // R.head(R.filter(
    //   (node) => node.x === toCoord(empty).x && node.y === toCoord(empty).y,
    //   nodes
    // )),
  )
  return path.length + 5 * (x - 2)
}

const TESTS = [
  /****************************************************/
  /******************** ______ **********************/
    () => [
      ______('23-example.txt')),
      {
        '{"x":0,"y":0}': 1,
        '{"x":0,"y":1}': 1,
        '{"x":0,"y":2}': 2,
        '{"x":1,"y":0}': 1,
        '{"x":1,"y":1}': 0,
        '{"x":1,"y":2}': 1,
        '{"x":2,"y":0}': 1,
        '{"x":2,"y":1}': 1,
        '{"x":2,"y":2}': 1,
      },
    ],
]

const OLD_TESTS = [
]

// R.concat(TESTS, OLD_TESTS).forEach(test => {
TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

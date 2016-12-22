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
  return grid
}

const isValidNeighbor = (A: Node) => (B: Node): boolean =>
  (Math.abs(A.x - B.x) === 1 && Math.abs(A.y - B.y) === 0) ||
  (Math.abs(A.x - B.x) === 0 && Math.abs(A.y - B.y) === 1)

const getNeighbors = (node: Node, nodes: Node[]): Node[] =>
  R.filter(isValidNeighbor(node))(nodes)

const sameNode = (A: Node|Coord, B: Node|Coord): boolean => (A.x == B.x && A.y == B.y)
const initialCost = (node: Node, start: Node): number => sameNode(node, start) ? 0 : Infinity

const initialData = (nodes: Node[]) =>
  R.reduce((acc, node: Node) => {
    const coord = R.pick(['x', 'y'], node)
    const merged = (val: number) => R.merge(acc, { [JSON.stringify(coord)]: val })

    // p(node)
    if (node.percentage === 0) return merged(0)
    for (var i = 0; i < nodes.length; ++i) {
      if (node.used > nodes[i].size) return merged(2)
    }
    return merged(1)
  }, {}, nodes)

const shortestPath = (nodes: Node[], start: Node, finish: Node): Coord[] => {
  const initNode = (acc, node: Node) => {
    const key = JSON.stringify(node)
    const cost = initialCost(node, start)
    q.enqueue(cost, node)
    return R.merge(acc, { [key]: cost })
  }

  let data = initialData(nodes)

  p(JSON.stringify(data, null, 2))

  let path = []
  let previous = {}
  let q = new PriorityQueue()
  let costs = R.reduce(initNode, {}, nodes)

  while (!q.empty()) {
    let smallest: Node = q.dequeue()

    if (sameNode(smallest, finish)) {
      while (previous[JSON.stringify(smallest)]) {
        path.push(R.pick(['x', 'y'], smallest))
        smallest = previous[JSON.stringify(smallest)]
      }
      return path
    }

    if (!smallest || costs[JSON.stringify(smallest)] === Infinity) {
      continue
    }

    const neighbors = getNeighbors(smallest, nodes)
    for (var i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i]
      const alt: number = costs[JSON.stringify(smallest)] + 1

      if (alt < costs[JSON.stringify(neighbor)]) {
        costs[JSON.stringify(neighbor)] = alt
        previous[JSON.stringify(neighbor)] = smallest
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
  for (var i = 0; i < grid.length; ++i) {
    const row = grid[i]
    const toPrint = row.map(coord => R.reduce(
      (defaultVal, pathStep) => {
        if (sameNode(R.head(path), coord)) return C.yellow(' ⦿ ')
        if (sameNode(R.last(path), coord)) return C.green(' ⦿ ')
        if (sameNode(pathStep, coord)) return C.white(' ⦿ ')
        return defaultVal
      },
      C.black(' • '),
      path
    ))
    p(R.join('', toPrint))
  }
  p('')
}

const drawShortestPath = (nodes: Node[], start: Node, finish: Node): void => {
  const path = shortestPath(nodes, start, finish)
  drawPath([start, ...path, finish], nodes)
}

const TESTS = [
  /****************************************************/
  /******************** initialData **********************/
    () => [
      initialData(getNodes(getLines('22-example.txt'))),
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
  // /****************************************************/
  // /******************** drawShortestPath ******************/
  //   () => [
  //     drawShortestPath(
  //       dummyInput({ xDim: 2, yDim: 2 }),
  //       dummyNode({ x: 0, y: 0 }),
  //       dummyNode({ x: 0, y: 1 })
  //     ),
  //     undefined,
  //   ],
  //   () => [
  //     drawShortestPath(
  //       dummyInput({ xDim: 8, yDim: 8 }),
  //       dummyNode({ x: 0, y: 0 }),
  //       dummyNode({ x: 6, y: 4 })
  //     ),
  //     undefined,
  //   ],
]

const OLD_TESTS = [
  /****************************************************/
  /******************** drawShortestPath ******************/
    () => [
      drawShortestPath(
        dummyInput({ xDim: 8, yDim: 8 }),
        dummyNode({ x: 0, y: 0 }),
        dummyNode({ x: 6, y: 7 })
      ),
      undefined,
    ],
  /****************************************************/
  /******************** shortestPath ******************/
    () => [
      shortestPath(
        dummyInput({ xDim: 2, yDim: 2 }),
        dummyNode({ x: 0, y: 0 }),
        dummyNode({ x: 0, y: 1 })
      ),
      [{ x: 0, y: 1}],
    ],
    () => [
      shortestPath(
        dummyInput({ xDim: 2, yDim: 3 }),
        dummyNode({ x: 0, y: 0 }),
        dummyNode({ x: 1, y: 2 })
      ),
      [{ x: 1, y: 2 }, { x: 0, y: 2}, { x: 0, y: 1 }],
    ],
  /****************************************************/
  /******************** dummyInput *******************/
    () => [
      dummyInput({ xDim: 1, yDim: 3 }),
      [
        { x: 0, y: 0, size: 111, used: 111, avail: 111, percentage: 111 },
        { x: 0, y: 1, size: 111, used: 111, avail: 111, percentage: 111 },
        { x: 0, y: 2, size: 111, used: 111, avail: 111, percentage: 111 },
      ],
    ],
    () => [
      dummyInput({ xDim: 2, yDim: 2 }),
      [
        { x: 0, y: 0, size: 111, used: 111, avail: 111, percentage: 111 },
        { x: 0, y: 1, size: 111, used: 111, avail: 111, percentage: 111 },
        { x: 1, y: 0, size: 111, used: 111, avail: 111, percentage: 111 },
        { x: 1, y: 1, size: 111, used: 111, avail: 111, percentage: 111 },
      ],
    ],
  /****************************************************/
  /******************** isValidNeighbor *******************/
    () => [
      isValidNeighbor(dummyNode({ x: 0, y: 0 }))(dummyNode({ x: 0, y: 0 })),
      false,
    ],
    () => [
      isValidNeighbor(dummyNode({ x: 0, y: 0 }))(dummyNode({ x: 0, y: 1 })),
      true,
    ],
    () => [
      isValidNeighbor(dummyNode({ x: 0, y: 0 }))(dummyNode({ x: 1, y: 1 })),
      false,
    ],
    () => [
      isValidNeighbor(dummyNode({ x: 1, y: 0 }))(dummyNode({ x: 1, y: 1 })),
      true,
    ],
  /****************************************************/
  /******************** getNeighbors *******************/
    () => [
      getNeighbors(
        dummyNode({ x: 0, y: 0 }),
        dummyInput({ xDim: 2, yDim: 2 }),
      ),
      [
        dummyNode({ x: 0, y: 1 }),
        dummyNode({ x: 1, y: 0 }),
      ],
    ],
  /****************************************************/
  /******************** drawPath **********************/
    () => [
      drawPath(
        [{ x: 0, y: 0 }],
        dummyInput({ xDim: 2, yDim: 2 }),
      ),
      undefined,
    ],
    () => [
      drawPath(
        [
          { x: 0, y: 1},
          { x: 0, y: 2},
          { x: 1, y: 2},
          { x: 2, y: 2},
          { x: 3, y: 2},
          { x: 4, y: 2},
          { x: 4, y: 3},
        ],
        dummyInput({ xDim: 5, yDim: 5 }),
      ),
      undefined,
    ],
  /****************************************************/
  /******************** emptyGrid *******************/
    () => [
      emptyGrid({ x: 1, y: 2}),
      [
        [null],
        [null],
      ],
    ],
  /****************************************************/
  /******************** buildGrid *******************/
    () => [
      buildGrid(getNodes(getLines('22-example.txt'))),
      [
        [
          { x: 0, y: 0, size: 10, used: 8,  avail: 2, percentage: 80 },
          { x: 0, y: 1, size: 11, used: 6,  avail: 5, percentage: 54 },
          { x: 0, y: 2, size: 32, used: 28, avail: 4, percentage: 87 },
        ], [
          { x: 1, y: 0, size: 9,  used: 7,  avail: 2, percentage: 77 },
          { x: 1, y: 1, size: 8,  used: 0,  avail: 8, percentage: 0  },
          { x: 1, y: 2, size: 11, used: 7,  avail: 4, percentage: 63 },
        ], [
          { x: 2, y: 0, size: 10, used: 6,  avail: 4, percentage: 60 },
          { x: 2, y: 1, size: 9,  used: 8,  avail: 1, percentage: 88 },
          { x: 2, y: 2, size: 9,  used: 6,  avail: 3, percentage: 66 },
        ]
      ],
    ],
    () => [
      buildGrid([
        { x: 0, y: 0, size: 87, used: 71, avail: 16, percentage: 81 },
        { x: 1, y: 0, size: 87, used: 71, avail: 16, percentage: 81 },
        { x: 0, y: 1, size: 87, used: 71, avail: 16, percentage: 81 },
        { x: 1, y: 1, size: 87, used: 71, avail: 16, percentage: 81 },
      ]),
      [
        [
          { x: 0, y: 0, size: 87, used: 71, avail: 16, percentage: 81 },
          { x: 0, y: 1, size: 87, used: 71, avail: 16, percentage: 81 },
        ], [
          { x: 1, y: 0, size: 87, used: 71, avail: 16, percentage: 81 },
          { x: 1, y: 1, size: 87, used: 71, avail: 16, percentage: 81 },
        ]
      ]
    ],
  /****************************************************/
  /******************** countViable *******************/
    () => [
      countViable(getNodes(getLines('22.txt'))),
      892
    ],
    () => [
      countViable(getNodes(getLines('22-example.txt'))),
      5
    ],
  /****************************************************/
  /******************** parseLine *********************/
    () => [
      parseLine('/dev/grid/node-x0-y0     87T   71T    16T   81%'),
      { x: 0, y: 0, size: 87, used: 71, avail: 16, percentage: 81 },
    ],
  /****************************************************/
  /******************** viablePair ********************/
    () => [
      viablePair(
        { x: 0, y: 0, size: 0, used: 0, avail: 0, percentage: 0 },
        { x: 0, y: 0, size: 0, used: 0, avail: 0, percentage: 0 },
      ),
      false
    ],
    () => [
      viablePair(
        { x: 1, y: 0, size: 0, used: 0, avail: 0, percentage: 0 },
        { x: 0, y: 0, size: 0, used: 0, avail: 0, percentage: 0 },
      ),
      false
    ],
    () => [
      viablePair(
        { x: 1, y: 0, size: 0, used: 1, avail: 0,  percentage: 0 },
        { x: 0, y: 0, size: 0, used: 0, avail: 10, percentage: 0 },
      ),
      true
    ],
]


TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

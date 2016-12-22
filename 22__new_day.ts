// import * as XRegExp from 'xregexp'
import * as R from 'ramda'
import { cmp, p, getLines, range } from './utils'
import * as Chalk from 'chalk'

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

const buildGrid = (nodes: Node[]): Node[][] => {
  const numX = getDimension('x')(nodes)
  const numY = getDimension('y')(nodes)
  let grid = R.times(() => R.times(() => null, numY), numX)
  nodes.map(node => { grid[node.x][node.y] = node })
  return grid
}

const getNeighbors = (node: Node, grid: Node[][]): Node[] => {

}

const shortestPath = (grid: Node[][]): number => {

  return -1
}

const TESTS = [
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
  /****************************************************/
  /******************** _ *********************/
    () => [
      1,
      1,
    ],
]

TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

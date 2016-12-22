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
  R.test(/^.*/),
  lines,
).map(parseLine)

const TESTS = [
  /****************************************************/
  /******************** countViable *******************/
    () => [
      countViable(getNodes(getLines('22.txt'))),
      892
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

import * as R from 'ramda'
import { cmp, p, getLines } from './utils'
import * as Chalk from 'chalk'

const SHOW_LOGGING = true
const log = SHOW_LOGGING ? p : x => null
const range = (start, last) => R.range(start, last + 1)

const isContained = (ranges: number[][]) => (range: number[]) => {
  for (var i = 0; i < ranges.length; ++i) {
    const other = ranges[i]
    if (other[0] < range[0] && other[1] > range[1]) {
      return true
    }
  }
  return false
}

const lowestNotBlocked = (unparsedRanges: string[]) => {
  const ranges = R.sortBy(range => range[0], unparsedRanges.map(parseRange))

  for (var i = 0; i < ranges.length - 1; ++i) {
    if (ranges[i][1] + 1 < ranges[i + 1][0]) {
      return ranges[i][1] + 1
    }
  }
}

const countUnblocked = (unparsedRanges, topOfRange = 4294967295) => {
  const parsedRanges      = unparsedRanges.map(parseRange)
  const uncontainedRanges = R.filter(R.pipe(isContained(parsedRanges), R.not), parsedRanges)
  const ranges            = R.sortBy(range => range[0], uncontainedRanges)

  let numBlocked = 0
  let start      = ranges[0][0]
  let end        = ranges[0][1]

  for (var i = 1; i < ranges.length; ++i) {
    if (end < ranges[i][0]) {
      numBlocked += end - start + 1
      start = ranges[i][0]
    }
    end = ranges[i][1]
  }
  numBlocked += end - start + 1

  return topOfRange + 1 - numBlocked
}

const parseRange = (str: string): number[] =>
  R.map(parseInt, R.split('-', str))

const each = (list: any[], cb: Function): any => {
  for (var i = 0; i < list.length; ++i) {
    const val = cb(list[i])
    if (!!val) return val
  }
}

const TESTS = [
  /****************************************************/
  /******************** parseRange ********************/
  /****************************************************/
  () => [
    parseRange('5-8'),
    [5, 8]
  ],
  /****************************************************/
  /******************** lowestNotBlocked **************/
  /****************************************************/
  () => [
    lowestNotBlocked([
      '5-8',
      '0-2',
      '4-7',
    ]),
    3
  ],
  () => [
    lowestNotBlocked(getLines('20__new_day.txt')),
    19449262
  ],
  /****************************************************/
  /******************** countUnblocked ****************/
  /****************************************************/
  () => [
    countUnblocked([
      '5-8',
      '0-2',
      '4-7',
    ], 9),
    2
  ],
  () => [
    countUnblocked([
      '5-8',
      '0-2',
      '4-7',
    ], 10),
    3
  ],
  () => [
    countUnblocked([
      '5-8',
      '0-9',
      '4-7',
    ], 10),
    1
  ],
  () => [
    countUnblocked(getLines('20__new_day.txt')),
    119
  ],
  /****************************************************/
  /******************** isContained *******************/
  /****************************************************/
  () => [
    isContained([
      [1, 9],
      [3, 4],
    ])([3, 4]),
    true
  ],
  () => [
    isContained([
      [1, 2],
      [3, 4],
    ])([3, 4]),
    false
  ],
  () => [
    isContained([
      [1, 2],
      [3, 4],
    ])([3, 9]),
    false
  ],
  () => [
    each([1, 2, 3], v => { if (v == 2) return 2 }),
    2
  ]
]

TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})


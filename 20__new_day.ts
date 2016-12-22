import * as R from 'ramda'
import { cmp, p, getLines } from './utils'
import * as Chalk from 'chalk'

const SHOW_LOGGING = true
const log = SHOW_LOGGING ? p : x => null
const range = (start, last) => R.range(start, last + 1)

interface Range {
  start: number,
  end: number,
}

const isContained = (ranges: Range[]) => (range: Range) => {
  for (var i = 0; i < ranges.length; ++i) {
    const other = ranges[i]
    if (other.start < range.start && other.end > range.end) {
      return true
    }
  }
  return false
}

const notBlocked = (last: Range, curr: Range, resultSoFar: number|null) => (
  R.isNil(resultSoFar)
  && !R.isNil(last)
  && last.end + 1 < curr.start
)

const parseRange = (str: string): Range => {
  const [start, end] = R.map(parseInt, R.split('-', str))
  return { start, end }
}

const lowestNotBlocked = R.pipe(
  R.map(parseRange),
  R.sortBy(R.prop('start')),
  R.reduce(
    ({ last, result }: { last: Range, result: number }, curr: Range) => ({
      last: curr,
      result: notBlocked(last, curr, result) ? last.end + 1 : result
    }),
    { last: null, result: null },
  ),
  R.prop('result'),
)

const parseRangeOld = (str: string): number[] => (
  R.map(parseInt, R.split('-', str))
)

const countUnblocked = (unparsedRanges: string[], topOfRange: number = 4294967295) => {
  const ranges = R.pipe(
    R.map(parseRange),
    (parsedRanges: Range[]) => R.reject(isContained(parsedRanges), parsedRanges),
    R.sortBy(R.prop('start')),
  )(unparsedRanges)

  let numBlocked = 0
  let start      = ranges[0].start
  let end        = ranges[0].end

  for (var i = 1; i < ranges.length; ++i) {
    if (end < ranges[i].start) {
      numBlocked += end - start + 1
      start = ranges[i].start
    }
    end = ranges[i].end
  }
  numBlocked += end - start + 1

  return topOfRange + 1 - numBlocked
}

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
    { start: 5, end: 8 }
  ],
  () => [
    parseRangeOld('5-8'),
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
      { start: 1, end: 9 },
      { start: 3, end: 4 },
    ])({ start: 3, end: 4 }),
    true
  ],
  () => [
    isContained([
      { start: 1, end: 2 },
      { start: 3, end: 4 },
    ])({ start: 3, end: 4 }),
    false
  ],
  () => [
    isContained([
      { start: 1, end: 2 },
      { start: 3, end: 4 },
    ])({ start: 3, end: 9 }),
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

import * as R from 'ramda'
import { cmp, p, getLines } from './utils'
import * as Chalk from 'chalk'

const SHOW_LOGGING = true
const log = SHOW_LOGGING ? p : x => null

const decodeRepetition = (messages: string[], mostCommon = true): string =>
  R.pipe(
    // Combine messages into char lists by index
    R.map(R.split('')),
    R.transpose,
    // Count occurrences & return most common char in each list
    R.map(R.pipe(countChars, maxValueKey(mostCommon))),
    // Join results
    R.join('')
  )(messages)

const maxValueKey = (mostCommon = true) => (map): string =>
  R.pipe(
    R.keys,
    R.sortBy((k: string): any => map[k]),
    mostCommon ? R.reverse : R.identity,
  )(map)[0]

const countChars = (chars: string[]) => R.countBy(R.toLower)(chars)

const TESTS = [
  () => [
    countChars(['a', 'b', 'c', 'a']),
    { a: 2, b: 1, c: 1 },
  ],
  () => [
    maxValueKey()({ a: 1, b: 3, x: 2}),
    'b',
  ],
  () => [
    decodeRepetition(['aa', 'bb', 'ab']),
    'ab',
  ],
  () => [
    decodeRepetition(['aa', 'aa', 'aa', 'bb', 'ab']),
    'aa',
  ],
  () => [
    decodeRepetition(['ax', 'dx', 'dx', 'dd', 'dd', 'bb', 'ax']),
    'dx',
  ],
  () => [
    decodeRepetition([
      'eedadn',
      'drvtee',
      'eandsr',
      'raavrd',
      'atevrs',
      'tsrnev',
      'sdttsa',
      'rasrtv',
      'nssdts',
      'ntnada',
      'svetve',
      'tesnvt',
      'vntsnd',
      'vrdear',
      'dvrsen',
      'enarar',
    ]),
    'easter',
  ],
  () => [
    decodeRepetition(getLines('6__input.txt')),
    'qoclwvah',
  ],
  () => [
    decodeRepetition(getLines('6__input.txt'), false),
    'ryrgviuv',
  ],
]

TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

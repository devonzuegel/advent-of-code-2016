// import * as XRegExp from 'xregexp'
import { PriorityQueue } from './priority_queue'
import * as R from 'ramda'
import { cmp, p, getLines, range } from './utils'
import * as C from 'chalk'

const ______ = (lines: string[]): undefined =>
  undefined

const TESTS = [
  /******************** ______ **********************/
    () => [
      ______(getLines('23.txt')),
      undefined,
    ],
]

const OLD_TESTS = [
]

// R.concat(TESTS, OLD_TESTS).forEach(test => {
TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

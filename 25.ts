import * as R from 'ramda'
import * as C from 'chalk'
import { PriorityQueue } from './priority_queue'
import { cmp, getLines, p, range } from './utils'

const ____(lines: string[]) => undefined

const TESTS = [
    () => [
      ____(getLines('12.txt')),
      undefined,
    ],
]

const OLD_TESTS = [
]

R.concat(TESTS, OLD_TESTS).forEach(test => {
// TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})


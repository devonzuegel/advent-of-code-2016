import * as R from 'ramda'
import { cmp, getLines } from './utils'

/**
 * - generate grid from input
 * - Dijkstra's between each individual node
 * - return min of all possible combinations (if 012, then min of 0=>1/1=>2 or 0=2/2=>1)
 */

const ____ = (x) =>
  undefined

const TESTS = [
  /******************** ____ ************************/
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

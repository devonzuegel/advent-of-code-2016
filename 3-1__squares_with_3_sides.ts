import * as R from 'ramda'
import { cmp, getLines } from './utils'
import { possibleTriangle, numPossible, formatRow } from './3__squares_with_3_sides'

const getTriangles = R.map(
  R.pipe(
    formatRow,
    R.filter(R.pipe(R.equals(NaN), R.not))
  )
 )

const CHALLENGE_INPUT = getTriangles(getLines('3-1__squares_with_3_sides.txt'))

const TESTS = [
  [
    possibleTriangle([5, 10, 25]),
    false
  ], [
    possibleTriangle([5, 10, 12]),
    true
  ], [
    numPossible([
      [5, 10, 25],
      [5, 10, 12],
    ]),
    1
  ], [
    numPossible([
      [5, 10, 25],
      [5, 10, 12],
      [5, 10, 25],
      [5, 10, 12],
    ]),
    2
  ], [
    numPossible(CHALLENGE_INPUT),
    869
  ],
]

TESTS.map(test => cmp(test[0], test[1]))

import * as R from 'ramda'
import { cmp, getLines, p } from './utils'
import { possibleTriangle, numPossible, formatRow } from './3__squares_with_3_sides'

const getTriangles = R.pipe(
  R.map(
    R.pipe(
      formatRow,
      R.filter(R.pipe(R.equals(NaN), R.not))
    )
   ),
  R.transpose,
  R.flatten,
  R.splitEvery(3),
)

const CHALLENGE_INPUT = getTriangles(getLines('3-1__squares_with_3_sides.txt'))

const TESTS = [
  [
    numPossible(CHALLENGE_INPUT),
    1544,
  ],
]

TESTS.map(test => cmp(test[0], test[1]))

import * as R from 'ramda'
import { cmp, getLines } from './utils'
import {
  possibleTriangle,
  numPossible,
} from './3__squares_with_3_sides'

const getTrianglesFromFile = (filename: string): number[][] =>
  R.splitEvery(
    3,
    R.flatten(
      R.transpose(getLines(filename).map(line =>
        R.filter(
          R.pipe(R.equals(NaN), R.not),
          line
            .trim()
            .split(/\s+/)
            .map(s => parseInt(s, 10))
          )
        )
      )
    )
  )

const CHALLENGE_INPUT = getTrianglesFromFile('3-1__squares_with_3_sides.txt')

const TESTS = [
  [
    numPossible(CHALLENGE_INPUT),
    1544,
  ],
]

TESTS.map(test => cmp(test[0], test[1]))

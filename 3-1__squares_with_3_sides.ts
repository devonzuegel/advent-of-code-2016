import * as R from 'ramda'
import { cmp, getLines } from './utils'
import {
  possibleTriangle,
  numPossible,
} from './3__squares_with_3_sides'

const getTrianglesFromFile = (filename: string): number[][] =>
  getLines(filename).map(line =>
    line
      .trim()
      .split(/\s+/)
      .map(s => parseInt(s, 10))
  )

const CHALLENGE_INPUT = getTrianglesFromFile('3-1__squares_with_3_sides.txt')

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

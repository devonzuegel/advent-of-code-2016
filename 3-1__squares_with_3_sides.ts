/// <reference path="typings/globals/node/index.d.ts" />
import * as R from 'ramda'
import * as fs from 'fs'
import { cmp } from './test_utils'

const getTrianglesFromFile = (filename: string): number[][] =>
  fs
    .readFileSync(filename, 'utf8')
    .toString().split("\n")
    .map(l => l.trim().split(/\s+/).map(s => parseInt(s, 10)))

const CHALLENGE_INPUT = getTrianglesFromFile('3-1__squares_with_3_sides.txt')

const possibleTriangle = (sides: number[]): boolean =>
  sides[0] < sides[1] + sides[2] &&
  sides[1] < sides[0] + sides[2] &&
  sides[2] < sides[1] + sides[0]

const numPossible = (triangles: number[][]): number => {
  console.log(R.filter(R.identity, triangles.map(possibleTriangle)).length)
  return R.filter(R.identity, triangles.map(possibleTriangle)).length
}

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

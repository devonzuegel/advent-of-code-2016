import * as R from 'ramda'
import { cmp } from './utils'

export const possibleTriangle = (sides: number[]): boolean =>
  sides[0] < sides[1] + sides[2] &&
  sides[1] < sides[0] + sides[2] &&
  sides[2] < sides[1] + sides[0]

export const numPossible = (triangles: number[][]): number =>
  R.filter(R.identity, triangles.map(possibleTriangle)).length

export const formatRow = R.pipe(
  R.trim,
  R.split(/\s+/),
  R.map((s: string) => parseInt(s, 10))
)

import * as R from 'ramda'
import { cmp } from './utils'

export const possibleTriangle = (sides: number[]): boolean =>
  sides[0] < sides[1] + sides[2] &&
  sides[1] < sides[0] + sides[2] &&
  sides[2] < sides[1] + sides[0]

export const numPossible = (triangles: number[][]): number =>
  R.filter(R.identity, triangles.map(possibleTriangle)).length

import * as R from 'ramda'
import { cmp, getLines, p } from './utils'
import { Md5 } from 'ts-md5/dist/md5'

export const beginsWith5Zeros = hashed => {
  const match = R.match(/^00000.*/g, hashed)
  return R.pipe(R.isEmpty, R.not)(match)
}

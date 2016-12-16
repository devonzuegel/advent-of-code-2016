import * as R from 'ramda'
import { cmp, getLines, p } from './utils'
import { Md5 } from 'ts-md5/dist/md5'

const beginsWith5Zeros = hashed => {
  const match = R.match(/^00000.*/g, hashed)
  return R.pipe(R.isEmpty, R.not)(match)
}
const calculatePassword = (doorID: string): string => {
  let passwordSoFar = ''
  let i = 0

  while (passwordSoFar.length < 8) {
    const str = `${doorID}${i}`
    const hashed = String(Md5.hashStr(str))

    if (beginsWith5Zeros(hashed)) {
      passwordSoFar = `${passwordSoFar}${hashed[5]}`
    }
    i += 1
  }
  return passwordSoFar
}

const TESTS = [
  [
    calculatePassword('abc'),
    '18f47a30'
  ], [
    calculatePassword('wtnhxymk'),
    '2414bc77'
  ],
]

TESTS.map(test => cmp(test[0], test[1]))

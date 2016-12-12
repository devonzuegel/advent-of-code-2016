import * as R from 'ramda'
import { cmp, getLines, p } from './utils'
import {
  invalidRoomNameFormat,
  sortByCountsAndAlpha,
  sortKeysByCountsAndAlpha,
  getAlphaCounts,
  isReal,
  getSectorID,
} from './4__security_thru_obscurity'

const AlPHABET = R.split('', 'abcdefghijklmnopqrstuvwxyz')

const decryptChar = (shift: number) => (char: string) => {
  if (char === '-') {
    return ' '
  }
  const newIndex = R.mathMod(
    R.indexOf(char, AlPHABET) + shift,
    AlPHABET.length
  )
  return AlPHABET[newIndex]
}

const decrypt = (input: string): string => {
  if (invalidRoomNameFormat(input)) {
    throw Error(`Invalid room name format: ${input}`)
  }

  const [encrypted, rest] = R.split(/\-\d+/g, input)
  const sectorID = parseInt(R.match(/\d+/g, input)[0])

  return R.pipe(
    R.split(''),
    R.map(decryptChar(sectorID)),
    R.join(''),
  )(encrypted)
}

const LINES = getLines('4-1__security_thru_obscurity.txt')

const TESTS = [
  [
    decrypt('qzmt-zixmtkozy-ivhz-343[zimth]'),
    'very encrypted name',
  ], [
    R.filter(
      R.pipe(
        R.match(/.*pole.*/g),
        R.isEmpty,
        R.not
      ),
      R.map(decrypt, R.filter(isReal, LINES))
    )[0],
    'northpole object storage'
  ], [
    getSectorID(LINES[
      R.indexOf(
        'northpole object storage',
        R.map(decrypt, LINES)
      )
    ]),
    984
  ]
]

TESTS.map(test => cmp(test[0], test[1]))

import * as R from 'ramda'
import { cmp, p, insertAt } from './utils'
import { Md5 }  from 'ts-md5/dist/md5'
import { beginsWith5Zeros } from './5__game_of_chess'
import * as Chalk from 'chalk'

const POSITION_INDEX  = 5
const PASSWORD_LENGTH = 8
const SHOW_LOGGING    = true

const log = (str: string) => {
  if (SHOW_LOGGING) {
    p(str)
  }
}

const valid_hash_position = (position: number, passwordSoFar: string) => {
  const char = passwordSoFar[position]
  const res  = position < PASSWORD_LENGTH && char === '_'

  const colorize = (str: string) => log(res ? Chalk.green(str) : Chalk.gray(str))
  colorize(`
    passwordSoFar = ${passwordSoFar}
    ${position} + ${POSITION_INDEX} < ${PASSWORD_LENGTH} = ${position < PASSWORD_LENGTH}
    passwordSoFar[${position}] = ${char} = ${char === '_'}
  `)

  return res
}

const calculatePassword = (doorID: string): string => {
  let passwordSoFar    = R.join('', R.repeat('_', PASSWORD_LENGTH))
  let i                = 0
  let num_chars_filled = 0

  while (num_chars_filled < PASSWORD_LENGTH) {
    const str    = `${doorID}${i}`
    const hashed = String(Md5.hashStr(str))

    if (beginsWith5Zeros(hashed)) {
      const position = parseInt(hashed[POSITION_INDEX])

      log(`\nInteresting: ${i}`)

      if (valid_hash_position(position, passwordSoFar)) {
        passwordSoFar = insertAt(passwordSoFar, position, hashed[POSITION_INDEX + 1])
        num_chars_filled += 1
        log(passwordSoFar)
      }
    }
    i += 1
  }
  return passwordSoFar
}

const TESTS = [
  [
    valid_hash_position(1, '_1_'),
    false
  ], [
    valid_hash_position(1, '___'),
    true
  ], [
    calculatePassword('abc'),
    '05ace8e3'
  ], [
    insertAt('___', 1, 'x'),
    '_x_'
  ], [
    calculatePassword('wtnhxymk'),
    '437e60fc'
  ],
]

TESTS.forEach(test => cmp(test[0], test[1]))

import * as R from 'ramda'
import { cmp, p, insertAt } from './utils'
import { Md5 }  from 'ts-md5/dist/md5'
// import { beginsWith5Zeros } from './5__game_of_chess'
import * as Chalk from 'chalk'

const SHOW_LOGGING = true
const log = SHOW_LOGGING ? p : x => null

const whichElfBruteForce = (elves) => {
  let remainingElves = elves
  let i = 0

  while (remainingElves.length > 1) {
    log(remainingElves)
    const curr = remainingElves[i]
    const next = remainingElves[i = (i + 1) % remainingElves.length]
    remainingElves = R.filter(R.pipe(R.equals(next), R.not), remainingElves)
  }
  log(remainingElves)
  return remainingElves[0]
}

const isEvenIndex = e => e.index % 2 === 0

const whichElf = (elves) => {
  let remainingElves = elves.map((e, i) => ({ elf: e, index: i}))
  let removeEvens = false

  while (remainingElves.length > 1) {
    log(remainingElves.map(e => e.elf))
    const filter = R.pipe(isEvenIndex, removeEvens ? R.not : R.identity)
    removeEvens = filter(remainingElves[remainingElves.length - 1])
    remainingElves =
      R
        .filter(filter, remainingElves)
        .map(({ elf, _ }, i) => ({ elf, index: i }))

  }
  log(remainingElves.map(e => e.elf))
  return remainingElves[0].elf
}

const range = (start, last) => R.range(start, last + 1)

const TESTS = [
  () => [
    whichElf(range(1, 3)),
    3
  ],
  () => [
    whichElf(range(1, 4)),
    1
  ],
  () => [
    whichElf(range(1, 5)),
    3
  ],
  () => [
    whichElf(range(1, 6)),
    5
  ],
  () => [
    whichElf(range(1, 12)),
    9
  ],
  () => [
    whichElf(range(1, 2)),
    1
  ],
  () => [
    whichElf(range(1, 7)),
    7
  ],
  () => [
    whichElf(range(1, 3001330)),
    1808357
  ],
]

TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

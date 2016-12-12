import * as R from 'ramda'
import { cmp, getLines, p } from './utils'

const invalidRoomNameFormat = (input: string): boolean =>
  R.isEmpty(R.match(
    /^[0-9a-z\-]*\[(.*)\]$/g,
    input
  ))

const sortByCountsAndAlpha = (counts) => (a: any, b: any): number => {
  if (a.length !== 1) throw Error(`${a} is not a character`)
  if (b.length !== 1) throw Error(`${b} is not a character`)

  if (counts[a] > counts[b]) return -1
  if (counts[a] < counts[b]) return 1

  if (a < b)  return -1
  if (a == b) return 0
  if (a > b)  return 1
}

const sortKeysByCountsAndAlpha = counts =>
  R.sort(sortByCountsAndAlpha(counts), R.keys(counts))

const getAlphaCounts = (encrypted: string) =>
  R.countBy(
    R.toLower,
    R.filter(
      R.pipe(R.match(/[a-z]/g), R.isEmpty, R.not),
      encrypted.split('')
    )
  )
const isReal = (input: string): boolean => {
  if (invalidRoomNameFormat(input)) {
    return false
  }
  const [encrypted, checksum, _] = R.split(/[\[\]]/g, input)
  const charCounts = getAlphaCounts(encrypted)
  const correctChecksum = R.take(5, sortKeysByCountsAndAlpha(charCounts)).join('')

  return correctChecksum === checksum
}

const getSectorID = (input: string): number =>
  parseInt(R.match(/\d+/g, input)[0])

const summedRealSectorIDs = (list: string[]) =>
  R.sum(R.map(getSectorID, R.filter(isReal, list)))

const TESTS = [
  [
    sortKeysByCountsAndAlpha({ a: 1, b: 2, c: 1 }),
    ['b', 'a', 'c']
  ], [
    sortKeysByCountsAndAlpha({ a: 1, b: 1, c: 1 }),
    ['a', 'b', 'c']
  ], [
    isReal('aaaaa-bbb-z-y-x-123'),
    false,
  ], [
    isReal('aaaaa-bbb-z-y-x-123[abxyz]'),
    true,
  ], [
    isReal('a-b-c-d-e-f-g-h-987[abcde]'),
    true,
  ], [
    isReal('not-a-real-room-404[oarel]'),
    true,
  ], [
    isReal('totally-real-room-200[decoy]'),
    false,
  ], [
    getSectorID('totally-real-room-200[decoy]'),
    200
  ], [
    getSectorID('a-b-c-d-e-f-g-h-987[abcde]'),
    987
  ], [
    summedRealSectorIDs([
      'aaaaa-bbb-z-y-x-123[abxyz]',
      'a-b-c-d-e-f-g-h-987[abcde]',
      'not-a-real-room-404[oarel]',
      'totally-real-room-200[decoy]',
     ]),
    1514
  ], [
    summedRealSectorIDs(getLines('4-1__security_thru_obscurity.txt')),
    185371
  ]
]

TESTS.map(test => cmp(test[0], test[1]))

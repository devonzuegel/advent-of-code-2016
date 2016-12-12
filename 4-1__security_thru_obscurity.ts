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

const sumRealSectorIDs = R.pipe(
  R.filter(isReal),
  R.map(getSectorID),
  R.sum,
)

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
    isReal('qzmt-zixmtkozy-ivhz-343[zimth]'),
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
    sumRealSectorIDs([
      'aaaaa-bbb-z-y-x-123[abxyz]',
      'a-b-c-d-e-f-g-h-987[abcde]',
      'not-a-real-room-404[oarel]',
      'totally-real-room-200[decoy]',
     ]),
    1514
  ], [
    sumRealSectorIDs(getLines('4-1__security_thru_obscurity.txt')),
    185371
  ]
]

TESTS.map(test => cmp(test[0], test[1]))

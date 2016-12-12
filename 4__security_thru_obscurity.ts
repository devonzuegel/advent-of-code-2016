import * as R from 'ramda'

export const invalidRoomNameFormat = (input: string): boolean =>
  R.isEmpty(R.match(
    /^[0-9a-z\-]*\[(.*)\]$/g,
    input
  ))

export const sortByCountsAndAlpha = (counts) => (a: any, b: any): number => {
  if (a.length !== 1) throw Error(`${a} is not a character`)
  if (b.length !== 1) throw Error(`${b} is not a character`)

  if (counts[a] > counts[b]) return -1
  if (counts[a] < counts[b]) return 1

  if (a < b)  return -1
  if (a == b) return 0
  if (a > b)  return 1
}

export const sortKeysByCountsAndAlpha = counts =>
  R.sort(sortByCountsAndAlpha(counts), R.keys(counts))

export const getAlphaCounts = (encrypted: string) =>
  R.countBy(
    R.toLower,
    R.filter(
      R.pipe(R.match(/[a-z]/g), R.isEmpty, R.not),
      encrypted.split('')
    )
  )

export const isReal = (input: string): boolean => {
  if (invalidRoomNameFormat(input)) {
    return false
  }
  const [encrypted, checksum, _] = R.split(/[\[\]]/g, input)
  const charCounts = getAlphaCounts(encrypted)
  const correctChecksum = R.take(5, sortKeysByCountsAndAlpha(charCounts)).join('')

  return correctChecksum === checksum
}

export const getSectorID = (input: string): number =>
  parseInt(R.match(/\d+/g, input)[0])

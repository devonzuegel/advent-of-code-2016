import * as R from 'ramda'
import { cmp, p, getLines } from './utils'
import * as Chalk from 'chalk'

const SHOW_LOGGING = false
const log = SHOW_LOGGING ? p : x => null

const swapIndices = (j: number, k: number) => (str: string): string =>
  R.join('', R.split('', str).map((char, i) => {
    if (i === j) return str[k]
    if (i === k) return str[j]
    return char
  }))

const swapXY = (x: string, y: string) => (str: string): string =>
  R.join('', R.split('', str).map((char) => {
    if (char === x) return y
    if (char === y) return x
    return char
  }))

const rotateRight = (n: number) => (str: string) => {
  const mod = R.mathMod(n, str.length)
  const split = R.split('', str)
  const res = R.join('', R.concat(R.takeLast(mod, split), R.take(str.length - mod, split)))
  if (res.length !== str.length) throw Error(`res.length !== str.length  =>  ${res.length} !== ${str.length}`)
  return res
}

const rotateLeft = (n: number) => (str: string) => {
  const mod = R.mathMod(n, str.length)
  const split = R.split('', str)
  const res = R.join('', R.concat(R.takeLast(str.length - mod, split), R.take(mod, split)))
  return res
}

const rotateAroundX = (char: string) => (str: string) => {
  const indexOfX = R.indexOf(char, R.split('', str))
  const n = indexOfX + 1 + (indexOfX < 4 ? 0 : 1)
  return rotateRight(n)(str)
}

const reversePositions = (x: number, y: number) => (str: string): string =>
  R.join('', R.split('', str).map((char, i) => {
    if (i >= x && i <= y) {
      return str[x + (y - i)]
    }
    return char
  }))

const movePosXToPosY = (x: number, y: number) => (str: string): string => {
  const split = R.split('', str)
  const firstHalf  = R.take(x, split)
  const secondHalf = R.takeLast(str.length - x - 1, split)
  const flattened = R.concat(firstHalf, secondHalf)
  return R.join('', R.insert(y, str[x], flattened))
}

const extractNums = (str: string): number[] =>
  R.map(parseInt, R.match(/\d+/g, str))

const parseLines = (txtFile: string): Function[] =>
  getLines(txtFile).map(line => {
    const nums = extractNums(line)

    if (R.test(/^swap position/, line)) {
      return swapIndices(nums[0], nums[1])
    }

    if (R.test(/^swap letter/, line)) {
      const x = line['swap letter '.length]
      const y = line['swap letter d with letter '.length]
      return swapXY(x, y)
    }

    if (R.test(/^reverse positions/, line)) {
      return reversePositions(nums[0], nums[1])
    }

    if (R.test(/^rotate right/, line)) {
      return rotateRight(nums[0])
    }

    if (R.test(/^rotate left/, line)) {
      return rotateLeft(nums[0])
    }

    if (R.test(/^move position/, line)) {
      return movePosXToPosY(nums[0], nums[1])
    }

    if (R.test(/^rotate based on position of letter/, line)) {
      const char = line['rotate based on position of letter '.length]
      return rotateAroundX(char)
    }

    throw Error(`The following line does not match a regex: "${line}"`)
  })

const scramble = (txtFile: string, input: string): string =>
  parseLines(txtFile).reduce((acc, step) => step(acc), input)

const TESTS = [
  /****************************************************/
  /******************** swapIndices *******************/
  /****************************************************/
  () => [
    swapIndices(1, 2)('abcde'),
    'acbde'
  ],
  /****************************************************/
  /******************** swapXY ************************/
  /****************************************************/
  () => [
    swapXY('x', 'y')('abcdexy'),
    'abcdeyx'
  ],
  /****************************************************/
  /******************** rotateRight *******************/
  /****************************************************/
  () => [
    rotateRight(1)('abcd'),
    'dabc'
  ],
  /****************************************************/
  /******************** rotateLeft ********************/
  /****************************************************/
  () => [
    rotateLeft(1)('abcd'),
    'bcda'
  ],
  /****************************************************/
  /******************** rotateAroundX *****************/
  /****************************************************/
  () => [
    rotateAroundX('b')('abdec'),
    'ecabd'
  ],
  /****************************************************/
  /******************** reversePositions **************/
  /****************************************************/
  () => [
    reversePositions(1, 3)('12345'),
    '14325'
  ],
  /****************************************************/
  /******************** movePosXToPosY ****************/
  /****************************************************/
  () => [
    movePosXToPosY(1, 3)('12345'),
    '13425'
  ],
  () => [
    movePosXToPosY(1, 4)('bcdea'),
    'bdeac'
  ],
  () => [
    movePosXToPosY(3, 0)('bdeac'),
    'abdec'
  ],
  /****************************************************/
  /******************** extractNums *******************/
  /****************************************************/
  () => [
    extractNums('reverse positions 100 through 4'),
    [100, 4]
  ],
  /****************************************************/
  /******************** scramble **********************/
  /****************************************************/
  () => [
    scramble('21__example.txt', 'abcde'),
    'decab'
  ],
  /****************************************************/
  /******************** JOHN'S CHALLENGE **************/
  /****************************************************/
  () => [
    scramble('21__john-challenge.txt', 'abcdefgh'),
    'agcebfdh'
  ],
  /****************************************************/
  /******************** CHALLENGE *********************/
  /****************************************************/
  () => [
    scramble('21__challenge.txt', 'abcdefgh'),
    'bfheacgd'
  ],
]

TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

// import * as XRegExp from 'xregexp'
import { PriorityQueue } from './priority_queue'
import * as R from 'ramda'
import { cmp, p, getLines, range } from './utils'
import * as C from 'chalk'

enum StepType { cpy, inc, dec, jnz }

interface Registers {
  readonly a: number,
  readonly b: number,
  readonly c: number,
  readonly d: number,
}

interface Step {
  readonly type: StepType,
  readonly fn:   Function,
}

const INITIAL_REGISTERS: Registers = { a: 0, b: 0, c: 0, d: 0 }

const cpy = (x: number, r: string) => (registers: Registers): Registers =>
  R.merge(registers, { [r]: x })

const inc = (r: string) => (registers: Registers): Registers =>
  R.merge(  // merge forces Registers type
    registers,
    R.evolve({ [r]: R.inc }, registers),
  )

const dec = (r: string) => (registers: Registers): Registers =>
  R.merge(  // merge forces Registers type
    registers,
    R.evolve({ [r]: R.dec }, registers),
  )

const jnz = (r: string, x: number) => (registers: Registers): number => {
  if (registers[r] === 0) {
    return 0
  }
  return x
}

const runInstructions = (instructions: Step[]): Registers => {
  let index: number        = 0
  let registers: Registers = INITIAL_REGISTERS

  while (index < instructions.length) {
    const step = instructions[index]

    if (step.type === StepType.jnz) {
      index += step.fn(registers)
      continue
    }
    registers = step.fn(registers)
    index++
  }

  return registers
}

const extractNums = (str: string): number[] =>
  R.map(parseInt, R.match(/\d+/g, str))

const parseCpy = (line: string): Function => {
  const nums: number[] = extractNums(line)

  if (R.isEmpty(nums)) {
    const r = R.pipe(R.takeLast(3), R.head)(line)
    return cpy(null, R.last(line))
  }

  return cpy(R.head(nums), R.last(line))
}

const parseJnz = (line: string, registers: Registers): Function => {
  const nums: number[] = extractNums(line)
  const r = R.pipe(R.takeLast(3), R.head)(line)
  return jnz(r, R.head(nums))
}

const parseInstruction = (line: string): Step => {
  if (R.test(/^cpy .*/, line)) {
    return {
      fn:   parseCpy(line),
      type: StepType.cpy,
    }
  }

  if (R.test(/^inc .*/, line)) {
    return {
      fn:   inc(R.last(line)),
      type: StepType.inc,
    }
  }

  if (R.test(/^dec .*/, line)) {
    return {
      fn:   dec(R.last(line)),
      type: StepType.dec,
    }
  }

  if (R.test(/^jnz .*/, line)) {
    return {
      fn:   dec(R.last(line)),
      type: StepType.jnz,
    }
  }
}

const TESTS = [
  /******************** parseInstruction *************************/
    () => [
      parseInstruction('cpy 41 a'),
      { type: StepType.cpy },
    ],
    () => [
      parseInstruction('inc a'),
      { type: StepType.inc },
    ],
    () => [
      parseInstruction('dec a'),
      { type: StepType.dec },
    ],
    () => [
      parseInstruction('jnz 41 a'),
      { type: StepType.jnz },
    ],
  /******************** runInstructions *************************/
    () => [
      runInstructions([
        { fn: cpy(41, 'a'), type: StepType.cpy },
        { fn: inc('a'),     type: StepType.inc },
        { fn: inc('a'),     type: StepType.inc },
        { fn: dec('a'),     type: StepType.dec },
      ]),
      { a: 42, b: 0, c: 0, d: 0 },
    ],
    () => [
      runInstructions([
        { fn: cpy(41, 'a'), type: StepType.cpy },
        { fn: inc('a'),     type: StepType.inc },
        { fn: inc('a'),     type: StepType.inc },
        { fn: dec('a'),     type: StepType.dec },
        { fn: jnz('2', 2),  type: StepType.jnz },
        { fn: dec('a'),     type: StepType.dec },
      ]),
      { a: 42, b: 0, c: 0, d: 0 },
    ],
    () => [
      runInstructions([
        { fn: cpy(41, 'a'), type: StepType.cpy },
        { fn: inc('a'),     type: StepType.inc },
        { fn: inc('a'),     type: StepType.inc },
        { fn: dec('a'),     type: StepType.dec },
        { fn: jnz('2', 2),  type: StepType.jnz },
        { fn: dec('a'),     type: StepType.dec },
        { fn: dec('a'),     type: StepType.dec },
      ]),
      { a: 41, b: 0, c: 0, d: 0 },
    ],
  /******************** cpy *************************/
    () => [
      cpy(1, 'a')(INITIAL_REGISTERS),
      { a: 1, b: 0, c: 0, d: 0 },
    ],
    () => [
      cpy(234, 'a')(INITIAL_REGISTERS),
      { a: 234, b: 0, c: 0, d: 0 },
    ],
  /******************** inc *************************/
    () => [
      inc('a')(INITIAL_REGISTERS),
      { a: 1, b: 0, c: 0, d: 0 },
    ],
    () => [
      inc('c')({ a: 1, b: 0, c: 1, d: 234 }),
      { a: 1, b: 0, c: 2, d: 234 },
    ],
  /******************** dec *************************/
    () => [
      dec('a')(INITIAL_REGISTERS),
      { a: -1, b: 0, c: 0, d: 0 },
    ],
    () => [
      dec('c')({ a: 1, b: 0, c: 1, d: 234 }),
      { a: 1, b: 0, c: 0, d: 234 },
    ],
  // /******************** ______ **********************/
  //   () => [
  //     ______(getLines('23.txt')),
  //     undefined,
  //   ],
]

const OLD_TESTS = [
]

// R.concat(TESTS, OLD_TESTS).forEach(test => {
TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

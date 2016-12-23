// import * as XRegExp from 'xregexp'
import { PriorityQueue } from './priority_queue'
import * as R from 'ramda'
import { cmp, p, getLines, range } from './utils'
import * as C from 'chalk'

const SHOW_LOGGING = false
const log = SHOW_LOGGING ? p : x => null

enum StepType { cpy, inc, dec, jnz }
const StepTypes = {
  [StepType.cpy]: 'cpy',
  [StepType.inc]: 'inc',
  [StepType.dec]: 'dec',
  [StepType.jnz]: 'jnz',
}

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

const cpy = (x: number|string, r: string) => (registers: Registers): Registers => {
  log(C.gray(`x: ${C.yellow(`${x}`)}, r: ${C.yellow(r)}`))
  const val: number = (typeof x === 'string') ? registers[x] : x
  return R.merge(registers, { [r]: val })
}

const inc = (r: string) => (registers: Registers): Registers => {
  log(C.gray(`r: ${C.yellow(r)}`))
  return R.merge(  // merge forces Registers type
    registers,
    R.evolve({ [r]: R.inc }, registers),
  )
}

const dec = (r: string) => (registers: Registers): Registers => {
  log(C.gray(`r: ${C.yellow(r)}`))
  return R.merge(  // merge forces Registers type
    registers,
    R.evolve({ [r]: R.dec }, registers),
  )
}

const jnz = (x: string|number, y: number) => (registers: Registers): number => {
  log(C.red(`JUMPING! => ${typeof x}`))
  const val: number = (typeof x === 'string') ? registers[x] : x
  if (val === 0) log(C.red('Oh wait, never mind'))

  log(C.gray(`val: ${C.yellow(`${val}`)}, x: ${C.yellow(`${x}`)}, y: ${C.yellow(`${y}`)}`))
  if (val === 0) {
    return 1
  }

  return y
}

const runInstructions = (instructions: Step[]): Registers => {
  let index: number        = 0
  let registers: Registers = INITIAL_REGISTERS
  let total = 0

  log(C.gray(C.blue(`)0  start => ${C.white(JSON.stringify(registers))}`)))
  while (index < instructions.length) {
    const step = instructions[index]

    if (step.type === StepType.jnz) {
      index += step.fn(registers)
    } else {
      registers = step.fn(registers)
      index++
    }
    total++

    log(C.gray(`${C.blue(`${index}`)}  ${StepTypes[step.type]}   => ${C.white(JSON.stringify(registers))}`))
  }

  return registers
}

const extractNums = (str: string): number[] =>
  R.pipe(
    R.split(' '),
    R.map(parseInt),
    R.reject(R.identical(NaN)),
  )(str)

const parseCpy = (line: string): Function => {
  const nums: number[] = extractNums(line)

  if (R.isEmpty(nums)) {
    const r = R.pipe(R.takeLast(3), R.head)(line)
    return cpy(r, R.last(line))
  }

  return cpy(R.head(nums), R.last(line))
}

const parseJnz = (line: string): Function => {
  const nums: number[] = extractNums(line)
  if (nums.length > 1) {
    return jnz(R.head(nums), R.last(nums))
  }
  const r: string = line[4]
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
      fn:   parseJnz(line),
      type: StepType.jnz,
    }
  }
}

const TESTS = [
  /******************** composed solution ************************/
    () => [
      runInstructions(R.map(parseInstruction, getLines('12.txt'))),
      { a: 318117, b: 196418, c: 0, d: 0},
    ],
    () => [
      runInstructions(R.map(parseInstruction, getLines('12_example.txt'))),
      { a: 42, b: 0, c: 0, d: 0 },
    ],
]

const OLD_TESTS = [
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
      cpy('c', 'a')({ a: 234, b: 3, c: 4, d: 5 }),
      { a: 4, b: 3, c: 4, d: 5 },
    ],
    () => [
      cpy('b', 'a')(INITIAL_REGISTERS),
      { a: 0, b: 0, c: 0, d: 0 },
    ],
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
]

R.concat(TESTS, OLD_TESTS).forEach(test => {
// TESTS.forEach(test => {
  const res = test()
  cmp(res[0], res[1])
})

import * as Chalk from 'chalk'

export const TAB_SIZE = 0

export const p = console.log;

export const cmp = (given: any, expected: any) => {
  const givenToS = JSON.stringify(given, null, TAB_SIZE)
  const expectedToS = JSON.stringify(expected, null, TAB_SIZE)
  if (givenToS === expectedToS) {
    p(Chalk.green('SUCCESS'))
  } else {
    p(Chalk.red.bold('FAILURE'))
    p(Chalk.gray(`Expected: ${expectedToS}`))
    p(Chalk.gray(`Received: ${givenToS}`))
  }
  p('')
}

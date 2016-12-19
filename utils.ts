/// <reference path="typings/globals/node/index.d.ts" />
import * as fs from 'fs'
import * as R from 'ramda'
import * as Chalk from 'chalk'

export const TAB_SIZE = 0

export const p = console.log

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

export const getLines = (filename: string): string[] =>
  R.filter(R.pipe(R.isEmpty, R.not), fs
    .readFileSync(filename, 'utf8')
    .toString().split("\n")
  )

export const insertAt = (str: string, i: number, replaceWith: string) =>
  `${str.substr(0, i)}${replaceWith}${str.substr(i + replaceWith.length)}`


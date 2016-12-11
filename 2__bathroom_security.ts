import * as R from 'ramda'

const charToDirection = (char: string) => {
  switch (char) {
    case 'U':  return { x: 0,  y: 1  }
    case 'R':  return { x: 1,  y: 0  }
    case 'D':  return { x: 0,  y: -1 }
    case 'L':  return { x: -1, y: 0  }
    default:   throw Error('Invalid direction')
  }
}

export const EXAMPLE_INPUT = [
  'ULL',
  'RRDDD',
  'LURDL',
  'UUUUD',
]

export interface Location {
  x: number,
  y: number,
}

export const getSteps = (input: string[]): string[] =>
  input.reduce(
    (soFar, step) => soFar.concat(step.split('')),
    []
   )

export const getLocations = (steps: string[], initialLoc: Location, onBoard: Function): Location[] =>
  steps.reduce(
    (soFar, char) => {
      const currLoc   = soFar[soFar.length - 1]
      const direction = charToDirection(char)
      const newLoc    = {
        x: currLoc.x + direction.x,
        y: currLoc.y + direction.y,
      }
      return soFar.concat([onBoard(newLoc) ? newLoc : currLoc])
    },
    [initialLoc]
  )

export const getDigitIndices = (input: string[]): number[] =>
  input.reduce(
    (soFar, line) => [...soFar, (soFar[soFar.length - 1] || 0) + line.length],
    []
   )

export const instructionsToPassword = (input: string[], coordinateToNum: Function, initialLoc: Location, onBoard: Function): string => {
  const locations     = getLocations(getSteps(input), initialLoc, onBoard)
  const passwordChars = getDigitIndices(input).map(i => coordinateToNum(locations[i]))
  return passwordChars.join('')
}

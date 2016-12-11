import * as R from 'ramda'

export const EXAMPLE_INPUT = [
  'ULL',
  'RRDDD',
  'LURDL',
  'UUUUD',
]

const charToDirection = (char: string) => {
  switch (char) {
    case 'U':  return { x: 0,  y: 1  }
    case 'R':  return { x: 1,  y: 0  }
    case 'D':  return { x: 0,  y: -1 }
    case 'L':  return { x: -1, y: 0  }
    default:   throw Error('Invalid direction')
  }
}

export const getSteps = input =>
  input.reduce(
    (soFar, step) => soFar.concat(step.split('')),
    []
   )

export const getLocations = (steps, initialLoc, onBoard) =>
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

export const getDigitIndices = input =>
  input.reduce(
    (soFar, line) => [...soFar, (soFar[soFar.length - 1] || 0) + line.length],
    []
   )

export const instructionsToPassword = (input, coordinateToNum, initialLoc, onBoard) => {
  const locations = getLocations(getSteps(input), initialLoc, onBoard)
  const digits = getDigitIndices(input).map(i => coordinateToNum(locations[i]))
  return digits.join('')
}

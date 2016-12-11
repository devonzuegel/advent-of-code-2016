import { cmp, p } from './test_utils'
import * as R from 'ramda'

const EXAMPLE_INPUT = [
  'ULL',
  'RRDDD',
  'LURDL',
  'UUUUD',
]

const CHALLENGE_INPUT = [
  'LRRLLLRDRURUDLRDDURULRULLDLRRLRLDULUDDDDLLRRLDUUDULDRURRLDULRRULDLRDUDLRLLLULDUURRRRURURULURRULRURDLULURDRDURDRLRRUUDRULLLLLDRULDDLLRDLURRLDUURDLRLUDLDUDLURLRLDRLUDUULRRRUUULLRDURUDRUDRDRLLDLDDDLDLRRULDUUDULRUDDRLLURDDRLDDUDLLLLULRDDUDDUUULRULUULRLLDULUDLLLLURRLDLUDLDDLDRLRRDRDUDDDLLLLLRRLLRLUDLULLDLDDRRUDDRLRDDURRDULLLURLRDLRRLRDLDURLDDULLLDRRURDULUDUDLLLDDDLLRLDDDLLRRLLURUULULDDDUDULUUURRUUDLDULULDRDDLURURDLDLULDUDUDDDDD',
  'RUURUDRDUULRDDLRLLLULLDDUDRDURDLRUULLLLUDUDRRUDUULRRUUDDURDDDLLLLRRUURULULLUDDLRDUDULRURRDRDLDLDUULUULUDDLUDRLULRUDRDDDLRRUUDRRLULUULDULDDLRLURDRLURRRRULDDRLDLLLRULLDURRLUDULDRDUDRLRLULRURDDRLUDLRURDDRDULUDLDLLLDRLRUDLLLLLDUDRDUURUDDUDLDLDUDLLDLRRDLULLURLDDUDDRDUDLDDUULDRLURRDLDLLUUDLDLURRLDRDDLLDLRLULUDRDLLLDRLRLLLDRUULUDLLURDLLUURUDURDDRDRDDUDDRRLLUULRRDRULRURRULLDDDUDULDDRULRLDURLUDULDLDDDLRULLULULUDLDDRDLRDRDLDULRRLRLRLLLLLDDDRDDULRDULRRLDLUDDDDLUDRLLDLURDLRDLDRDRDURRDUDULLLDLUDLDRLRRDDDRRLRLLULDRLRLLLLDUUURDLLULLUDDRLULRDLDLDURRRUURDUDRDLLLLLLDDDURLDULDRLLDUDRULRRDLDUDRLLUUUDULURRUR',
  'URRRLRLLDDDRRLDLDLUDRDRDLDUDDDLDRRDRLDULRRDRRDUDRRUUDUUUDLLUURLRDRRURRRRUDRLLLLRRDULRDDRUDLRLUDURRLRLDDRRLUULURLURURUDRULDUUDLULUURRRDDLRDLUDRDLDDDLRUDURRLLRDDRDRLRLLRLRUUDRRLDLUDRURUULDUURDRUULDLLDRDLRDUUDLRLRRLUDRRUULRDDRDLDDULRRRURLRDDRLLLRDRLURDLDRUULDRRRLURURUUUULULRURULRLDDDDLULRLRULDUDDULRUULRRRRRLRLRUDDURLDRRDDULLUULLDLUDDDUURLRRLDULUUDDULDDUULLLRUDLLLRDDDLUUURLDUDRLLLDRRLDDLUDLLDLRRRLDDRUULULUURDDLUR',
  'UULDRLUULURDRLDULURLUDULDRRDULULUDLLDURRRURDRLRLLRLDDLURRDLUUDLULRDULDRDLULULULDDLURULLULUDDRRULULULRDULRUURRRUDLRLURDRURDRRUDLDDUURDUUDLULDUDDLUUURURLRRDLULURDURRRURURDUURDRRURRDDULRULRRDRRDRUUUUULRLUUUDUUULLRRDRDULRDDULDRRULRLDLLULUUULUUDRDUUUDLLULDDRRDULUURRDUULLUUDRLLDUDLLLURURLUDDLRURRDRLDDURLDLLUURLDUURULLLRURURLULLLUURUUULLDLRDLUDDRRDDUUDLRURDDDRURUURURRRDLUDRLUULDUDLRUUDRLDRRDLDLDLRUDDDDRRDLDDDLLDLULLRUDDUDDDLDDUURLDUDLRDRURULDULULUDRRDLLRURDULDDRRDLUURUUULULRURDUUDLULLURUDDRLDDUDURRDURRUURLDLLDDUUDLLUURDRULLRRUUURRLLDRRDLURRURDULDDDDRDD',
  'LLRUDRUUDUDLRDRDRRLRDRRUDRDURURRLDDDDLRDURDLRRUDRLLRDDUULRULURRRLRULDUURLRURLRLDUDLLDULULDUUURLRURUDDDDRDDLLURDLDRRUDRLDULLRULULLRURRLLURDLLLRRRRDRULRUDUDUDULUURUUURDDLDRDRUUURLDRULDUDULRLRLULLDURRRRURRRDRULULUDLULDDRLRRULLDURUDDUULRUUURDRRLULRRDLDUDURUUUUUURRUUULURDUUDLLUURDLULUDDLUUULLDURLDRRDDLRRRDRLLDRRLUDRLLLDRUULDUDRDDRDRRRLUDUDRRRLDRLRURDLRULRDUUDRRLLRLUUUUURRURLURDRRUURDRRLULUDULRLLURDLLULDDDLRDULLLUDRLURDDLRURLLRDRDULULDDRDDLDDRUUURDUUUDURRLRDUDLRRLRRRDUULDRDUDRLDLRULDL',
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

const getSteps = input =>
  input.reduce(
    (soFar, step) => soFar.concat(step.split('')),
    []
   )

const onBoard = val => Math.abs(val) <= 1

const getLocations = steps =>
  steps.reduce(
    (soFar, char) => {
      const currLoc   = soFar[soFar.length - 1]
      const direction = charToDirection(char)
      const newLoc    = {
        x: currLoc.x + (onBoard(currLoc.x + direction.x) ? direction.x : 0),
        y: currLoc.y + (onBoard(currLoc.y + direction.y) ? direction.y : 0),
      }
      return soFar.concat([newLoc])
    },
    [{ x: 0, y: 0 }]
  )

const coordinateToNum = ({ x, y }) =>
  ((x + 1) % 3) + ((1 - y) * 3) + 1

const getDigitIndices = input =>
  input.reduce(
    (soFar, line) => [...soFar, (soFar[soFar.length - 1] || 0) + line.length],
    []
   )

const instructionsToPassword = input => {
  const locations = getLocations(getSteps(input))
  const digits = getDigitIndices(input).map(i => coordinateToNum(locations[i]))
  return digits.join('')
}

const TESTS = [
  [ coordinateToNum({ x: -1,  y:  1 }), 1 ],
  [ coordinateToNum({ x:  0,  y:  1 }), 2 ],
  [ coordinateToNum({ x:  1,  y:  1 }), 3 ],
  [ coordinateToNum({ x: -1,  y:  0 }), 4 ],
  [ coordinateToNum({ x:  0,  y:  0 }), 5 ],
  [ coordinateToNum({ x:  1,  y:  0 }), 6 ],
  [ coordinateToNum({ x: -1,  y: -1 }), 7 ],
  [ coordinateToNum({ x:  0,  y: -1 }), 8 ],
  [ coordinateToNum({ x:  1,  y: -1 }), 9 ],
  [
    getSteps(EXAMPLE_INPUT),
    ['U', 'L', 'L', 'R', 'R', 'D', 'D', 'D', 'L', 'U', 'R', 'D', 'L', 'U', 'U', 'U', 'U', 'D']
  ], [
    getLocations(['U', 'U', 'U']),
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 1 },
    ]
  ], [
    getLocations(['U', 'R', 'D', 'L']),
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
     ]
  ], [
    getLocations(['U', 'R', 'D', 'L']).map(coordinateToNum),
    [ 5, 2, 3, 6, 5 ]
  ], [
    getLocations(['U', 'U', 'U', 'U']).map(coordinateToNum),
    [ 5, 2, 2, 2, 2 ]
  ], [
    getDigitIndices(EXAMPLE_INPUT),
    [3, 8, 13, 18]
  ], [
    getDigitIndices(['x', 'x', 'x', 'x']),
    [1, 2, 3, 4]
  ], [
    getDigitIndices(['xx', 'xx', 'xx', 'xx']),
    [2, 4, 6, 8]
  ], [
    instructionsToPassword(EXAMPLE_INPUT),
    "1985",
  ], [
    instructionsToPassword(CHALLENGE_INPUT),
    "73597",
  ],
]

TESTS.map(test => cmp(test[0], test[1]))

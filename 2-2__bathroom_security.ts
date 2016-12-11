import { cmp } from './test_utils'
import {
  getLocations,
  getDigitIndices,
  instructionsToPassword,
  EXAMPLE_INPUT,
  getSteps,
} from './2__bathroom_security'

const INITIAL_LOC = { x: -2, y: 0 }

const CHALLENGE_INPUT = [
  'LRRLLLRDRURUDLRDDURULRULLDLRRLRLDULUDDDDLLRRLDUUDULDRURRLDULRRULDLRDUDLRLLLULDUURRRRURURULURRULRURDLULURDRDURDRLRRUUDRULLLLLDRULDDLLRDLURRLDUURDLRLUDLDUDLURLRLDRLUDUULRRRUUULLRDURUDRUDRDRLLDLDDDLDLRRULDUUDULRUDDRLLURDDRLDDUDLLLLULRDDUDDUUULRULUULRLLDULUDLLLLURRLDLUDLDDLDRLRRDRDUDDDLLLLLRRLLRLUDLULLDLDDRRUDDRLRDDURRDULLLURLRDLRRLRDLDURLDDULLLDRRURDULUDUDLLLDDDLLRLDDDLLRRLLURUULULDDDUDULUUURRUUDLDULULDRDDLURURDLDLULDUDUDDDDD',
  'RUURUDRDUULRDDLRLLLULLDDUDRDURDLRUULLLLUDUDRRUDUULRRUUDDURDDDLLLLRRUURULULLUDDLRDUDULRURRDRDLDLDUULUULUDDLUDRLULRUDRDDDLRRUUDRRLULUULDULDDLRLURDRLURRRRULDDRLDLLLRULLDURRLUDULDRDUDRLRLULRURDDRLUDLRURDDRDULUDLDLLLDRLRUDLLLLLDUDRDUURUDDUDLDLDUDLLDLRRDLULLURLDDUDDRDUDLDDUULDRLURRDLDLLUUDLDLURRLDRDDLLDLRLULUDRDLLLDRLRLLLDRUULUDLLURDLLUURUDURDDRDRDDUDDRRLLUULRRDRULRURRULLDDDUDULDDRULRLDURLUDULDLDDDLRULLULULUDLDDRDLRDRDLDULRRLRLRLLLLLDDDRDDULRDULRRLDLUDDDDLUDRLLDLURDLRDLDRDRDURRDUDULLLDLUDLDRLRRDDDRRLRLLULDRLRLLLLDUUURDLLULLUDDRLULRDLDLDURRRUURDUDRDLLLLLLDDDURLDULDRLLDUDRULRRDLDUDRLLUUUDULURRUR',
  'URRRLRLLDDDRRLDLDLUDRDRDLDUDDDLDRRDRLDULRRDRRDUDRRUUDUUUDLLUURLRDRRURRRRUDRLLLLRRDULRDDRUDLRLUDURRLRLDDRRLUULURLURURUDRULDUUDLULUURRRDDLRDLUDRDLDDDLRUDURRLLRDDRDRLRLLRLRUUDRRLDLUDRURUULDUURDRUULDLLDRDLRDUUDLRLRRLUDRRUULRDDRDLDDULRRRURLRDDRLLLRDRLURDLDRUULDRRRLURURUUUULULRURULRLDDDDLULRLRULDUDDULRUULRRRRRLRLRUDDURLDRRDDULLUULLDLUDDDUURLRRLDULUUDDULDDUULLLRUDLLLRDDDLUUURLDUDRLLLDRRLDDLUDLLDLRRRLDDRUULULUURDDLUR',
  'UULDRLUULURDRLDULURLUDULDRRDULULUDLLDURRRURDRLRLLRLDDLURRDLUUDLULRDULDRDLULULULDDLURULLULUDDRRULULULRDULRUURRRUDLRLURDRURDRRUDLDDUURDUUDLULDUDDLUUURURLRRDLULURDURRRURURDUURDRRURRDDULRULRRDRRDRUUUUULRLUUUDUUULLRRDRDULRDDULDRRULRLDLLULUUULUUDRDUUUDLLULDDRRDULUURRDUULLUUDRLLDUDLLLURURLUDDLRURRDRLDDURLDLLUURLDUURULLLRURURLULLLUURUUULLDLRDLUDDRRDDUUDLRURDDDRURUURURRRDLUDRLUULDUDLRUUDRLDRRDLDLDLRUDDDDRRDLDDDLLDLULLRUDDUDDDLDDUURLDUDLRDRURULDULULUDRRDLLRURDULDDRRDLUURUUULULRURDUUDLULLURUDDRLDDUDURRDURRUURLDLLDDUUDLLUURDRULLRRUUURRLLDRRDLURRURDULDDDDRDD',
  'LLRUDRUUDUDLRDRDRRLRDRRUDRDURURRLDDDDLRDURDLRRUDRLLRDDUULRULURRRLRULDUURLRURLRLDUDLLDULULDUUURLRURUDDDDRDDLLURDLDRRUDRLDULLRULULLRURRLLURDLLLRRRRDRULRUDUDUDULUURUUURDDLDRDRUUURLDRULDUDULRLRLULLDURRRRURRRDRULULUDLULDDRLRRULLDURUDDUULRUUURDRRLULRRDLDUDURUUUUUURRUUULURDUUDLLUURDLULUDDLUUULLDURLDRRDDLRRRDRLLDRRLUDRLLLDRUULDUDRDDRDRRRLUDUDRRRLDRLRURDLRULRDUUDRRLLRLUUUUURRURLURDRRUURDRRLULUDULRLLURDLLULDDDLRDULLLUDRLURDDLRURLLRDRDULULDDRDDLDDRUUURDUUUDURRLRDUDLRRLRRRDUULDRDUDRLDLRULDL',
]

const BOARD_MAP =   {
  [-2]: {
    [0]: 'D',
  },
  [-1]: {
    [-1]: 'A',
    [0]:  'B',
    [1]:  'C',
  },
  [0]:  {
    [-2]: '5',
    [-1]: '6',
    [0]:  '7',
    [1]:  '8',
    [2]:  '9',
  },
  [1]:  {
    [-1]: '2',
    [0]:  '3',
    [1]:  '4',
  },
  [2]:  {
    [0]:  '1',
  },
}

const onBoard = ({ x, y }) =>
  (Math.abs(x) + Math.abs(y)) <= 2

const coordinateToNum = ({ x, y }) =>
  BOARD_MAP[y][x]

const TESTS = [
  [ coordinateToNum({ x:  0,  y:  2 }), '1' ],
  [ coordinateToNum({ x: -1,  y:  1 }), '2' ],
  [ coordinateToNum({ x:  0,  y:  1 }), '3' ],
  [ coordinateToNum({ x:  1,  y:  1 }), '4' ],
  [ coordinateToNum({ x: -2,  y:  0 }), '5' ],
  [ coordinateToNum({ x: -1,  y:  0 }), '6' ],
  [ coordinateToNum({ x:  0,  y:  0 }), '7' ],
  [ coordinateToNum({ x:  1,  y:  0 }), '8' ],
  [ coordinateToNum({ x:  2,  y:  0 }), '9' ],
  [ coordinateToNum({ x: -1,  y: -1 }), 'A' ],
  [ coordinateToNum({ x:  0,  y: -1 }), 'B' ],
  [ coordinateToNum({ x:  1,  y: -1 }), 'C' ],
  [ coordinateToNum({ x:  0,  y: -2 }), 'D' ],
  [
    getSteps(EXAMPLE_INPUT),
    ['U', 'L', 'L', 'R', 'R', 'D', 'D', 'D', 'L', 'U', 'R', 'D', 'L', 'U', 'U', 'U', 'U', 'D']
  ], [
    getLocations([], INITIAL_LOC, onBoard),
    [{ x: -2, y: 0 },]
  ], [
    getLocations(['U'], INITIAL_LOC, onBoard),
    [
      { x: -2, y: 0 },
      { x: -2, y: 0 },
    ]
  ], [
    getLocations(['R', 'R', 'R', 'R', 'R'], INITIAL_LOC, onBoard),
    [
      { x: -2, y: 0 },
      { x: -1, y: 0 },
      { x:  0, y: 0 },
      { x:  1, y: 0 },
      { x:  2, y: 0 },
      { x:  2, y: 0 },
    ]
  ], [
    getLocations(['R', 'R', 'U', 'R', 'R'], INITIAL_LOC, onBoard),
    [
      { x: -2, y: 0 },
      { x: -1, y: 0 },
      { x:  0, y: 0 },
      { x:  0, y: 1 },
      { x:  1, y: 1 },
      { x:  1, y: 1 },
    ]
  ], [
    instructionsToPassword(EXAMPLE_INPUT, coordinateToNum, INITIAL_LOC, onBoard),
    '5DB3',
  ], [
    instructionsToPassword(CHALLENGE_INPUT, coordinateToNum, INITIAL_LOC, onBoard),
    'A47DA',
  ]
]

TESTS.map(test => cmp(test[0], test[1]))

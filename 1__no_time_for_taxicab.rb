require 'colorize'
require 'awesome_print'

# directions = [
#   { direction: :L, count: 3   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 4   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 3   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 5   },
#   { direction: :R, count: 1   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 4   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 4   },
#   { direction: :L, count: 4   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 5   },
#   { direction: :R, count: 3   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 3   },
#   { direction: :L, count: 5   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 3   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 190 },
#   { direction: :L, count: 4   },
#   { direction: :R, count: 4   },
#   { direction: :R, count: 51  },
#   { direction: :L, count: 4   },
#   { direction: :R, count: 5   },
#   { direction: :R, count: 5   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 1   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 1   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 4   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 5   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 78  },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 5   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 4   },
#   { direction: :R, count: 1   },
#   { direction: :R, count: 185 },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 4   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 4   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 5   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 5   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 4   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 3   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 3   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 4   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 2   },
#   { direction: :L, count: 4   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 4   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 5   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 4   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 4   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 3   },
#   { direction: :L, count: 5   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 2   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 3   },
#   { direction: :L, count: 2   },
#   { direction: :L, count: 1   },
#   { direction: :L, count: 4   },
#   { direction: :R, count: 4   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 3   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 2   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 3   },
#   { direction: :R, count: 3   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 4   },
#   { direction: :R, count: 4   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 2   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 1   },
#   { direction: :R, count: 4   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 5   },
#   { direction: :R, count: 4   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 4   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 1   },
#   { direction: :R, count: 5   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 1   },
#   { direction: :R, count: 5   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 1   },
#   { direction: :L, count: 5   },
#   { direction: :L, count: 2   },
#   { direction: :R, count: 2   },
#   { direction: :L, count: 2   },
#   { direction: :L, count: 3   },
#   { direction: :R, count: 3   },
#   { direction: :R, count: 3   },
#   { direction: :R, count: 1   }
# ]

COUNTERS = { N: 0, S: 0, E: 0, W: 0 }

TURNS = {
  N: { L: :W, R: :E },
  E: { L: :N, R: :S },
  S: { L: :E, R: :W },
  W: { L: :S, R: :N }
}.freeze

def test_count(computed, expected)
  if computed != expected
    puts 'FAILURE'.red
    puts computed
    puts expected
  else
    puts 'PASSED'.green
  end
end

def compute(directions)
  facing   = :N
  counters = COUNTERS.clone
  ap counters

  directions.each do |d|
    puts "#{facing} => #{TURNS[facing][d[:direction]]}"
    puts d
    facing = TURNS[facing][d[:direction]]
    counters[facing] += d[:count]
  end
  puts facing
  # ap counters
  counters
end

all_directions = [
  {
    expected: { E: 2, N: 3, S: 0, W: 0 },
    directions: [
      { direction: :R, count: 2 },
      { direction: :L, count: 3 }
    ]
  }, {
    expected: { E: 2, N: 0, S: 2, W: 2 },
    directions: [
      { direction: :R, count: 2 },
      { direction: :R, count: 2 },
      { direction: :R, count: 2 }
    ]
  }, {
    expected: { E: 10, N: 5, S: 3, W: 0 },
    directions: [
      { direction: :R, count: 5 },
      { direction: :L, count: 5 },
      { direction: :R, count: 5 },
      { direction: :R, count: 3 }
    ]
  }
]

all_directions.each do |d|
  # ap d
  test_count(compute(d[:directions]), d[:expected])
end

require 'colorize'
require 'awesome_print'

CHALLENGE_DIRECTIONS = [
  { direction: :L, count: 3   },
  { direction: :R, count: 1   },
  { direction: :L, count: 4   },
  { direction: :L, count: 1   },
  { direction: :L, count: 2   },
  { direction: :R, count: 4   },
  { direction: :L, count: 3   },
  { direction: :L, count: 3   },
  { direction: :R, count: 2   },
  { direction: :R, count: 3   },
  { direction: :L, count: 5   },
  { direction: :R, count: 1   },
  { direction: :R, count: 3   },
  { direction: :L, count: 4   },
  { direction: :L, count: 1   },
  { direction: :L, count: 2   },
  { direction: :R, count: 2   },
  { direction: :R, count: 1   },
  { direction: :L, count: 4   },
  { direction: :L, count: 4   },
  { direction: :R, count: 2   },
  { direction: :L, count: 5   },
  { direction: :R, count: 3   },
  { direction: :R, count: 2   },
  { direction: :R, count: 1   },
  { direction: :L, count: 1   },
  { direction: :L, count: 2   },
  { direction: :R, count: 2   },
  { direction: :R, count: 2   },
  { direction: :L, count: 1   },
  { direction: :L, count: 1   },
  { direction: :R, count: 2   },
  { direction: :R, count: 1   },
  { direction: :L, count: 3   },
  { direction: :L, count: 5   },
  { direction: :R, count: 4   },
  { direction: :L, count: 3   },
  { direction: :R, count: 3   },
  { direction: :R, count: 3   },
  { direction: :L, count: 5   },
  { direction: :L, count: 190 },
  { direction: :L, count: 4   },
  { direction: :R, count: 4   },
  { direction: :R, count: 51  },
  { direction: :L, count: 4   },
  { direction: :R, count: 5   },
  { direction: :R, count: 5   },
  { direction: :R, count: 2   },
  { direction: :L, count: 1   },
  { direction: :L, count: 3   },
  { direction: :R, count: 1   },
  { direction: :R, count: 4   },
  { direction: :L, count: 3   },
  { direction: :R, count: 1   },
  { direction: :R, count: 3   },
  { direction: :L, count: 5   },
  { direction: :L, count: 4   },
  { direction: :R, count: 2   },
  { direction: :R, count: 5   },
  { direction: :R, count: 2   },
  { direction: :L, count: 1   },
  { direction: :L, count: 5   },
  { direction: :L, count: 1   },
  { direction: :L, count: 1   },
  { direction: :R, count: 78  },
  { direction: :L, count: 3   },
  { direction: :R, count: 2   },
  { direction: :L, count: 3   },
  { direction: :R, count: 5   },
  { direction: :L, count: 2   },
  { direction: :R, count: 2   },
  { direction: :R, count: 4   },
  { direction: :L, count: 1   },
  { direction: :L, count: 4   },
  { direction: :R, count: 1   },
  { direction: :R, count: 185 },
  { direction: :R, count: 3   },
  { direction: :L, count: 4   },
  { direction: :L, count: 1   },
  { direction: :L, count: 1   },
  { direction: :L, count: 3   },
  { direction: :R, count: 4   },
  { direction: :L, count: 4   },
  { direction: :L, count: 1   },
  { direction: :R, count: 5   },
  { direction: :L, count: 5   },
  { direction: :L, count: 1   },
  { direction: :R, count: 5   },
  { direction: :L, count: 1   },
  { direction: :R, count: 2   },
  { direction: :L, count: 5   },
  { direction: :L, count: 2   },
  { direction: :R, count: 4   },
  { direction: :R, count: 3   },
  { direction: :L, count: 2   },
  { direction: :R, count: 3   },
  { direction: :R, count: 1   },
  { direction: :L, count: 3   },
  { direction: :L, count: 5   },
  { direction: :L, count: 4   },
  { direction: :R, count: 3   },
  { direction: :L, count: 2   },
  { direction: :L, count: 4   },
  { direction: :L, count: 5   },
  { direction: :L, count: 4   },
  { direction: :R, count: 1   },
  { direction: :L, count: 1   },
  { direction: :R, count: 5   },
  { direction: :L, count: 2   },
  { direction: :R, count: 4   },
  { direction: :R, count: 2   },
  { direction: :R, count: 3   },
  { direction: :L, count: 1   },
  { direction: :L, count: 1   },
  { direction: :L, count: 4   },
  { direction: :L, count: 3   },
  { direction: :R, count: 4   },
  { direction: :L, count: 3   },
  { direction: :L, count: 5   },
  { direction: :R, count: 2   },
  { direction: :L, count: 5   },
  { direction: :L, count: 1   },
  { direction: :L, count: 1   },
  { direction: :R, count: 2   },
  { direction: :R, count: 3   },
  { direction: :L, count: 5   },
  { direction: :L, count: 3   },
  { direction: :L, count: 2   },
  { direction: :L, count: 1   },
  { direction: :L, count: 4   },
  { direction: :R, count: 4   },
  { direction: :R, count: 4   },
  { direction: :L, count: 2   },
  { direction: :R, count: 3   },
  { direction: :R, count: 1   },
  { direction: :L, count: 2   },
  { direction: :R, count: 1   },
  { direction: :L, count: 2   },
  { direction: :L, count: 2   },
  { direction: :R, count: 3   },
  { direction: :R, count: 3   },
  { direction: :L, count: 1   },
  { direction: :R, count: 4   },
  { direction: :L, count: 5   },
  { direction: :L, count: 3   },
  { direction: :R, count: 4   },
  { direction: :R, count: 4   },
  { direction: :R, count: 1   },
  { direction: :L, count: 2   },
  { direction: :L, count: 5   },
  { direction: :L, count: 3   },
  { direction: :R, count: 1   },
  { direction: :R, count: 4   },
  { direction: :L, count: 2   },
  { direction: :R, count: 5   },
  { direction: :R, count: 4   },
  { direction: :R, count: 2   },
  { direction: :L, count: 5   },
  { direction: :L, count: 3   },
  { direction: :R, count: 4   },
  { direction: :R, count: 1   },
  { direction: :L, count: 1   },
  { direction: :R, count: 5   },
  { direction: :L, count: 3   },
  { direction: :R, count: 1   },
  { direction: :R, count: 5   },
  { direction: :L, count: 2   },
  { direction: :R, count: 1   },
  { direction: :L, count: 5   },
  { direction: :L, count: 2   },
  { direction: :R, count: 2   },
  { direction: :L, count: 2   },
  { direction: :L, count: 3   },
  { direction: :R, count: 3   },
  { direction: :R, count: 3   },
  { direction: :R, count: 1   }
]

COUNTERS = { N: 0, S: 0, E: 0, W: 0 }

TURNS = {
  N: { L: :W, R: :E },
  E: { L: :N, R: :S },
  S: { L: :E, R: :W },
  W: { L: :S, R: :N }
}.freeze


def get_total(c)
  ((c[:N] - c[:S]) + (c[:E] - c[:W])).abs
end


def test_count(computed, expected)
  if (computed != expected) || (get_total(computed) != get_total(expected))
    puts 'FAILURE'.red
  else
    puts 'PASSED'.green
  end
end


def compute(directions)
  facing   = :N
  counters = COUNTERS.clone
  visited  = [{ x: 0, y: 0 }]
  first_repeat = nil

  directions.each do |d|
    facing = TURNS[facing][d[:direction]]
    counters[facing] += d[:count]

    d[:count].times do |i|
      curr_location = visited.last.clone

      case facing
      when :N then curr_location[:y] += 1
      when :E then curr_location[:x] += 1
      when :S then curr_location[:y] -= 1
      when :W then curr_location[:x] -= 1
      end

      if visited.include?(curr_location) && !first_repeat
        puts "#{curr_location}".green
        first_repeat = curr_location
      end

      visited << curr_location
    end
  end

  # ap counters
  # ap visited
  counters
end


all_directions = [
  {
    expected: { E: 2, N: 3, S: 0, W: 0 },
    result: 5,
    directions: [
      { direction: :R, count: 2 },
      { direction: :L, count: 3 }
    ]
  }, {
    expected: { E: 2, N: 0, S: 2, W: 2 },
    result: 2,
    directions: [
      { direction: :R, count: 2 },
      { direction: :R, count: 2 },
      { direction: :R, count: 2 }
    ]
  }, {
    expected: { E: 10, N: 5, S: 3, W: 0 },
    result: 12,
    directions: [
      { direction: :R, count: 5 },
      { direction: :L, count: 5 },
      { direction: :R, count: 5 },
      { direction: :R, count: 3 }
    ]
  }, {
    expected: { E: 314, N: 306, S: 176, W: 192 },
    result: 252,
    directions: CHALLENGE_DIRECTIONS
  }
]


all_directions.each do |d|
  test_count(compute(d[:directions]), d[:expected])
end

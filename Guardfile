$LOAD_PATH.unshift(Pathname.new(__dir__).join('lib').to_s)

require 'guard'

guard :typescript, cmd: './run' do
  watch(%r{^(.+)\.ts$}) { |m| m[1] }
end

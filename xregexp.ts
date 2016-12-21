import * as XRegExp from 'xregexp'
import { p } from './utils'

const date = XRegExp(
  '(?<year>  [0-9]{4} ) -?  # year  \n\
  (?<month> [0-9]{2} ) -?   # month \n\
  (?<day>   [0-9]{2} )      # day   ',

  'x'
)

const str = '2016-12-01'
const match = XRegExp.exec(str, date)
p({
  year:  match.year,
  month: match.month,
  date:  match.day,
})

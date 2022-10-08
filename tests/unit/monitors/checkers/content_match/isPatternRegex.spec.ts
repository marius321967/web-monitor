import isPatternRegex from '@/monitors/checkers/content_match/isPatternRegex'
import { expect } from 'chai'

describe('monitors/checkers/content_match/isPatternRegex', () => {

  [
    [ '',     false ],
    [ '/',    false ],
    [ '//',   true ],
    [ '/(/',  true ],
  ].forEach(([input, expectedResult]: [string, boolean]) => 

    it(
      `${input} = ${expectedResult}`, 
      () => expect(isPatternRegex(input)).to.equal(expectedResult)
    )

  )

})

import selectorMatches from '@/monitors/checkers/element_match/selectorMatches'
import { expect } from 'chai'

describe('monitors/checkers/element_match/selectorMatches', () => {

  it('Positive match with nesting & class name', () => 
    expect(selectorMatches(
      'html body > .foo',
      `<html>
        <body>
          <div class="foo"></div>
        </body>
      </html>`
    )).to.equal(true)
  )

  it('Negative match with nesting & class name', () => 
    expect(selectorMatches(
      'html body > .foo',
      `<html>
        <body>
          <div>
            <div class="foo"></div>
          </div>
        </body>
      </html>`
    )).to.equal(false)
  )
  
  it('Ignores & returns false if selector is malformed (supposed to validate it when loading config)', () => 
    expect(selectorMatches(
      '.foo[',
      '<div class="foo"></div>'
    )).to.equal(false)
  )

})
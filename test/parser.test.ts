import { describe, expect, it } from 'vitest'
import { matter } from '@md-report/parser'

const source = `---
aaa: bbb
ccc: 111
ddd: true
---`

describe('frontmatter', () => {
  it('get frontmatter', () => {
    expect(matter(source).data).toEqual({
      aaa: 'bbb',
      ccc: 111,
      ddd: true,
    })
  })
})

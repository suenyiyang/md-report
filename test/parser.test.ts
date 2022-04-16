import { describe, expect, it } from 'vitest'
import { matter, parse } from '@md-report/parser'

const source = `---
aaa: bbb
ccc: 111
ddd: true
---

# 111

222

3333
`

describe('core', () => {
  it('get frontmatter', () => {
    expect(matter(source).data).toEqual({
      aaa: 'bbb',
      ccc: 111,
      ddd: true,
    })
  })

  it('parse markdown', () => {
    expect(parse(source)).toEqual({
      raw: source,
      frontmatter: {
        aaa: 'bbb',
        ccc: 111,
        ddd: true,
      },
      content: [
        {
          type: 'heading_open',
          tag: 'h1',
          attrs: null,
          map: [
            1,
            2,
          ],
          nesting: 1,
          level: 0,
          children: null,
          content: '',
          markup: '#',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
        {
          type: 'inline',
          tag: '',
          attrs: null,
          map: [
            1,
            2,
          ],
          nesting: 0,
          level: 1,
          children: [
            {
              type: 'text',
              tag: '',
              attrs: null,
              map: null,
              nesting: 0,
              level: 0,
              children: null,
              content: '111',
              markup: '',
              info: '',
              meta: null,
              block: false,
              hidden: false,
            },
          ],
          content: '111',
          markup: '',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
        {
          type: 'heading_close',
          tag: 'h1',
          attrs: null,
          map: null,
          nesting: -1,
          level: 0,
          children: null,
          content: '',
          markup: '#',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
        {
          type: 'paragraph_open',
          tag: 'p',
          attrs: null,
          map: [
            3,
            4,
          ],
          nesting: 1,
          level: 0,
          children: null,
          content: '',
          markup: '',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
        {
          type: 'inline',
          tag: '',
          attrs: null,
          map: [
            3,
            4,
          ],
          nesting: 0,
          level: 1,
          children: [
            {
              type: 'text',
              tag: '',
              attrs: null,
              map: null,
              nesting: 0,
              level: 0,
              children: null,
              content: '222',
              markup: '',
              info: '',
              meta: null,
              block: false,
              hidden: false,
            },
          ],
          content: '222',
          markup: '',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
        {
          type: 'paragraph_close',
          tag: 'p',
          attrs: null,
          map: null,
          nesting: -1,
          level: 0,
          children: null,
          content: '',
          markup: '',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
        {
          type: 'paragraph_open',
          tag: 'p',
          attrs: null,
          map: [
            5,
            6,
          ],
          nesting: 1,
          level: 0,
          children: null,
          content: '',
          markup: '',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
        {
          type: 'inline',
          tag: '',
          attrs: null,
          map: [
            5,
            6,
          ],
          nesting: 0,
          level: 1,
          children: [
            {
              type: 'text',
              tag: '',
              attrs: null,
              map: null,
              nesting: 0,
              level: 0,
              children: null,
              content: '3333',
              markup: '',
              info: '',
              meta: null,
              block: false,
              hidden: false,
            },
          ],
          content: '3333',
          markup: '',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
        {
          type: 'paragraph_close',
          tag: 'p',
          attrs: null,
          map: null,
          nesting: -1,
          level: 0,
          children: null,
          content: '',
          markup: '',
          info: '',
          meta: null,
          block: true,
          hidden: false,
        },
      ],
    })
  })
})

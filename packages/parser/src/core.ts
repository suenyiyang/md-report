import YAML = require('js-yaml')
import { isObject } from '@antfu/utils'
import MarkdownIt = require('markdown-it')
import type { ReportConfig, ReportMarkdown, ReportMarkdownParagraph, ReportMarkdownParagraphChild, ReportMarkdownSection } from '@md-report/types'
import Token = require('markdown-it/lib/token')
import type { IRunOptions } from 'docx'
import { HEADING_OPEN, PARAGRAPH_OPEN } from './constants'
import { getParagraphChildConfig, getParagraphChildType } from './utils'

const md = MarkdownIt({ html: true })

export function matter(code: string): { data: ReportConfig; content: string } {
  let data: any = {}
  const content = code.replace(/^---.*\r?\n([\s\S]*?)---/,
    (_, d) => {
      data = YAML.load(d)
      if (!isObject(data))
        data = {}
      return ''
    })
  return { data, content }
}

export function parseParagraphChild(tokens: Token[]): ReportMarkdownParagraphChild {
  // Get rid of closing tags.
  let i = 0
  while (tokens[i].type.includes('close') || tokens[i].content.match(/\<\/[^]*?\>/))
    i++

  const type = getParagraphChildType(tokens[i])
  const config: IRunOptions = getParagraphChildConfig(tokens.slice(i))

  return {
    type,
    config,
  }
}

export function parseParagraph(tokens: Token[]): ReportMarkdownParagraph {
  const type = tokens[0].type === HEADING_OPEN ? 'heading' : 'paragraph'
  const level = tokens[0].markup.length
  const _content = tokens[1].children
  const children: ReportMarkdownParagraphChild[] = []

  let start = 0
  for (let i = 0; i < _content.length; i++) {
    const _token = _content[i]
    if (_token.type === 'code_inline' || _token.type === 'text') {
      children.push(parseParagraphChild(_content.slice(start, i + 1)))
      start = i + 1
    }
  }

  return {
    type,
    level,
    children,
  }
}

export function parseSection(tokens: Token[]): ReportMarkdownSection {
  const children: ReportMarkdownParagraph[] = []

  let start = 0
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if ((token.type === HEADING_OPEN || token.type === PARAGRAPH_OPEN) && i > start) {
      children.push(parseParagraph(tokens.slice(start, i)))
      start = i
    }
  }
  children.push(parseParagraph(tokens.slice(start)))

  return {
    type: 'section',
    children,
  }
}

export function parseContent(tokens: Token[]): ReportMarkdownSection[] {
  const sections: ReportMarkdownSection[] = []

  let start = 0
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    // If heading 1.
    if (token.type === HEADING_OPEN && token.markup.length === 1 && i > start) {
      sections.push(parseSection(tokens.slice(start, i)))
      start = i
    }
  }
  sections.push(parseSection(tokens.slice(start)))

  return sections
}

export function parse(markdown: string): ReportMarkdown {
  const { data: frontmatter, content: rawContent } = matter(markdown)
  const contentTokens = md.parse(rawContent, {})

  const content = parseContent(contentTokens)

  return {
    raw: markdown,
    frontmatter,
    content,
  }
}

const src = `# 111

this is a paragraph with **\`strong\`**, *italic*, \`inline code\`, [hyperlink](https://syy11.cn), ~~delete~~, ==highlight==, $1 + 1 = 2$, a<sup>sup</sup><sub>sub</sub>, ![image](https://image.cn), footnotes[^foot][^note]

\`\`\`javascript
const a = 0
\`\`\`

$$
1+2=3
$$

# Refs

[^foot]: ref1
[^note]: ref2`

// eslint-disable-next-line no-console
console.log(parse(src).content[0].children[1].children)

import YAML = require('js-yaml')
import { isObject } from '@antfu/utils'
import MarkdownIt = require('markdown-it')
import type {} from '@md-report/parser'
import type { ReportConfig, ReportMarkdown } from '@md-report/types'

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

export function parse(markdown: string): ReportMarkdown {
  const { data: frontmatter, content: rawContent } = matter(markdown)
  const content = md.parse(rawContent, null)
  return {
    raw: markdown,
    frontmatter,
    content,
  }
}

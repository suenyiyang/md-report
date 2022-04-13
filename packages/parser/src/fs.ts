/* eslint-disable no-console */
import { promises as fs } from 'fs'
import type { ReportMarkdown } from '@md-report/types'
// import { dirname, resolve } from 'path'
// import { parse } from './core'

export async function load(filepath: string, content?: string): Promise<ReportMarkdown> {
  const markdown = content ?? await fs.readFile(filepath, 'utf8')

  return {
    raw: markdown,
    frontmatter: { title: '111' },
  }
}

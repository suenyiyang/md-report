/* eslint-disable no-console */
import { promises as fs } from 'fs'
// import { dirname, resolve } from 'path'
// import { parse } from './core'

export async function readFile(filepath: string, content?: string): Promise<string> {
  const markdown = content ?? await fs.readFile(filepath, 'utf8')
  const lines = markdown.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    console.log(`line ${i}: `, line)
  }

  return markdown
}

console.log(readFile('/Users/bytedance/s/markdown-report/test/index.md'))

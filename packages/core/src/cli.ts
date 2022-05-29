import { readFileSync, writeFileSync } from 'fs'
import { cwd } from 'process'
import { getBuffer } from '@md-report/parser'
import yargs from 'yargs'
import { defaultConfig } from './config'

const argv = yargs(process.argv.slice(2)).options({
  md: { type: 'string' },
  theme: { type: 'string' },
}).parseSync()

async function cli(props: {
  filename?: string
  theme?: string
}): Promise<void> {
  console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: start...')
  const { filename = 'index.md' } = props
  const file = readFileSync(`${cwd()}/${filename}`)
  const buffer = await getBuffer({ markdown: file.toString(), config: defaultConfig })
  writeFileSync(`${cwd()}/My document.docx`, buffer)
  console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: finish.')
}

cli({ filename: argv.md, theme: argv.theme })

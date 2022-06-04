import { readFileSync, writeFileSync } from 'fs'
import { cwd } from 'process'
import { getBuffer } from '@md-report/parser'
import yargs from 'yargs'
import { defaultConfig } from './config'

const argv = yargs(process.argv.slice(2)).options({
  f: { type: 'string' },
  c: { type: 'string' },
}).parseSync()

async function cli(props: {
  filename?: string
  config?: string
}): Promise<void> {
  console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: Started...')
  const { filename = 'index.md', config = 'config.json' } = props
  try {
    const file = readFileSync(`${cwd()}/${filename}`)
    const cfg = { ...defaultConfig, ...JSON.parse(readFileSync(`${cwd()}/${config}`).toString()) }
    const output = cfg.meta.pageHeaderText || 'My Document'
    console.log(cfg)
    const buffer = await getBuffer({ markdown: file.toString(), config: cfg })
    writeFileSync(`${cwd()}/${output.replace(/\.docx?$/, '')}.docx`, buffer)
  }
  catch (e) {
    console.log(`[Markdown Report]: ${e}`)
    console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: Failed.')
    return
  }
  console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: Finished.')
}

cli({ filename: argv.f, config: argv.c })

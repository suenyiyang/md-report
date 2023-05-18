import { readFileSync, writeFileSync } from 'fs'
import { cwd } from 'process'
// import { getBuffer, parseDocument } from '@md-report/parser'
import yargs from 'yargs'
import { parseDocument } from '@md-report/parser'
import { generateDocument, getBuffer } from './generator'
// import { defaultConfig } from './config'

const argv = yargs(process.argv.slice(2)).options({
  f: { type: 'string' },
  c: { type: 'string' },
}).parseSync()

async function cli(props: {
  filename?: string
  config?: string
}): Promise<void> {
  const startTime = Date.now()
  console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: Started...', startTime)
  const { filename = 'index.md', config: _config = 'config.json' } = props
  try {
    const markdown = readFileSync(`${cwd()}/${filename}`).toString()

    // const parserOutput = parseDocument(file.toString())

    // console.log(parserOutput)
    // const cfg = { ...defaultConfig, ...JSON.parse(readFileSync(`${cwd()}/${config}`).toString()) }
    // const output = cfg.meta.pageHeaderText || 'My Document'
    // console.log(cfg)
    // const buffer = await getBuffer({ markdown: file.toString(), config: cfg })
    const buffer = await getBuffer(await generateDocument(parseDocument(markdown)))

    writeFileSync(`${cwd()}/output.docx`, Uint8Array.from(buffer), { encoding: 'utf-8' })
  }
  catch (e) {
    console.log(`[Markdown Report]: ${e}`)
    console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: Failed.')
    return
  }
  const endTime = Date.now()
  console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: Finished.', endTime)
  console.log('\x1B[36m%s\x1B[0m', '[Markdown Report]: Time:', endTime - startTime)
}

cli({ filename: argv.f, config: argv.c })

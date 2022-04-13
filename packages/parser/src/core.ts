import YAML = require('js-yaml')
import type {} from '@md-report/types'
import { isObject } from '@antfu/utils'

export function matter(code: string) {
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

// export function parse(markdown: string, filepath?: string) {
// }

#!/usr/bin/env node

import mri from 'mri'
import { convert, freeAgentHeaders } from '.'

const usage = (basename: string) => `usage: ${basename} [-h, --help, option...]

Convert a TfL CSV to FreeAgent. Read from stdin, output to stdout.

example: ${basename} --claimant_name "Foo" < /path/to/tfl.csv

options:
  ${freeAgentHeaders.map((header) => `  --${header} <string>`).join('\n')}`

const [, basename, ...args] = process.argv
const opts = {
  alias: {
    h: 'help',
  },
  boolean: 'help',
}
const { _, help, ...params } = mri(args, opts) // eslint-disable-line @typescript-eslint/no-unused-vars

if (help) {
  console.error(usage(basename))
  process.exit(0)
}

let input = ''
process.stdin.on('data', (data) => {
  input += data
})

process.stdin.once('end', () => {
  convert(input, params)
    .then((res) => process.stdout.write(res))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
})

#!/usr/bin/env node

import { convert, Params } from '.'

let input = ''
process.stdin.on('data', data => {
  input += data
})

process.stdin.once('end', () => {
  const [, basename, claimentParm, ...claimant] = process.argv

  if (claimentParm !== '--claimant') {
    console.error(`${basename} --claimant <name>`)
    process.exit(1)
  }

  const params: Params = {
    claimant_name: claimant.join(' '), // eslint-disable-line @typescript-eslint/camelcase
  }

  convert(input, params)
    .then(res => process.stdout.write(res))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
})

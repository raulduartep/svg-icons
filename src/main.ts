#!/usr/bin/env node

import { generate } from './generate.js'
import { migrate } from './migrate.js'
import { unusedAssets } from './unused-assets.js'

const [, , command, ...args] = process.argv

async function main() {
  if (!command) {
    await generate()
    return
  }

  if (command === 'migrate') {
    await migrate()
    return
  }

  if (command === 'unused-assets') {
    const assetDir = args[0]
    if (!assetDir) {
      console.error('Please provide the asset directory as an argument.')
      process.exit(1)
    }

    await unusedAssets(assetDir)
    return
  }

  console.error(`Unknown command: ${command}`)
}

main()

#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'

import { ClearCacheScript } from './scripts/clear-cache/index.js'
import { GenerateScript } from './scripts/generate/index.js'

const [, , command] = process.argv

async function main() {
  if (!command) {
    return render(<GenerateScript />)
  }

  if (command === 'clear-cache') {
    return render(<ClearCacheScript />)
  }

  console.error(`Unknown command: ${command}`)
}

main()

#!/usr/bin/env node

import { getConfig } from './config.js'
import { promptForIcons, saveIcons } from './icon.js'
import { downloadIconSetFiles, generateIconSetManifest, promptForIconSet } from './icon-set.js'
import { ensureTempDir, promptForSelectAgain } from './utils.js'

process.on('uncaughtException', error => {
  console.error('\n' + error)
  process.exit(1)
})

async function main() {
  await ensureTempDir()

  const config = await getConfig()

  let shouldExecAgain = false

  do {
    const iconSet = await promptForIconSet()

    await downloadIconSetFiles(iconSet)

    const iconSetManifestMap = await generateIconSetManifest(iconSet)

    const iconNames = await promptForIcons(Array.from(iconSetManifestMap.keys()))

    await saveIcons(
      iconSet,
      config,
      iconNames.map(iconName => [iconName, iconSetManifestMap.get(iconName)!])
    )

    console.log('\n----------------------------------------\n')
    shouldExecAgain = await promptForSelectAgain()

    if (shouldExecAgain) {
      console.log('\n----------------------------------------\n')
    }
  } while (shouldExecAgain)
}

main()

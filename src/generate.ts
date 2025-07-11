import ora from 'ora'

import { getConfig } from './utils/config.js'
import { ensureTempDir, promptForSelectAgain } from './utils/helpers.js'
import { promptForIcons, saveIcons } from './utils/icon.js'
import { downloadIconSetFiles, generateIconSetManifest, promptForIconSet } from './utils/icon-set.js'

process.on('uncaughtException', error => {
  console.error('\n' + error)
  process.exit(1)
})

export async function generate() {
  await ensureTempDir()

  const config = await getConfig()

  let shouldExecAgain = false

  do {
    const iconSet = await promptForIconSet()

    const downloadSpinner = ora(`Downloading ${iconSet.name} set`).start()
    try {
      await downloadIconSetFiles(iconSet)
      downloadSpinner.succeed()
    } catch (error) {
      downloadSpinner.fail()
      console.error(error)
      process.exit(1)
    }

    let iconSetManifestMap: Map<string, string>
    const generateManifestSpinner = ora(`Generating ${iconSet.name} set manifest`).start()
    try {
      iconSetManifestMap = await generateIconSetManifest(iconSet)
      generateManifestSpinner.succeed()
    } catch (error) {
      generateManifestSpinner.fail()
      console.error(error)
      process.exit(1)
    }

    const iconNames = await promptForIcons(Array.from(iconSetManifestMap.keys()))

    const saveSpinner = ora(`Saving icons`).start()
    try {
      await saveIcons(
        iconSet,
        config,
        iconNames.map(iconName => [iconName, iconSetManifestMap.get(iconName)!])
      )
      saveSpinner.succeed()
    } catch (error) {
      saveSpinner.fail()
      console.error(error)
      process.exit(1)
    }

    console.log('\n----------------------------------------\n')
    shouldExecAgain = await promptForSelectAgain()

    if (shouldExecAgain) {
      console.log('\n----------------------------------------\n')
    }
  } while (shouldExecAgain)
}

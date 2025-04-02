import { search } from 'fast-fuzzy'
import { select } from 'inquirer-select-pro'
import fs from 'node:fs/promises'
import path from 'node:path'
import ora from 'ora'
import svgo from 'svgo'

import { SVGO_CONFIG } from './constants/svgo.js'
import { TConfig, TIconSet } from './types.js'

export async function promptForIcons(choices: string[]): Promise<string[]> {
  try {
    const selectedIcons = await select({
      message: 'Select an icon:',
      options: async filter => {
        let filteredChoices = choices

        if (filter) {
          filteredChoices = search(filter, choices)
        }

        return filteredChoices.map(icon => ({
          name: icon,
          value: icon,
        }))
      },
    })

    return selectedIcons
  } catch {
    process.exit(1)
  }
}

export async function saveIcons(iconSet: TIconSet, config: TConfig, icons: [string, string][]) {
  const spinner = ora(`Saving icons`).start()

  try {
    for (const [iconName, iconPath] of icons) {
      const rawSvg = await fs.readFile(iconPath, 'utf-8')
      const optimizedSvg = svgo.optimize(rawSvg, SVGO_CONFIG)

      await fs.mkdir(config.dirPath, {
        recursive: true,
      })

      await fs.writeFile(path.join(config.dirPath, `${iconSet.id}-${iconName}.svg`), optimizedSvg.data)
    }

    spinner.succeed()
  } catch (error) {
    spinner.fail()
    console.error(error)
    process.exit(1)
  }
}

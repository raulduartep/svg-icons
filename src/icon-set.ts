import { kebabCase } from 'change-case'
import inquirer from 'inquirer'
import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import ora from 'ora'

import { TEMP_DIR } from './constants/general.js'
import { SORTED_ICON_SETS } from './constants/icon-set.js'
import { TIconSet } from './types.js'
import { verifyIfPathExist } from './utils.js'

const execFileAsync = promisify(execFile)

export async function promptForIconSet(): Promise<TIconSet> {
  try {
    const selectedIconSet = await inquirer.prompt([
      {
        type: 'select',
        name: 'value',
        message: 'Select a icon set:',
        loop: false,
        choices: SORTED_ICON_SETS.map(iconSet => [
          {
            value: iconSet,
            name: iconSet.name,
          },
          // Add a disabled option to display the project URL
          // The space character is used to disable the option and remove the default disabled suffix
          { value: '', name: iconSet.projectUrl, disabled: ' ' },
        ]).flat(),
      },
    ])

    return selectedIconSet.value as TIconSet
  } catch {
    process.exit(1)
  }
}

export async function downloadIconSetFiles(iconSet: TIconSet) {
  const iconSetDirPath = path.join(TEMP_DIR, iconSet.id)

  const packedIconSetAlreadyExists = await verifyIfPathExist(iconSetDirPath)

  if (!packedIconSetAlreadyExists) {
    const spinner = ora(`Downloading ${iconSet.name} set`).start()

    // Ensure the icon set directory exists

    await fs.mkdir(iconSetDirPath, {
      recursive: true,
    })

    await execFileAsync('git', ['clone', '--filter=tree:0', '--no-checkout', iconSet.source.url, 'files'], {
      cwd: iconSetDirPath,
    })

    const iconSetFilesDirPath = path.join(iconSetDirPath, 'files')
    await execFileAsync('git', ['sparse-checkout', 'set', '--cone', '--skip-checks', iconSet.source.remoteDir], {
      cwd: iconSetFilesDirPath,
    })

    await execFileAsync('git', ['checkout', iconSet.source.branch], {
      cwd: iconSetFilesDirPath,
    })

    spinner.succeed()
  }
}

export async function generateIconSetManifest(iconSet: TIconSet): Promise<Map<string, string>> {
  const iconSetManifestPath = path.join(TEMP_DIR, iconSet.id, 'manifest.json')
  let iconsMap = new Map<string, string>()

  let iconSetManifestAlreadyExist: boolean
  try {
    const iconSetManifestContent = await fs.readFile(iconSetManifestPath, { encoding: 'utf-8' })
    iconsMap = new Map(Object.entries(JSON.parse(iconSetManifestContent)))
    iconSetManifestAlreadyExist = true
  } catch {
    iconSetManifestAlreadyExist = false
  }

  if (!iconSetManifestAlreadyExist) {
    const spinner = ora(`Generating ${iconSet.name} set manifest`).start()

    try {
      for (const resolver of iconSet.resolvers) {
        const files = await resolver.files(path.join(TEMP_DIR, iconSet.id, 'files', iconSet.source.remoteDir))

        for (const file of files) {
          const fileName = path.basename(file, path.extname(file))
          const name = await resolver.name(kebabCase(fileName), file)

          if (iconsMap.has(name)) {
            continue
          }

          iconsMap.set(name, file)
        }
      }

      const content = JSON.stringify(Object.fromEntries(iconsMap), null, 2)
      await fs.writeFile(iconSetManifestPath, content)

      spinner.succeed()
    } catch (error) {
      spinner.fail()
      console.error(error)
      process.exit(1)
    }
  }

  return iconsMap
}

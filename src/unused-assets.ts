import fg from 'fast-glob'
import fs from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'
import path from 'path'

const IGNORE_GLOB = ['**/node_modules/**', '**/dist/**', '**/.next/**']

function getBaseName(file: string) {
  // Extract the base name of the file, removing any version suffix like @2x, @3x, etc, and remove the file extension
  return path
    .basename(file)
    .replace(/@[\d]x/, '')
    .replace(/\.[^/.]+$/, '')
}

export async function unusedAssets(assetDir: string) {
  const spinner = ora(`Searching for unused assets in ${assetDir}`)
  try {
    spinner.start()

    const sourceDir = process.cwd()
    const dirname = path.join(process.cwd(), assetDir)

    const assetFiles = await fg(`${dirname}/**/*`, { ignore: IGNORE_GLOB })
    const assetsMap = new Map<string, { file: string; baseName: string }>()
    assetFiles.forEach(file => {
      const baseName = getBaseName(file)
      if (!assetsMap.has(baseName)) {
        assetsMap.set(baseName, { file, baseName })
      }
    })

    const files = await fg(`${sourceDir}/**/*.{js,jsx,ts,tsx}`, { ignore: IGNORE_GLOB })

    for (const file of files) {
      spinner.text = `Checking file: ${file}`
      spinner.render()

      const content = fs.readFileSync(file, 'utf8')

      assetsMap.forEach(({ baseName }) => {
        if (content.includes(`/${baseName}.`)) {
          assetsMap.delete(baseName)
        }
      })
    }

    const unusedAssets = Array.from(assetsMap.values()).map(({ file }) => file)

    if (unusedAssets.length === 0) {
      spinner.succeed('Any unused assets found.')
      return
    }

    spinner.succeed(`Found ${unusedAssets.length} unused assets.`)
    console.log(unusedAssets.join(', '))

    const { value: confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'value',
        message: 'Do you want to delete these unused assets?',
      },
    ])

    if (!confirm) {
      console.log('Operation cancelled. No files were deleted.')
      return
    }

    const deleteSpinner = ora('Deleting unused assets...').start()
    await Promise.allSettled(unusedAssets.map(asset => fs.promises.unlink(asset)))
    deleteSpinner.succeed(`Deleted ${unusedAssets.length} unused assets successfully.`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    spinner.fail(error.message)
  }
}

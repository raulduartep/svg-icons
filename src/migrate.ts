import camelCase from 'camelcase'
import fg from 'fast-glob'
import fs from 'fs'
import ora from 'ora'
import path from 'path'

import { ICON_SETS } from './constants/icon-set.js'
import { getConfig } from './config.js'
import { saveIcons } from './icon.js'
import { downloadIconSetFiles, generateIconSetManifest } from './icon-set.js'

const IGNORE_GLOB = ['**/node_modules/**', '**/dist/**', '**/.next/**']

function extractIconInfoFromFileName(file: string) {
  const fileName = path.basename(file, path.extname(file))
  const fileNameSplit = fileName.split(/(?=[A-Z0-9])/)
  const iconSetId = fileNameSplit[0].toLowerCase()
  const iconName = fileNameSplit.slice(1).join('-').toLowerCase()

  const iconSet = ICON_SETS.find(set => set.id === iconSetId)
  if (!iconSet) {
    throw new Error(`Icon set not found for ID: ${iconSetId}`)
  }

  return { iconSet, iconName }
}

function findAssetImports(content: string) {
  const regex = /(?:import\s+.*?\s+from\s+|require\()\s*['"](.+?)['"]/g
  const matches: { importPath: string; importFull: string }[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1]

    if (ICON_SETS.some(set => importPath.toLowerCase().includes(set.id))) {
      matches.push({ importPath, importFull: match[0] })
    }
  }

  return matches
}

export async function migrate() {
  const spinner = ora(`Migrating`)

  try {
    spinner.start()

    const config = await getConfig()

    const files = await fg(`${config.configDirPath}/**/*.{ts,js,tsx,jsx}`, { ignore: IGNORE_GLOB })

    const icons = new Set()
    const iconsWithError = new Map<string, ReturnType<typeof extractIconInfoFromFileName>>()

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8')
      const assetImports = findAssetImports(content)

      if (!assetImports || assetImports.length === 0) {
        continue
      }

      for (const { importFull, importPath } of assetImports) {
        try {
          const { iconName, iconSet } = extractIconInfoFromFileName(importPath)

          if (!icons.has(`${iconSet.id}/${iconName}`)) {
            await downloadIconSetFiles(iconSet)

            const iconSetManifestMap = await generateIconSetManifest(iconSet)

            const iconManifest = iconSetManifestMap.get(iconName)

            if (!iconManifest) {
              iconsWithError.set(iconName, { iconName, iconSet })
              continue
            }

            await saveIcons(iconSet, config, [[iconName, iconManifest]])

            icons.add(`${iconSet.id}/${iconName}`)
          }

          const iconNameCamelCase = camelCase(iconSet.id + '-' + iconName, {
            pascalCase: true,
          })

          const relativePath = path.relative(path.dirname(file), config.dirPath).replace(/\\/g, '/')

          console.log({ file, relativePath, iconName })

          content = content.replace(
            importFull,
            `import ${iconNameCamelCase} from '${relativePath}/${iconSet.id}-${iconName}.svg'`
          )
        } catch {
          /* empty */
        }
      }

      fs.writeFileSync(file, content, 'utf8')
    }
    spinner.succeed()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    spinner.fail(error.message)
  }
}

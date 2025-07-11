import { kebabCase } from 'change-case'
import fg from 'fast-glob'
import { findUp } from 'find-up'
import fs from 'fs'
import ora from 'ora'
import path from 'path'

import { ICON_SETS } from './constants/icon-set.js'
import { getConfig } from './config.js'
import { saveIcons } from './icon.js'
import { downloadIconSetFiles, generateIconSetManifest } from './icon-set.js'

const IGNORE_GLOB = ['**/node_modules/**', '**/dist/**', '**/.next/**']

function getReactIconNamedIcons(importStatement: string) {
  const match = importStatement.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]react-icons\/(\w+)['"]/)
  if (match) {
    return {
      iconNames: match[1].split(',').map(name => name.trim()),
      iconSetId: match[2],
    }
  }
}

function getReactIconDefaultIcon(importStatement: string) {
  const match = importStatement.match(/import\s+\w+\s+from\s*['"]react-icons\/(\w+)\/(\w+)['"]/)
  if (match) {
    const iconSetId = match[1]
    const iconName = match[2]

    return { iconNames: [iconName], iconSetId }
  }
}

let reactIconsCliAssetDir: string | undefined
async function getReactIconCliIcon(importStatement: string) {
  if (!reactIconsCliAssetDir) {
    const configPath = await findUp('react-icons.config.json')
    if (!configPath) return

    const file = await fs.promises.readFile(configPath, 'utf-8')
    const parsedFile = JSON.parse(file)

    if (!parsedFile.dir) return

    reactIconsCliAssetDir = parsedFile.dir
  }

  const lastFolder = reactIconsCliAssetDir!.split('/').filter(Boolean).pop()
  if (!lastFolder) return

  const reactIconsCliRegex = new RegExp(
    `import\\s*\\{\\s*([^}]+)\\s*\\}\\s*from\\s*['"][^'"]*/${lastFolder}/[^'"]+['"]`
  )
  const match = importStatement.match(reactIconsCliRegex)
  if (match) {
    const iconName = match[1].trim()
    const iconSetId = iconName.match(/^([A-Z][a-z]+)/)?.[1].toLowerCase()
    if (!iconSetId) return

    return { iconNames: [iconName], iconSetId }
  }
}

async function parseIconFromImportStatement(importStatement: string) {
  return (
    getReactIconNamedIcons(importStatement) ??
    getReactIconDefaultIcon(importStatement) ??
    (await getReactIconCliIcon(importStatement))
  )
}

function getAllFileImports(content: string) {
  const regex = /import\s+.+?\s+from\s+['"]([^'"]+)['"]/g
  const matches: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1]

    if (ICON_SETS.some(set => importPath.toLowerCase().includes(set.id))) {
      matches.push(match[0])
    }
  }

  return matches
}

export async function migrate() {
  const spinner = ora(`Migrating`)

  spinner.start()

  const config = await getConfig()

  const icons = new Set()

  const files = await fg(`${config.configDirPath}/**/*.{ts,js,tsx,jsx}`, { ignore: IGNORE_GLOB })
  for (const file of files) {
    try {
      spinner.text = `Checking file: ${file}`
      spinner.render()

      let content = fs.readFileSync(file, 'utf8')

      const importStatements = getAllFileImports(content)
      if (importStatements.length === 0) {
        continue
      }

      for (const importStatement of importStatements) {
        const icon = await parseIconFromImportStatement(importStatement)
        if (!icon) {
          continue
        }

        const iconSet = ICON_SETS.find(set => set.id === icon.iconSetId)
        if (!iconSet) {
          continue
        }

        let newImport = ''

        for (const iconName of icon.iconNames) {
          const kebabCaseIconName = kebabCase(iconName)
          const iconNameWithoutSetId = kebabCaseIconName.replace(`${iconSet.id}-`, '')

          if (!icons.has(`${iconSet.id}/${iconNameWithoutSetId}`)) {
            await downloadIconSetFiles(iconSet)

            const iconSetManifestMap = await generateIconSetManifest(iconSet)
            const iconManifest = iconSetManifestMap.get(iconNameWithoutSetId)
            if (!iconManifest) {
              continue
            }

            await saveIcons(iconSet, config, [[iconNameWithoutSetId, iconManifest]])

            icons.add(`${iconSet.id}/${iconNameWithoutSetId}`)
          }

          const relativePath = path.relative(path.dirname(file), config.dirPath).replace(/\\/g, '/')

          newImport += `import ${iconName} from '${relativePath}/${kebabCaseIconName}.svg'\n`
        }

        if (newImport) {
          content = content.replace(importStatement, newImport)
        }
      }

      fs.writeFileSync(file, content, 'utf8')
    } catch {
      /* empty */
    }
  }

  spinner.succeed()
}

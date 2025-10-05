import { useEffect } from 'react'
import { kebabCase } from 'change-case'
import fs from 'node:fs/promises'
import path from 'node:path'

import { TEMP_DIR } from '../../constants/general.js'
import { sleep } from '../../utils/helpers.js'
import { TIconSet, TIconSetManifest } from '../../utils/types.js'

type TProps = {
  selectedIconSet: TIconSet
  dirPath: string
  onSubmit: (params: { value: TIconSetManifest }) => void
}

export async function getGeneratedIconSetManifestConfig(iconSet: TIconSet) {
  const iconSetManifestPath = path.join(TEMP_DIR, iconSet.id, 'manifest.json')
  let iconSetManifest: TIconSetManifest = new Map()

  let iconSetManifestAlreadyExist: boolean
  try {
    const iconSetManifestContent = await fs.readFile(iconSetManifestPath, { encoding: 'utf-8' })
    iconSetManifest = new Map(Object.entries(JSON.parse(iconSetManifestContent)))
    iconSetManifestAlreadyExist = true
  } catch {
    iconSetManifestAlreadyExist = false
  }

  return {
    shouldGenerate: !iconSetManifestAlreadyExist,
    filePath: iconSetManifestPath,
    iconSetManifest,
  }
}

export async function generateIconSetManifest(iconSet: TIconSet, filePath: string): Promise<TIconSetManifest> {
  const iconSetManifest: TIconSetManifest = new Map()

  for (const resolver of iconSet.resolvers) {
    const files = await resolver.files(path.join(TEMP_DIR, iconSet.id, 'files', iconSet.source.remoteDir))

    for (const file of files) {
      const fileName = path.basename(file, path.extname(file))
      const name = await resolver.name(kebabCase(fileName), file)

      if (iconSetManifest.has(name)) {
        continue
      }

      iconSetManifest.set(name, file)
    }
  }

  const content = JSON.stringify(Object.fromEntries(iconSetManifest), null, 2)
  await fs.writeFile(filePath, content)

  return iconSetManifest
}

export function GenerateIconSetManifestCommandComponent({ onSubmit, dirPath, selectedIconSet }: TProps) {
  useEffect(() => {
    async function handle() {
      const iconSetManifest = await generateIconSetManifest(selectedIconSet, dirPath)

      await sleep(1000)

      onSubmit({ value: iconSetManifest })
    }

    handle()
  }, [])

  return null
}

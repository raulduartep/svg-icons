import { useEffect } from 'react'
import fs from 'node:fs/promises'
import path from 'node:path'
import svgo from 'svgo'

import { SVGO_CONFIG } from '../../constants/svgo.js'
import { getConfig } from '../../utils/config.js'
import { TIconSet } from '../../utils/types.js'
type TProps = {
  iconSet: TIconSet
  iconSetManifest: Map<string, string>
  iconNames: string[]
  onSubmit: () => void
}

export function SaveIconsCommandComponent({ onSubmit, iconSet, iconSetManifest, iconNames }: TProps) {
  useEffect(() => {
    async function handle() {
      const config = await getConfig()

      for (const iconName of iconNames) {
        const iconFilePath = iconSetManifest.get(iconName)
        if (!iconFilePath) continue

        const rawSvg = await fs.readFile(iconFilePath, 'utf-8')
        const optimizedSvg = svgo.optimize(rawSvg, SVGO_CONFIG)

        await fs.mkdir(config.dirPath, {
          recursive: true,
        })

        await fs.writeFile(path.join(config.dirPath, `${iconSet.id}-${iconName}.svg`), optimizedSvg.data)
      }

      onSubmit()
    }

    handle()
  }, [])

  return null
}

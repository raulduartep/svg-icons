import React, { useEffect } from 'react'

import { Script, useScript } from '../../components/script.js'
import { ensureTempDir } from '../../utils/helpers.js'

import { DownloadIconSetFilesCommandComponent, getDownloadedIconSetFilesConfig } from './download-icon-set-files.js'
import {
  GenerateIconSetManifestCommandComponent,
  getGeneratedIconSetManifestConfig,
} from './generate-icon-set-manifest.js'
import { SaveIconsCommandComponent } from './save-icons.js'
import { SelectIconCommandComponent } from './select-icon.js'
import { SelectIconSetCommandComponent } from './select-icon-set.js'

export function GenerateScript() {
  const scriptApi = useScript()

  const handleRunScript = async () => {
    await ensureTempDir()

    const selectedIconSet = await scriptApi.addCommand({
      id: 'select-icon-set',
      title: 'Select an icon set:',
      component: SelectIconSetCommandComponent,
    })

    const downloadedIconSetConfig = await getDownloadedIconSetFilesConfig(selectedIconSet)

    if (downloadedIconSetConfig.shouldDownload) {
      await scriptApi.addCommand({
        id: 'download-icon-set',
        title: `Downloading icon set ${selectedIconSet.name}…`,
        component: props => (
          <DownloadIconSetFilesCommandComponent
            dirPath={downloadedIconSetConfig.dirPath}
            selectedIconSet={selectedIconSet}
            {...props}
          />
        ),
      })
    }

    const generatedIconSetManifestConfig = await getGeneratedIconSetManifestConfig(selectedIconSet)

    if (generatedIconSetManifestConfig.shouldGenerate) {
      generatedIconSetManifestConfig.iconSetManifest = await scriptApi.addCommand({
        id: 'generate-icon-set-manifest',
        title: `Generating icon set manifest for ${selectedIconSet.name}…∂`,
        component: props => (
          <GenerateIconSetManifestCommandComponent
            dirPath={generatedIconSetManifestConfig.filePath}
            selectedIconSet={selectedIconSet}
            {...props}
          />
        ),
      })
    }

    const iconNames = await scriptApi.addCommand<string[]>({
      id: 'select-icon',
      title: `Select icons from ${selectedIconSet.name}:`,
      component: props => (
        <SelectIconCommandComponent iconSetManifest={generatedIconSetManifestConfig.iconSetManifest} {...props} />
      ),
    })

    await scriptApi.addCommand({
      id: 'save-icons',
      title: `Saving icons from ${selectedIconSet.name}…`,
      component: props => (
        <SaveIconsCommandComponent
          iconSet={selectedIconSet}
          iconSetManifest={generatedIconSetManifestConfig.iconSetManifest}
          iconNames={iconNames}
          {...props}
        />
      ),
    })
  }

  useEffect(() => {
    handleRunScript()
  }, [])

  return <Script api={scriptApi} />
}

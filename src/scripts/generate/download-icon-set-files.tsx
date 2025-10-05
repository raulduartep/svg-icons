import React, { useEffect, useState } from 'react'
import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import { ProgressBar } from '../../components/progress-bar.js'
import { TEMP_DIR } from '../../constants/general.js'
import { sleep, spawnWithProgress, verifyIfPathExist } from '../../utils/helpers.js'
import { TIconSet } from '../../utils/types.js'

type TProps = {
  selectedIconSet: TIconSet
  dirPath: string
  onSubmit: () => void
}

const execFileAsync = promisify(execFile)

export async function getDownloadedIconSetFilesConfig(iconSet: TIconSet) {
  const iconSetDirPath = path.join(TEMP_DIR, iconSet.id)
  const packedIconSetAlreadyExists = await verifyIfPathExist(iconSetDirPath)

  return {
    shouldDownload: !packedIconSetAlreadyExists,
    dirPath: iconSetDirPath,
  }
}

export async function downloadIconSetFiles(
  iconSet: TIconSet,
  iconSetDirPath: string,
  onProgress?: (progress: number) => void
) {
  await fs.mkdir(iconSetDirPath, {
    recursive: true,
  })

  await spawnWithProgress(
    'git',
    ['clone', '--filter=tree:0', '--no-checkout', '--progress', iconSet.source.url, 'files'],
    {
      cwd: iconSetDirPath,
      matchProgressLines: ['Receiving objects:', 'Resolving deltas:'],
    },
    progress => {
      onProgress?.(progress * 0.5)
    }
  )

  const iconSetFilesDirPath = path.join(iconSetDirPath, 'files')
  await execFileAsync('git', ['sparse-checkout', 'set', '--cone', '--skip-checks', iconSet.source.remoteDir], {
    cwd: iconSetFilesDirPath,
  })

  onProgress?.(60)

  await spawnWithProgress(
    'git',
    ['checkout', '--progress', iconSet.source.branch],
    {
      cwd: iconSetFilesDirPath,
      matchProgressLines: ['Updating files:'],
    },
    progress => {
      onProgress?.(60 + progress * 0.4)
    }
  )

  onProgress?.(100)
}

export function DownloadIconSetFilesCommandComponent({ onSubmit, dirPath, selectedIconSet }: TProps) {
  const [downloadIconSetProgress, setDownloadIconSetProgress] = useState(0)

  useEffect(() => {
    async function handle() {
      await downloadIconSetFiles(selectedIconSet, dirPath, progress => {
        setDownloadIconSetProgress(progress)
      })

      await sleep(1000)

      onSubmit()
    }

    handle()
  }, [])

  return <ProgressBar value={downloadIconSetProgress} />
}

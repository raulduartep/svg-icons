import { useEffect } from 'react'
import fs from 'node:fs/promises'

import { TEMP_DIR } from '../../constants/general.js'

type TProps = {
  onSubmit: () => void
}

export function RemoveTempFolderCommandComponent({ onSubmit }: TProps) {
  useEffect(() => {
    async function handle() {
      await fs.rm(TEMP_DIR, { force: true, recursive: true })
      onSubmit()
    }

    handle()
  }, [])

  return null
}

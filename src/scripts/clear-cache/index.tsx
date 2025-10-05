import React, { useEffect } from 'react'

import { Script, useScript } from '../../components/script.js'

import { RemoveTempFolderCommandComponent } from './remove-temp-folder.js'

export function ClearCacheScript() {
  const scriptApi = useScript()

  const handleRunScript = async () => {
    await scriptApi.addCommand({
      id: 'clear-cache',
      title: 'Clearing cache',
      component: RemoveTempFolderCommandComponent,
    })
  }

  useEffect(() => {
    handleRunScript()
  }, [])

  return <Script api={scriptApi} />
}

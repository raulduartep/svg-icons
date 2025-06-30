import { findUp } from 'find-up'
import fs from 'node:fs'
import path from 'node:path'

import { CONFIG_FILE_NAME } from './constants/general.js'
import { TConfig } from './types.js'

export async function getConfig(): Promise<TConfig> {
  const configPath = await findUp(CONFIG_FILE_NAME)
  if (!configPath) {
    console.error(
      `Cannot find the configuration file. Please make sure that ${CONFIG_FILE_NAME} exists in the project root`
    )
    process.exit(1)
  }

  const file = await fs.promises.readFile(configPath, 'utf-8')
  const parsedFile = JSON.parse(file)

  if (!parsedFile.dir) {
    console.error('The configuration file must have a "dir" property')
    process.exit(1)
  }

  return {
    configDirPath: path.dirname(configPath),
    dirPath: path.join(path.dirname(configPath), parsedFile.dir),
  }
}

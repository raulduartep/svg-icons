import fs from 'node:fs/promises'
import ora from 'ora'

import { TEMP_DIR } from './constants/general.js'

export async function clearCache() {
  const spinner = ora(`Clearing cache`).start()

  try {
    await fs.rm(TEMP_DIR, { force: true, recursive: true })
    spinner.succeed('Cache cleared successfully')
  } catch {
    spinner.fail('Failed to clear cache')
  }
}

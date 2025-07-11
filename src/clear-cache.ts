import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import ora from 'ora'

import { TEMP_DIR } from './constants/general.js'

const execFileAsync = promisify(execFile)

export async function clearCache() {
  const spinner = ora(`Clearing cache`).start()

  try {
    await execFileAsync('rm', ['-rf', TEMP_DIR])
    spinner.succeed('Cache cleared successfully')
  } catch {
    spinner.fail('Failed to clear cache')
  }
}

import fs from 'fs/promises'
import inquirer from 'inquirer'

import { TEMP_DIR } from './constants/general.js'

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function ensureTempDir() {
  await fs.mkdir(TEMP_DIR, {
    recursive: true,
  })
}

export async function verifyIfPathExist(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

export async function promptForSelectAgain(): Promise<boolean> {
  const selectedShouldExecAgain = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'value',
      message: 'Again?',
    },
  ])

  return selectedShouldExecAgain.value
}

import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import fg, { Options, Pattern } from 'fast-glob'
import fs from 'fs/promises'

import { TEMP_DIR } from '../constants/general.js'

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

export async function glob(pattern: Pattern, options?: Options) {
  return await fg(pattern.replace(/\\/g, '/'), options)
}

export async function spawnWithProgress(
  command: string,
  args: string[],
  options: { matchProgressLines: string[] } & SpawnOptionsWithoutStdio,
  onProgress?: (progress: number) => void
) {
  await new Promise<void>((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options,
    })

    process.stderr?.on('data', data => {
      const output = data.toString()
      const lines = output.split(/\r|\n/).filter((line: string) => line.trim())

      for (const line of lines) {
        for (const matchProgressLine of options.matchProgressLines) {
          if (line.includes(matchProgressLine)) {
            const progressMatch = line.match(/(\d+)%/)
            if (progressMatch && onProgress) {
              const percentage = parseInt(progressMatch[1], 10)
              onProgress(Math.floor(percentage * (1 / options.matchProgressLines.length)))
            }
          }
        }
      }
    })

    process.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`process failed with code ${code}`))
      }
    })

    process.on('error', reject)
  })
}

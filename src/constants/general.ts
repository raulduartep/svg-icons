import os from 'node:os'
import path from 'node:path'

export const CONFIG_FILE_NAME = 'svg-icons.config.json'
export const TEMP_DIR = path.join(os.tmpdir(), 'svg-icons')

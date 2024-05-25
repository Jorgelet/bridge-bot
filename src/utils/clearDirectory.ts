import fs from 'node:fs'
import path from 'node:path'

export function clearDirectory(directory: string) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    fs.unlinkSync(path.join(directory, file));
  }
}
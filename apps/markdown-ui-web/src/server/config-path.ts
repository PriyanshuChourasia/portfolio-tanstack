import { homedir } from 'node:os'
import { join } from 'node:path'

export function getDefaultConfigPath(): string {
  const platform = process.platform

  if (platform === 'darwin') {
    // macOS
    return join(homedir(), 'Library', 'Application Support', 'Markdown-AI', 'config.json')
  }

  if (platform === 'win32') {
    // Windows
    const appData = process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming')
    return join(appData, 'Markdown-AI', 'config.json')
  }

  // Linux
  const xdgConfigHome = process.env.XDG_CONFIG_HOME
  const linuxConfigDir = xdgConfigHome ?? join(homedir(), '.config')
  return join(linuxConfigDir, 'markdown-ai', 'config.json')
}

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('markdownUI', {
  getDefaultLocation: () => ipcRenderer.invoke('getDefaultLocation'),
  pickLocation: () => ipcRenderer.invoke('pickLocation'),
  readConfig: () => ipcRenderer.invoke('readConfig'),
  writeConfig: (config: unknown) => ipcRenderer.invoke('writeConfig', config),
  listProjects: () => ipcRenderer.invoke('listProjects'),
  readProject: (id: string) => ipcRenderer.invoke('readProject', id),
  writeProject: (id: string, content: string) => ipcRenderer.invoke('writeProject', id, content),
  createProject: (name: string) => ipcRenderer.invoke('createProject', name),
  deleteProject: (id: string) => ipcRenderer.invoke('deleteProject', id),
})

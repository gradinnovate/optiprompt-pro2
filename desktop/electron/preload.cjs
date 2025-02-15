const { contextBridge, ipcRenderer } = require('electron')
const Store = require('electron-store')
const log = require('electron-log')

// Initialize store
const store = new Store()

// Log preload execution
log.info('Preload script executing')

// 檢查全局對象
log.info('Window object keys:', Object.keys(window))
log.info('Document readyState:', document.readyState)

// 監聽 DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  log.info('DOMContentLoaded event fired')
  log.info('Root element exists:', !!document.getElementById('root'))
})

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    handleAuthCallback: (callback) => {
      ipcRenderer.on('auth-callback', (_, token) => callback(token))
    },
    store: {
      get: (key) => store.get(key),
      set: (key, val) => store.set(key, val),
      delete: (key) => store.delete(key)
    },
    ipcRenderer: {
      send: (channel, data) => {
        ipcRenderer.send(channel, data)
      },
      on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    }
  }
)

// Log preload completion
log.info('Preload script completed') 
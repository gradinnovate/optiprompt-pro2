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
    handleAuthCallback: (callback) => {
      ipcRenderer.on('auth-callback', (_, token) => callback(token))
    },
    store: {
      get: (key) => store.get(key),
      set: (key, val) => store.set(key, val),
      delete: (key) => store.delete(key)
    },
    ipcRenderer: {
      invoke: (channel, data) => {
        const validChannels = [
          'find-available-port',
          'start-auth-server',
          'stop-auth-server',
          'open-external'
        ];
        if (validChannels.includes(channel)) {
          return ipcRenderer.invoke(channel, data);
        }
        return Promise.reject(new Error('Invalid channel'));
      },
      on: (channel, func) => {
        const validChannels = ['auth-code-received'];
        if (validChannels.includes(channel)) {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
      },
      once: (channel, func) => {
        const validChannels = ['auth-code-received'];
        if (validChannels.includes(channel)) {
          ipcRenderer.once(channel, (event, ...args) => func(...args));
        }
      }
    }
  }
)

// Log preload completion
log.info('Preload script completed') 
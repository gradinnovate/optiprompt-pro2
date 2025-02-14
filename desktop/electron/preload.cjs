const { contextBridge, ipcRenderer } = require('electron')
const Store = require('electron-store')

// Initialize store
const store = new Store()

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
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
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store')
const isDev = process.env.NODE_ENV === 'development'
const log = require('electron-log')

// Configure logging
log.transports.file.level = isDev ? 'debug' : 'info'
log.transports.console.level = isDev ? 'debug' : 'info'
log.info('App starting...')

// Log important paths
log.info('App paths:', {
  userData: app.getPath('userData'),
  appPath: app.getAppPath(),
  exe: app.getPath('exe')
})

// Handle errors
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error)
  log.error(error.stack)
  app.quit()
})

process.on('unhandledRejection', (error) => {
  log.error('Unhandled Rejection:', error)
  log.error(error.stack)
})

Store.initRenderer()

const store = new Store({
  cwd: app.getPath('userData'),
  name: 'config',
  fileExtension: 'json',
  clearInvalidConfig: true,
  defaults: {
    config: {}
  }
})

function createWindow() {
  log.info('Creating window...')
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
    // Set window style
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: '#1a1b1e',
    show: false  // Don't show the window until it's ready
  })

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    log.info('Window ready to show')
    mainWindow.show()
  })

  // Enable DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  // Load the app
  const indexPath = isDev 
    ? 'http://localhost:5173'
    : path.join(process.resourcesPath, 'dist', 'index.html')
  
  log.info('Loading app from:', indexPath)

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    try {
      mainWindow.loadFile(indexPath)
      log.info('App loaded from:', indexPath)
    } catch (error) {
      log.error('Failed to load index.html:', error)
      log.error(error.stack)
    }
  }

  // Handle loading errors
  mainWindow.webContents.on('did-fail-load', () => {
    log.error('Failed to load app')
    log.error('Current URL:', mainWindow.webContents.getURL())
    if (!isDev) {
      // Try to reload once before quitting
      mainWindow.reload()
    }
  })

  // Handle page title updates
  mainWindow.webContents.on('did-finish-load', () => {
    log.info('Page loaded successfully')
    log.info('Current URL:', mainWindow.webContents.getURL())
  })

  // Handle rendering errors
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    log.error('Render process gone:', details)
    if (!isDev) {
      app.quit()
    }
  })

  // Handle window errors
  mainWindow.webContents.on('crashed', () => {
    log.error('Window crashed')
    if (!isDev) {
      app.quit()
    }
  })

  // Handle window close
  mainWindow.on('closed', () => {
    log.info('Window closed')
  })

  // Handle window controls
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize()
  })

  ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('close-window', () => {
    mainWindow.close()
  })

  // 添加 webContents 載入完成的處理
  mainWindow.webContents.on('dom-ready', () => {
    log.info('DOM ready')
    // 如果需要，可以在這裡執行其他初始化
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 
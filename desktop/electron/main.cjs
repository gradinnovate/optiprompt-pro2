const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const Store = require('electron-store')
const isDev = process.env.NODE_ENV === 'development'
const log = require('electron-log')
const http = require('http')
const net = require('net')

let mainWindow = null
let authServer = null

// Configure logging
log.transports.file.level = isDev ? 'debug' : 'info'
log.transports.console.level = isDev ? 'debug' : 'info'
log.info('App starting...')

// Log important paths
log.info('App paths:', {
  userData: app.getPath('userData'),
  appPath: app.getAppPath(),
  resourcesPath: process.resourcesPath,
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

// 註冊自定義協議
app.setAsDefaultProtocolClient('optiprompt')

// 處理 deep linking URL
// macOS 處理 deep linking
app.on('open-url', (event, url) => {
  event.preventDefault()
  log.info('Deep link URL:', url)
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
    mainWindow.webContents.send('auth-callback', url)
  }
})

// Windows 處理 deep linking
if (process.platform === 'win32') {
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine) => {
      const url = commandLine.pop()
      log.info('Deep link URL from second instance:', url)
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
        mainWindow.webContents.send('auth-callback', url)
      }
    })
  }
}

// 尋找可用的 port
async function findAvailablePort(start, end) {
  for (let port = start; port <= end; port++) {
    try {
      const server = net.createServer()
      await new Promise((resolve, reject) => {
        server.listen(port, () => {
          server.close(() => resolve())
        })
        server.on('error', reject)
      })
      return port
    } catch {
      continue
    }
  }
  throw new Error('No available ports found')
}

// 處理 IPC 事件
ipcMain.handle('find-available-port', async (_, { start, end }) => {
  return await findAvailablePort(start, end)
})

ipcMain.handle('start-auth-server', async (event, { port }) => {
  authServer = http.createServer((req, res) => {
    if (req.url?.startsWith('/getauthcode')) {
      const url = new URL(req.url, `http://localhost:${port}`)
      const code = url.searchParams.get('code')

      if (code) {
        event.sender.send('auth-code-received', code)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('<html><body><h1>Authorization Successful</h1><p>You can close this window now.</p></body></html>')
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('No authorization code received')
      }
    }
  })

  await new Promise((resolve, reject) => {
    authServer.listen(port, () => {
      console.log(`Auth server running at http://localhost:${port}`)
      resolve()
    })
    authServer.on('error', reject)
  })
})

ipcMain.handle('stop-auth-server', async () => {
  if (authServer) {
    await new Promise(resolve => authServer.close(resolve))
    authServer = null
  }
})

// 處理外部鏈接
ipcMain.handle('open-external', async (_, url) => {
  try {
    console.log('Opening external URL:', url);
    await shell.openExternal(url);
    console.log('External URL opened successfully');
    return true;
  } catch (error) {
    console.error('Failed to open external URL:', error);
    return false;
  }
})

function createWindow() {
  log.info('Creating window...')
  mainWindow = new BrowserWindow({
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
    titleBarStyle: 'Inset',
    //trafficLightPosition: { x: 20, y: 20 },
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
    : path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html')
  
  log.info('Loading app from:', indexPath)

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    try {
      mainWindow.loadFile(indexPath, {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true
      })
      
      // 在生產環境也開啟開發者工具以便調試
      mainWindow.webContents.openDevTools()
      
      // 監聽更多事件
      mainWindow.webContents.on('console-message', (event, level, message) => {
        log.info('Console:', message)
      })

      mainWindow.webContents.on('did-start-loading', () => {
        log.info('Started loading')
      })

      mainWindow.webContents.on('did-stop-loading', () => {
        log.info('Stopped loading')
      })

      mainWindow.webContents.on('did-finish-load', () => {
        log.info('Finished loading')
        // 檢查頁面內容
        mainWindow.webContents.executeJavaScript(`
          console.log('Document body:', document.body.innerHTML);
          console.log('Root element:', document.getElementById('root'));
        `)
      })

      // 添加錯誤處理
      mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        log.error('Failed to load:', errorCode, errorDescription)
      })
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
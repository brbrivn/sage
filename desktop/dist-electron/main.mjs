import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}
else {
    if (process.defaultApp) {
        if (process.argv.length >= 2) {
            app.setAsDefaultProtocolClient('sage-app', process.execPath, [path.resolve(process.argv[1])]);
        }
    }
    else {
        app.setAsDefaultProtocolClient('sage-app');
    }
}
let mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173').catch(() => {
            setTimeout(() => mainWindow?.loadURL('http://localhost:5173'), 1000);
        });
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}
// Store pending deep link if window is not ready
let pendingDeepLink = null;
function handleDeepLink(url) {
    console.log('[Main] Received deep link:', url);
    if (url.startsWith('sage-app://')) {
        const pathAndQuery = url.replace('sage-app://', '');
        console.log('[Main] Sending to renderer:', pathAndQuery);
        if (mainWindow && mainWindow.webContents && !mainWindow.webContents.isLoading()) {
            mainWindow.webContents.send('deep-link', pathAndQuery);
        }
        else {
            console.log('[Main] Window not ready, queuing deep link');
            pendingDeepLink = pathAndQuery;
        }
    }
}
// Add to createWindow or whenReady to check for pending link
app.whenReady().then(() => {
    createWindow();
    // Check if we have a pending link after window creation (and load)
    mainWindow?.webContents.on('did-finish-load', () => {
        if (pendingDeepLink) {
            console.log('[Main] Window loaded, sending pending deep link:', pendingDeepLink);
            mainWindow?.webContents.send('deep-link', pendingDeepLink);
            pendingDeepLink = null;
        }
    });
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
// Handle deep links for Windows/MSIX
app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
        if (mainWindow.isMinimized())
            mainWindow.restore();
        mainWindow.focus();
        // Protocol handler for Windows
        const url = commandLine.pop();
        if (url)
            handleDeepLink(url);
    }
});
// Handle deep links for macOS
app.on('open-url', (event, url) => {
    event.preventDefault();
    handleDeepLink(url);
});

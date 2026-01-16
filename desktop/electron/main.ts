import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('sage-app', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('sage-app');
}

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
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
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handle deep links for Windows/MSIX
app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();

        // Protocol handler for Windows
        const url = commandLine.pop();
        if (url) handleDeepLink(url);
    }
});

// Handle deep links for macOS
app.on('open-url', (event, url) => {
    event.preventDefault();
    handleDeepLink(url);
});

function handleDeepLink(url: string) {
    if (url.startsWith('sage-app://')) {
        const pathAndQuery = url.replace('sage-app://', '');
        // Inform the renderer process about the new URL
        if (mainWindow) {
            mainWindow.webContents.send('deep-link', pathAndQuery);
        }
    }
}

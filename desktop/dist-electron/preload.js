import { contextBridge, shell, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    openExternal: (url) => shell.openExternal(url),
    onDeepLink: (callback) => {
        ipcRenderer.on('deep-link', (_event, url) => callback(url));
    }
});

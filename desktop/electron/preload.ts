import { contextBridge, shell, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    openExternal: (url: string) => shell.openExternal(url),
    onDeepLink: (callback: (url: string) => void) => {
        ipcRenderer.on('deep-link', (_event, url) => callback(url));
    }
});

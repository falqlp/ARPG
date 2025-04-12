import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('udp', {
    send: (message: string, port: number, host: string) => ipcRenderer.send('send-udp', { message, port, host }),
    onMessage: (callback: (msg: string) => void) => ipcRenderer.on('udp-message', (_event, msg) => callback(msg))
});
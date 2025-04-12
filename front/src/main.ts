import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import dgram from 'dgram';

function createWindow() {
    const win = new BrowserWindow({
        height: 10000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadURL('http://localhost:5173');
    return win;
}

app.whenReady().then(() => {
    createWindow();

    const udpSocket = dgram.createSocket('udp4');

    ipcMain.on('send-udp', (_event, { message, port, host }: { message: string, port: number, host: string }) => {
        udpSocket.send(Buffer.from(message), port, host);
    });

    udpSocket.on('message', (msg, _rinfo) => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
            win.webContents.send('udp-message', msg.toString());
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

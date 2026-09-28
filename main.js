const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 1000,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#020617',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  if (!app.isPackaged) {
    console.log('Mode développement : recherche de mise à jour désactivée.');
  } else {
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      console.log('Recherche de mise à jour impossible :', err.message);
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
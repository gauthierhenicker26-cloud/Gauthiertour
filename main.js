const { app, BrowserWindow, dialog } = require('electron');
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

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    console.log('Recherche de mise à jour...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Mise à jour disponible :', info.version);

    dialog.showMessageBox({
      type: 'info',
      title: 'GAUTHIERTOURS',
      message: `Une nouvelle version (${info.version}) est disponible.`,
      detail: 'La mise à jour va être téléchargée automatiquement.'
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('GAUTHIERTOURS est déjà à jour :', info.version);
  });

  autoUpdater.on('download-progress', (progress) => {
    console.log(`Téléchargement : ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Mise à jour téléchargée :', info.version);

    dialog.showMessageBox({
      type: 'info',
      title: 'GAUTHIERTOURS',
      message: `La version ${info.version} est prête.`,
      detail: 'Le jeu va redémarrer pour installer la mise à jour.'
    }).then(() => {
      autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', (error) => {
    console.error('Erreur de mise à jour :', error);

    dialog.showMessageBox({
      type: 'error',
      title: 'Mise à jour',
      message: 'La recherche de mise à jour a rencontré un problème.',
      detail: error.message
    });
  });

  autoUpdater.checkForUpdates().catch((error) => {
    console.error('Impossible de vérifier les mises à jour :', error);
  });
}

app.whenReady().then(() => {
  createWindow();

  if (app.isPackaged) {
    setupAutoUpdater();
  } else {
    console.log('Mode développement : mise à jour désactivée.');
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
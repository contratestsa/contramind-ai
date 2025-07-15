const { ipcMain, shell } = require('electron');

class AuthManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.setupIPCHandlers();
  }

  setupIPCHandlers() {
    // Check if user is authenticated
    ipcMain.handle('auth:check', async () => {
      // For now, check if we have a session cookie
      const cookies = await this.mainWindow.webContents.session.cookies.get({
        url: 'http://localhost:5000'
      });
      
      const hasSession = cookies.some(cookie => cookie.name === 'connect.sid');
      return { authenticated: hasSession };
    });

    // Open login in browser
    ipcMain.handle('auth:login', async () => {
      // Open the web login page in default browser
      shell.openExternal('http://localhost:5000');
      return { success: true };
    });

    // Clear session
    ipcMain.handle('auth:logout', async () => {
      // Clear all cookies
      await this.mainWindow.webContents.session.clearStorageData();
      return { success: true };
    });
  }
}

module.exports = AuthManager;
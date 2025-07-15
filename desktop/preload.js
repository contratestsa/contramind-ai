const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // System info
  platform: process.platform,
  
  // IPC communication
  send: (channel, data) => {
    // Whitelist channels
    const validChannels = ['minimize', 'maximize', 'close', 'reload'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  receive: (channel, func) => {
    const validChannels = ['theme-change', 'update-available'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize'),
  maximizeWindow: () => ipcRenderer.send('maximize'),
  closeWindow: () => ipcRenderer.send('close'),
  
  // App info
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Authentication
  auth: {
    check: () => ipcRenderer.invoke('auth:check'),
    login: () => ipcRenderer.invoke('auth:login'),
    logout: () => ipcRenderer.invoke('auth:logout'),
  }
});
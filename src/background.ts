/* eslint-disable @typescript-eslint/no-empty-function */
'use strict';

import { app, protocol, BrowserWindow, globalShortcut } from 'electron';
const path = require('path')
import {
  createProtocol
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';

const isDevelopment = process.env.NODE_ENV !== 'production';

let win: BrowserWindow | null;
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
]);

function createWindow() {
  win = new BrowserWindow({
    width: 950,
    height: 600,
    webPreferences:{
      // 在vue里面要引入electron里面的内容需要用到这俩
      nodeIntegration:true,
      contextIsolation: false
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('http://localhost:8080');
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', async () => {
  // 这里注释掉是因为会安装tools插件，需要屏蔽掉，有能力的话可以打开注释
  // if (isDevelopment && !process.env.IS_TEST) {
  //   try {
  //     await installVueDevtools();
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString());
  //   }
  // }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
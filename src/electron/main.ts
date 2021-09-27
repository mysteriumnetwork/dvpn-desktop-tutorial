import * as path from "path"
import * as url from "url"
import { app, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";

import { supervisor } from "./node/supervisor"
import { mysteriumNode } from "./node/mysteriumNode"

let mainWindow:BrowserWindow|null;

const appInstanceLock = app.requestSingleInstanceLock();

export const getMainWindow = (): BrowserWindow | null => {
  return mainWindow
}

const createWindow = async (): Promise<BrowserWindow> => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 650,
    height: 600,
    title: "Mysterium dVPN Tutorial",
    resizable: false,
    show: true,
    frame: true,
    backgroundColor: "#282c34",
    webPreferences: {
      webSecurity:false,                 // We need to disable CORS check to be able to connect to Tequila API
      nodeIntegration: true,             // We can use Node.js in renderer process
      experimentalFeatures: true,
      nativeWindowOpen: true,           
      contextIsolation: false,           // We can use Electron context in renderer process, so no need for contextBridge
    },
  });

  if (isDev) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  win.on("close", (event) => {
    mainWindow = null;
  });
  win.on("closed", () => {
    mainWindow = null;
  });

  win.webContents.on("devtools-opened", () => {
    win.focus();
    setImmediate(() => {
      win.focus();
    });
  });
  return win;
}

if (!appInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", async () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
    }
  });

  // create main BrowserWindow when electron is ready
  app.on("ready", async () => {
    mainWindow = await createWindow();
    supervisor.registerIPC()
    mysteriumNode.registerIPC(getMainWindow)
  });
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(() => {
  app.on("activate", async () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow == null) {
      mainWindow = await createWindow();
    }
    mainWindow.show();
  });
});

app.on("before-quit", async () => {
  await mysteriumNode.stop();
  await supervisor.disconnect();
});



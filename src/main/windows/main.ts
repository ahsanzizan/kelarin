import { BrowserWindow } from "electron";
import { join } from "node:path";

import { createWindow } from "lib/electron-app/factories/windows/create";
import { ENVIRONMENT } from "shared/constants";
import { displayName } from "~/package.json";

export async function MainWindow() {
  const window = createWindow({
    id: "main",
    title: displayName,
    width: 1280,
    height: 720,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    alwaysOnTop: false,
    transparent: false,
    resizable: true,
    show: false,
    center: true,
    movable: true,
    autoHideMenuBar: true,

    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
    },
  });

  window.webContents.on("did-finish-load", () => {
    if (ENVIRONMENT.IS_DEV) {
      window.webContents.openDevTools({ mode: "detach" });
    }

    window.show();
  });

  window.on("close", () => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.destroy();
    }
  });

  return window;
}

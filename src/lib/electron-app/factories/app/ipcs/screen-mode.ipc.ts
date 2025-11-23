import { type BrowserWindow, ipcMain } from "electron";

export function registerScreenModeIpcHandlers(window: BrowserWindow) {
  ipcMain.on("switch-to-sticky-mode", () => {
    if (!window) return;
    window.setAlwaysOnTop(true, "screen-saver");
    window.setSize(320, 420);
    window.setMinimumSize(250, 300);
    window.setResizable(true);
    window.setSkipTaskbar(true);
  });

  ipcMain.on("switch-to-general-mode", () => {
    if (!window) return;
    window.setAlwaysOnTop(false);
    window.setSize(1024, 700);
    window.setMinimumSize(600, 400);
    window.setResizable(true);
    window.setSkipTaskbar(false);
  });

  ipcMain.on("window:minimize", () => window.minimize());
  ipcMain.on("window:maximize", () => {
    window.isMaximized() ? window.unmaximize() : window.maximize();
  });
  ipcMain.on("window:close", () => window.close());
}

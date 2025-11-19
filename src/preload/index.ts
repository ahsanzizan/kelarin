import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    App: typeof API;
  }
}

const API = {
  sayHelloFromBridge: () => console.log("\nHello from bridgeAPI! 👋\n\n"),
  username: process.env.USER,

  // IPC exposed functions
  switchToStickyMode: () => ipcRenderer.send("switch-to-sticky-mode"),
  switchToGeneralMode: () => ipcRenderer.send("switch-to-general-mode"),
};

contextBridge.exposeInMainWorld("App", API);

import { contextBridge, ipcRenderer } from "electron";
import type { Board } from "main/database/schema";
import type { IpcHandlerPayload } from "shared/types";

declare global {
  interface Window {
    App: typeof API;
  }
}

type CredentialsPayload = {
  username: string;
  password: string;
};

type SessionSnapshot = {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
    createdAt: string;
  } | null;
};

const API = {
  log: (message?: any) => console.log(message),

  // Screens
  screen: {
    switchToStickyMode: () => ipcRenderer.send("switch-to-sticky-mode"),
    switchToGeneralMode: () => ipcRenderer.send("switch-to-general-mode"),
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),
  },

  // Authentications
  auth: {
    register: (
      payload: CredentialsPayload
    ): Promise<IpcHandlerPayload<SessionSnapshot>> =>
      ipcRenderer.invoke("auth:register", payload),
    login: (
      payload: CredentialsPayload
    ): Promise<IpcHandlerPayload<SessionSnapshot>> =>
      ipcRenderer.invoke("auth:login", payload),
    getSession: (): Promise<IpcHandlerPayload<SessionSnapshot>> =>
      ipcRenderer.invoke("auth:get-session"),
    logout: (): Promise<IpcHandlerPayload<SessionSnapshot>> =>
      ipcRenderer.invoke("auth:logout"),
  },

  // Boards
  boards: {
    getAll: (): Promise<IpcHandlerPayload<Board[]>> =>
      ipcRenderer.invoke("board:getAll"),
  },
};

contextBridge.exposeInMainWorld("App", API);

import { contextBridge, ipcRenderer } from "electron";
import type {
  Board,
  BoardWithTasks,
  CredentialsPayload,
  IpcHandlerPayload,
  SessionSnapshot,
} from "shared/types";
import { BoardSchema } from "shared/validations/board";

declare global {
  interface Window {
    App: typeof API;
  }
}

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
    getAll: (): Promise<IpcHandlerPayload<BoardWithTasks[]>> =>
      ipcRenderer.invoke("board:getAll"),
    upsert: (payload: BoardSchema): Promise<IpcHandlerPayload<Board>> =>
      ipcRenderer.invoke("board:upsert", payload),
    delete: (payload: number): Promise<IpcHandlerPayload<undefined>> =>
      ipcRenderer.invoke("board:delete", payload),
  },
};

contextBridge.exposeInMainWorld("App", API);

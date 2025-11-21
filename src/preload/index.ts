import { contextBridge, ipcRenderer } from "electron";
import { IpcHandlerPayload } from "shared/types";

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
  username: process.env.USER,

  // IPC exposed functions
  switchToStickyMode: () => ipcRenderer.send("switch-to-sticky-mode"),
  switchToGeneralMode: () => ipcRenderer.send("switch-to-general-mode"),

  // Authentications
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
};

contextBridge.exposeInMainWorld("App", API);

import type { BrowserWindow, IpcMainInvokeEvent } from "electron";

import type { registerRoute } from "lib/electron-router-dom";

export type BrowserWindowOrNull = Electron.BrowserWindow | null;

type Route = Parameters<typeof registerRoute>[0];

export interface WindowProps extends Electron.BrowserWindowConstructorOptions {
  id: Route["id"];
  query?: Route["query"];
}

export interface WindowCreationByIPC {
  channel: string;
  window(): BrowserWindowOrNull;
  callback(window: BrowserWindow, event: IpcMainInvokeEvent): void;
}

export interface LocalUser {
  id: number;
  username: string;
  createdAt: string;
}

export interface SessionSnapshot {
  isAuthenticated: boolean;
  user: LocalUser | null;
}

export interface CredentialsPayload {
  username: string;
  password: string;
}

export interface IpcHandlerPayload<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

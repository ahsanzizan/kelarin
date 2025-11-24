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

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface SessionSnapshot {
  isAuthenticated: boolean;
  user: Omit<User, "passwordHash"> | null;
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

export interface Board {
  id: number;
  title: string;
  description: string;
  isArchived: boolean;
  color: string;
  createdAt: string;
  user: number | null;
}

export type BoardWithTasks = Board & { tasks: Task[] };

export interface Task {
  id: number;
  title: string;
  createdAt: string;
  notes: string;
  state: "backlog" | "this week" | "today" | "done";
  estimatedDuration: number;
  durationTaken: number;
  finishedAt: string | null;
  board: number | null;
}

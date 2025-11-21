import { ipcMain } from "electron";

import {
  CredentialsPayload,
  IpcHandlerPayload,
  SessionSnapshot,
} from "shared/types";
import {
  getCurrentSession,
  loginLocalAccount,
  logoutLocalAccount,
  registerLocalAccount,
} from "./service";

let isRegistered = false;

export function registerAuthIpcHandlers() {
  if (isRegistered) return;

  ipcMain.handle(
    "auth:register",
    async (
      _event,
      payload: CredentialsPayload
    ): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = registerLocalAccount(payload);
        return { ok: true, data };
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We couldn't finish that request. Please try again.",
        };
      }
    }
  );

  ipcMain.handle(
    "auth:login",
    async (
      _event,
      payload: CredentialsPayload
    ): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = loginLocalAccount(payload);
        return { ok: true, data };
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We couldn't finish that request. Please try again.",
        };
      }
    }
  );

  ipcMain.handle(
    "auth:get-session",
    async (): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = getCurrentSession();
        return { ok: true, data };
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We couldn't finish that request. Please try again.",
        };
      }
    }
  );

  ipcMain.handle(
    "auth:logout",
    async (): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = logoutLocalAccount();
        return { ok: true, data };
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We couldn't finish that request. Please try again.",
        };
      }
    }
  );

  isRegistered = true;
}

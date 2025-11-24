import { ipcMain } from "electron";
import type {
  CredentialsPayload,
  IpcHandlerPayload,
  SessionSnapshot,
} from "shared/types";
import { AuthService } from "../services/auth.service";

export function registerAuthIpcHandlers() {
  const authService = new AuthService();

  ipcMain.handle(
    "auth:register",
    async (
      _event,
      payload: CredentialsPayload
    ): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = await authService.register(payload);
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
        const data = await authService.login(payload);
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
        const data = await authService.getCurrentSession();
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
        const data = await authService.logout();
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
}

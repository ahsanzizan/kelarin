import { ipcMain } from 'electron'
import type {
  CredentialsPayload,
  IpcHandlerPayload,
  SessionSnapshot,
} from 'shared/types'
import {
  getCurrentSession,
  login,
  logout,
  register,
} from '../services/auth.service'

export function registerAuthIpcHandlers() {
  ipcMain.handle(
    'auth:register',
    async (
      _event,
      payload: CredentialsPayload
    ): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = register(payload)
        return { ok: true, data }
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We couldn't finish that request. Please try again.",
        }
      }
    }
  )

  ipcMain.handle(
    'auth:login',
    async (
      _event,
      payload: CredentialsPayload
    ): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = login(payload)
        return { ok: true, data }
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We couldn't finish that request. Please try again.",
        }
      }
    }
  )

  ipcMain.handle(
    'auth:get-session',
    async (): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = getCurrentSession()
        return { ok: true, data }
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We couldn't finish that request. Please try again.",
        }
      }
    }
  )

  ipcMain.handle(
    'auth:logout',
    async (): Promise<IpcHandlerPayload<SessionSnapshot>> => {
      try {
        const data = logout()
        return { ok: true, data }
      } catch (error) {
        return {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "We couldn't finish that request. Please try again.",
        }
      }
    }
  )
}

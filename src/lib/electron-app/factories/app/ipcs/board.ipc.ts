import { ipcMain } from 'electron'
import type { Board } from 'main/database/schema'
import type { IpcHandlerPayload } from 'shared/types'
import { getBoards } from '../services/board.service'

export function registerBoardIpcHandlers() {
  ipcMain.handle(
    'board:getAll',
    async (_event): Promise<IpcHandlerPayload<Board[]>> => {
      try {
        const data = getBoards()
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

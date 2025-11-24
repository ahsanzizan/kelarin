import { ipcMain } from "electron";
import { BoardWithTasks } from "main/database/repositories/board.repository";
import type { IpcHandlerPayload } from "shared/types";
import { BoardService } from "../services/board.service";

export function registerBoardIpcHandlers() {
  const boardService = new BoardService();

  ipcMain.handle(
    "board:getAll",
    async (_event): Promise<IpcHandlerPayload<BoardWithTasks[]>> => {
      try {
        const data = await boardService.getUserBoardsWithTasks();
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

import { ipcMain } from "electron";
import { BoardWithTasks } from "main/database/repositories/board.repository";
import type { Board, IpcHandlerPayload } from "shared/types";
import { BoardSchema } from "shared/validations/board";
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

  ipcMain.handle(
    "board:upsert",
    async (_event, payload: BoardSchema): Promise<IpcHandlerPayload<Board>> => {
      try {
        let data: Board;
        const { id, ...updatePayload } = payload;
        if (id === undefined) {
          data = await boardService.createBoard(payload);
        } else {
          const updateResult = await boardService.updateBoard(
            id,
            updatePayload
          );
          if (updateResult === null) {
            throw new Error("Update result is null.");
          }

          data = updateResult;
        }
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
    "board:delete",
    async (_event, id: number): Promise<IpcHandlerPayload<Board>> => {
      try {
        await boardService.deleteBoard(id);
        return { ok: true };
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

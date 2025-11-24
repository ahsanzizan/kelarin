import { BoardRepository } from "main/database/repositories/board.repository";
import { NewBoard } from "main/database/schema";
import { AuthService } from "./auth.service";

export class BoardService {
  private readonly boardRepo: BoardRepository;
  private readonly authService: AuthService;

  constructor() {
    this.boardRepo = new BoardRepository();
    this.authService = new AuthService();
  }

  async getUserBoards(includeArchived = false) {
    const userId = await this.getUserId();
    return await this.boardRepo.findAllByUser(userId, includeArchived);
  }

  async getUserBoardsWithTasks(tasksPerBoard = 3) {
    const userId = await this.getUserId();
    return await this.boardRepo.findAllByUserWithTasks(
      userId,
      false,
      tasksPerBoard
    );
  }

  async getBoardById(boardId: number) {
    const userId = await this.getUserId();
    const board = await this.boardRepo.findByIdAndUser(boardId, userId);

    if (!board) {
      throw new Error("Board not found or access denied");
    }

    return board;
  }

  async getBoardWithTasks(boardId: number) {
    const userId = await this.getUserId();
    const board = await this.boardRepo.findByIdWithTasks(boardId, userId);

    if (!board) {
      throw new Error("Board not found or access denied");
    }

    return board;
  }

  async createBoard(data: Omit<NewBoard, "user">) {
    const userId = await this.getUserId();
    const boardData: NewBoard = {
      ...data,
      user: userId,
    };

    return await this.boardRepo.create(boardData);
  }

  async updateBoard(boardId: number, data: Partial<NewBoard>) {
    const userId = await this.getUserId();
    const board = await this.boardRepo.findByIdAndUser(boardId, userId);
    if (!board) {
      throw new Error("Board not found or access denied");
    }

    return await this.boardRepo.update(boardId, data);
  }

  async archiveBoard(boardId: number) {
    const userId = await this.getUserId();
    const success = await this.boardRepo.archive(boardId, userId);

    if (!success) {
      throw new Error("Failed to archive board or board not found");
    }

    return { success: true };
  }

  async deleteBoard(boardId: number) {
    const userId = await this.getUserId();
    const success = await this.boardRepo.delete(boardId, userId);

    if (!success) {
      throw new Error("Failed to delete board or board not found");
    }

    return { success: true };
  }

  private async getUserId() {
    const session = await this.authService.getCurrentSession();

    if (!session.user) {
      throw new Error("Please login first before accessing board.");
    }

    const { user } = session;
    return user.id;
  }
}

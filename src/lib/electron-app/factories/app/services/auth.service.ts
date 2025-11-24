import bcrypt from "bcryptjs";
import { SessionRepository } from "main/database/repositories/session.repository";
import { UserRepository } from "main/database/repositories/user.repository";
import type { CredentialsPayload } from "shared/types";

const BCRYPT_ROUNDS = 12;

export class AuthService {
  private readonly userRepo: UserRepository;
  private readonly sessionRepo: SessionRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.sessionRepo = new SessionRepository();
  }

  async getCurrentSession() {
    const session = await this.sessionRepo.get();

    if (!session?.userId) {
      return { isAuthenticated: false, user: null };
    }

    const user = await this.userRepo.findById(session.userId);

    if (!user) {
      this.sessionRepo.clear();
      return { isAuthenticated: false, user: null };
    }

    const { passwordHash, ...mappedUser } = user;

    return { isAuthenticated: true, user: mappedUser };
  }

  async register(payload: CredentialsPayload) {
    const { username, password } = this.sanitizeCredentials(payload);

    const existingUser = await this.userRepo.findByUsername(username);

    if (existingUser) {
      throw new Error("That username is already taken.");
    }

    const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    const user = await this.userRepo.create({ username, passwordHash });

    await this.sessionRepo.setUser(user.id);

    return this.getCurrentSession();
  }

  async login(payload: CredentialsPayload) {
    const { username, password } = this.sanitizeCredentials(payload);

    const user = await this.userRepo.findByUsername(username);

    if (!user) {
      throw new Error("We couldn't find an account with that username.");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error("Incorrect password.");
    }

    this.sessionRepo.setUser(user.id);

    return this.getCurrentSession();
  }

  async logout() {
    this.sessionRepo.clear();
    return { isAuthenticated: false, user: null };
  }

  private sanitizeCredentials(payload: CredentialsPayload) {
    const username = payload.username.trim();
    const password = payload.password.trim();

    if (username.length < 3 || username.length > 48) {
      throw new Error("Usernames must be between 3 and 48 characters.");
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      throw new Error(
        "Usernames can only include letters, numbers, dots, underscores, or hyphens."
      );
    }

    if (password.length < 8) {
      throw new Error("Passwords must be at least 8 characters long.");
    }

    return { username, password };
  }
}

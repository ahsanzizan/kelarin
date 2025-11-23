import bcrypt from 'bcryptjs'
import { sessionRepository } from 'main/database/repositories/session.repository'
import { userRepository } from 'main/database/repositories/user.repository'
import type {
  CredentialsPayload,
  LocalUser,
  SessionSnapshot,
} from 'shared/types'

const BCRYPT_ROUNDS = 12

export function getCurrentSession(): SessionSnapshot {
  const session = sessionRepository.get()

  if (!session?.userId) {
    return { isAuthenticated: false, user: null }
  }

  const user = userRepository.findById(session.userId)

  if (!user) {
    sessionRepository.clear()
    return { isAuthenticated: false, user: null }
  }

  return { isAuthenticated: true, user: mapUser(user) }
}

export function register(payload: CredentialsPayload): SessionSnapshot {
  const { username, password } = sanitizeCredentials(payload)

  const existingUser = userRepository.findByUsername(username)

  if (existingUser) {
    throw new Error('That username is already taken.')
  }

  const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS)
  const user = userRepository.create({ username, passwordHash })

  sessionRepository.setUser(user.id)

  return getCurrentSession()
}

export function login(payload: CredentialsPayload): SessionSnapshot {
  const { username, password } = sanitizeCredentials(payload)

  const user = userRepository.findByUsername(username)

  if (!user) {
    throw new Error("We couldn't find an account with that username.")
  }

  const isValidPassword = bcrypt.compareSync(password, user.passwordHash)

  if (!isValidPassword) {
    throw new Error('Incorrect password.')
  }

  sessionRepository.setUser(user.id)

  return getCurrentSession()
}

export function logout(): SessionSnapshot {
  sessionRepository.clear()
  return { isAuthenticated: false, user: null }
}

function sanitizeCredentials(payload: CredentialsPayload): CredentialsPayload {
  const username = payload.username.trim()
  const password = payload.password.trim()

  if (username.length < 3 || username.length > 48) {
    throw new Error('Usernames must be between 3 and 48 characters.')
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    throw new Error(
      'Usernames can only include letters, numbers, dots, underscores, or hyphens.'
    )
  }

  if (password.length < 8) {
    throw new Error('Passwords must be at least 8 characters long.')
  }

  return { username, password }
}

function mapUser(user: {
  id: number
  username: string
  createdAt: string
}): LocalUser {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  }
}

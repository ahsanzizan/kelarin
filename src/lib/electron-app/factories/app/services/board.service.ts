import { boardRepository } from 'main/database/repositories/board.repository'
import { getCurrentSession } from './auth.service'

export function getBoards() {
  const { user } = getCurrentSession()
  if (!user) {
    throw new Error('User is not authenticated.')
  }

  const boards = boardRepository.findAll(user.id)
  return boards
}

import Database from 'better-sqlite3'
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { app } from 'electron'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import * as schema from './schema/'

let db: BetterSQLite3Database<typeof schema> | null = null
let sqlite: Database.Database | null = null

function ensureAppReady() {
  if (!app.isReady()) {
    throw new Error('App must be ready before accessing database')
  }
}

function getDatabasePath() {
  const dir = app.getPath('userData')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return join(dir, 'app.db')
}

function getMigrationsPath() {
  // In production, migrations are bundled with the app
  // In development, they're in the project directory
  if (app.isPackaged) {
    return join(process.resourcesPath, 'drizzle')
  }
  // In development, use the project root (where drizzle folder is)
  // app.getAppPath() points to the built output, so we need to go up
  const projectRoot = process.cwd()
  return join(projectRoot, 'drizzle')
}

function createConnection() {
  ensureAppReady()

  sqlite = new Database(getDatabasePath())
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('synchronous = NORMAL')

  const database = drizzle(sqlite, { schema })

  // Run migrations if the migrations folder exists
  const migrationsPath = getMigrationsPath()
  const metaPath = join(migrationsPath, 'meta', '_journal.json')

  if (existsSync(metaPath)) {
    try {
      migrate(database, { migrationsFolder: migrationsPath })
    } catch (error) {
      console.error('Migration error:', error)
      // Continue anyway - the schema might already be up to date
    }
  } else {
    console.warn(
      `Migrations folder not found at ${migrationsPath}. Run 'drizzle-kit generate' to create migrations.`
    )
  }

  return database
}

export function getDb() {
  db ??= createConnection()
  return db
}

export function closeDb() {
  sqlite?.close()
  sqlite = null
  db = null
}

export { schema }

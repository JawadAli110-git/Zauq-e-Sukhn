const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../zauq-e-sukhn.db');

let db;

const connectDB = () => {
  try {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // ── Users ──────────────────────────────────────────────────────────────────
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        name      TEXT    NOT NULL,
        email     TEXT    NOT NULL UNIQUE,
        password  TEXT    NOT NULL,
        role      TEXT    NOT NULL DEFAULT 'user',
        favorites TEXT    NOT NULL DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ── Poets ──────────────────────────────────────────────────────────────────
    db.exec(`
      CREATE TABLE IF NOT EXISTS poets (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL,
        name_urdu   TEXT NOT NULL,
        bio         TEXT,
        bio_urdu    TEXT,
        era         TEXT,
        era_urdu    TEXT,
        style       TEXT,
        style_urdu  TEXT,
        image_url   TEXT DEFAULT '',
        is_active   INTEGER NOT NULL DEFAULT 1,
        created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ── Poetry ─────────────────────────────────────────────────────────────────
    db.exec(`
      CREATE TABLE IF NOT EXISTS poetry (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        title          TEXT,
        title_urdu     TEXT,
        type           TEXT,
        poet_id        INTEGER REFERENCES poets(id),
        content        TEXT NOT NULL,
        content_lines  TEXT NOT NULL DEFAULT '[]',
        language       TEXT NOT NULL DEFAULT 'urdu',
        tags           TEXT NOT NULL DEFAULT '[]',
        is_featured    INTEGER NOT NULL DEFAULT 0,
        view_count     INTEGER NOT NULL DEFAULT 0,
        created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ── Courses ────────────────────────────────────────────────────────────────
    db.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        title            TEXT NOT NULL,
        title_urdu       TEXT NOT NULL,
        description      TEXT,
        description_urdu TEXT,
        order_num        INTEGER NOT NULL DEFAULT 0,
        lessons          TEXT NOT NULL DEFAULT '[]',
        is_published     INTEGER NOT NULL DEFAULT 1,
        created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ── Qafiya ─────────────────────────────────────────────────────────────────
    db.exec(`
      CREATE TABLE IF NOT EXISTS qafiya (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        word          TEXT NOT NULL,
        word_urdu     TEXT NOT NULL,
        meaning       TEXT,
        meaning_urdu  TEXT,
        ending_sound  TEXT,
        examples      TEXT NOT NULL DEFAULT '[]',
        related_words TEXT NOT NULL DEFAULT '[]',
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ── Migrations ─────────────────────────────────────────────────────────────
    // Add password-reset columns if they don't exist yet
    const cols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
    if (!cols.includes('reset_token')) {
      db.exec(`ALTER TABLE users ADD COLUMN reset_token TEXT`);
    }
    if (!cols.includes('reset_token_expires')) {
      db.exec(`ALTER TABLE users ADD COLUMN reset_token_expires INTEGER`);
    }

    console.log(`SQLite connected: ${DB_PATH}`);
  } catch (err) {
    console.error(`SQLite connection error: ${err.message}`);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };

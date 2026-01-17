import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { app } from 'electron';
import { formatISO } from 'date-fns';

export type DatabaseHandle = Database.Database;

const DB_FILE = 'planejamento.db';

let dbInstance: DatabaseHandle | null = null;

const todayIso = () => formatISO(new Date(), { representation: 'date' });

export const getDbPath = () => {
  const dbDir = path.join(app.getPath('userData'), 'db');
  const dbPath = path.join(dbDir, DB_FILE);
  return { dbDir, dbPath };
};

export const initDb = () => {
  if (dbInstance) {
    return dbInstance;
  }

  const { dbDir, dbPath } = getDbPath();
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const isNew = !fs.existsSync(dbPath);
  dbInstance = new Database(dbPath);
  dbInstance.pragma('journal_mode = WAL');

  if (isNew) {
    createSchema(dbInstance);
    seedInitialData(dbInstance);
  } else {
    createSchema(dbInstance);
  }

  return dbInstance;
};

const createSchema = (db: DatabaseHandle) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS os_base (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      os_numero TEXT UNIQUE NOT NULL,
      descricao TEXT,
      descricao_posicao TEXT,
      previsao_inicio TEXT,
      previsao_termino TEXT,
      inicio_efetivo TEXT,
      termino_efetivo TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS equipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL,
      data_base TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS planejamento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_id INTEGER NOT NULL,
      os_numero TEXT NOT NULL,
      ordem INTEGER NOT NULL,
      tempo_execucao INTEGER NOT NULL DEFAULT 1,
      inicio_previsto TEXT,
      fim_previsto TEXT,
      tipo TEXT,
      observacoes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (equipe_id) REFERENCES equipes(id)
    );

    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT
    );
  `);
};

const seedInitialData = (db: DatabaseHandle) => {
  const now = formatISO(new Date());
  const stmt = db.prepare(`
    INSERT INTO equipes (nome, data_base, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run('Equipe 1', todayIso(), now, now);
};

export const getDb = () => {
  if (!dbInstance) {
    return initDb();
  }
  return dbInstance;
};

export const insertConfigValue = (key: string, value: string | null) => {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO config (key, value)
    VALUES (@key, @value)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  stmt.run({ key, value });
};

export const getConfigValue = (key: string) => {
  const db = getDb();
  return db.prepare('SELECT value FROM config WHERE key = ?').get(key) as
    | { value: string }
    | undefined;
};

export const removeConcludedFromPlanning = () => {
  const db = getDb();
  const concluded = db
    .prepare(
      `
      SELECT os_numero FROM os_base
      WHERE inicio_efetivo IS NOT NULL AND inicio_efetivo != ''
        AND termino_efetivo IS NOT NULL AND termino_efetivo != ''
    `
    )
    .all() as { os_numero: string }[];

  if (concluded.length === 0) {
    return 0;
  }

  const placeholders = concluded.map(() => '?').join(',');
  const deleteStmt = db.prepare(
    `DELETE FROM planejamento WHERE os_numero IN (${placeholders})`
  );
  const result = deleteStmt.run(concluded.map((item) => item.os_numero));
  return result.changes;
};

export const recalcPlanejamentoEquipe = (equipeId: number) => {
  const db = getDb();
  const equipe = db
    .prepare('SELECT data_base FROM equipes WHERE id = ?')
    .get(equipeId) as { data_base: string } | undefined;

  if (!equipe) {
    return;
  }

  const rows = db
    .prepare(
      'SELECT id, tempo_execucao FROM planejamento WHERE equipe_id = ? ORDER BY ordem ASC'
    )
    .all(equipeId) as { id: number; tempo_execucao: number }[];

  let cursor = new Date(equipe.data_base);
  const update = db.prepare(
    'UPDATE planejamento SET inicio_previsto = ?, fim_previsto = ?, updated_at = ? WHERE id = ?'
  );
  const now = formatISO(new Date());

  for (const row of rows) {
    const start = formatISO(cursor, { representation: 'date' });
    const endDate = new Date(cursor);
    endDate.setDate(endDate.getDate() + Math.max(row.tempo_execucao, 1));
    const end = formatISO(endDate, { representation: 'date' });
    update.run(start, end, now, row.id);
    cursor = endDate;
  }
};

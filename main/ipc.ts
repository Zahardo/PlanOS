import { dialog, ipcMain } from 'electron';
import { formatISO } from 'date-fns';
import * as XLSX from 'xlsx';
import {
  getDb,
  getConfigValue,
  insertConfigValue,
  recalcPlanejamentoEquipe,
  removeConcludedFromPlanning
} from './db';

const REQUIRED_COLUMNS = [
  'os_numero',
  'descricao',
  'descricao_posicao',
  'previsao_inicio',
  'previsao_termino',
  'inicio_efetivo',
  'termino_efetivo'
];

export const registerIpcHandlers = () => {
  ipcMain.handle('db:init', () => {
    getDb();
    return { ok: true };
  });

  ipcMain.handle('osBase:list', () => {
    const db = getDb();
    return db.prepare('SELECT * FROM os_base ORDER BY os_numero').all();
  });

  ipcMain.handle('osBase:update', (_event, payload) => {
    const db = getDb();
    const now = formatISO(new Date());
    db.prepare(
      `\n      UPDATE os_base\n      SET descricao = @descricao,\n          descricao_posicao = @descricao_posicao,\n          previsao_inicio = @previsao_inicio,\n          previsao_termino = @previsao_termino,\n          inicio_efetivo = @inicio_efetivo,\n          termino_efetivo = @termino_efetivo,\n          updated_at = @updated_at\n      WHERE os_numero = @os_numero\n    `\n    ).run({ ...payload, updated_at: now });

    if (payload.inicio_efetivo && payload.termino_efetivo) {
      removeConcludedFromPlanning();
    }

    return { ok: true };
  });

  ipcMain.handle('osBase:importExcel', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Excel', extensions: ['xlsx', 'xls'] }]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { imported: 0, removed: 0 };
    }

    const filePath = result.filePaths[0];
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number | null>>(
      sheet,
      { defval: null }
    );

    const header = Object.keys(rows[0] ?? {}).map((key) => key.trim());
    const missing = REQUIRED_COLUMNS.filter((col) => !header.includes(col));
    if (missing.length > 0) {
      throw new Error(`Colunas obrigatórias ausentes: ${missing.join(', ')}`);
    }

    const db = getDb();
    const now = formatISO(new Date());
    const insert = db.prepare(`
      INSERT INTO os_base (
        os_numero,
        descricao,
        descricao_posicao,
        previsao_inicio,
        previsao_termino,
        inicio_efetivo,
        termino_efetivo,
        created_at,
        updated_at
      ) VALUES (
        @os_numero,
        @descricao,
        @descricao_posicao,
        @previsao_inicio,
        @previsao_termino,
        @inicio_efetivo,
        @termino_efetivo,
        @created_at,
        @updated_at
      )
    `);

    const transaction = db.transaction(() => {
      db.prepare('DELETE FROM os_base').run();
      for (const row of rows) {
        insert.run({
          os_numero: String(row.os_numero ?? '').trim(),
          descricao: row.descricao ?? null,
          descricao_posicao: row.descricao_posicao ?? null,
          previsao_inicio: row.previsao_inicio ?? null,
          previsao_termino: row.previsao_termino ?? null,
          inicio_efetivo: row.inicio_efetivo ?? null,
          termino_efetivo: row.termino_efetivo ?? null,
          created_at: now,
          updated_at: now
        });
      }
    });

    transaction();

    const removed = removeConcludedFromPlanning();
    return { imported: rows.length, removed };
  });

  ipcMain.handle('osBase:exportExcel', async () => {
    const result = await dialog.showSaveDialog({
      defaultPath: 'os_base.xlsx',
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    });

    if (result.canceled || !result.filePath) {
      return { exported: 0 };
    }

    const db = getDb();
    const rows = db.prepare('SELECT * FROM os_base').all();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OS');
    XLSX.writeFile(workbook, result.filePath);

    return { exported: rows.length };
  });

  ipcMain.handle('planejamento:exportExcel', async () => {
    const result = await dialog.showSaveDialog({
      defaultPath: 'planejamento.xlsx',
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    });

    if (result.canceled || !result.filePath) {
      return { exported: 0 };
    }

    const db = getDb();
    const rows = db
      .prepare(
        `\n        SELECT p.*, e.nome as equipe_nome, o.descricao, o.descricao_posicao\n        FROM planejamento p\n        LEFT JOIN equipes e ON e.id = p.equipe_id\n        LEFT JOIN os_base o ON o.os_numero = p.os_numero\n        ORDER BY e.id, p.ordem\n      `\n      )
      .all();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planejamento');
    XLSX.writeFile(workbook, result.filePath);

    return { exported: rows.length };
  });

  ipcMain.handle('cronograma:exportExcel', async () => {
    const result = await dialog.showSaveDialog({
      defaultPath: 'cronograma.xlsx',
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    });

    if (result.canceled || !result.filePath) {
      return { exported: 0 };
    }

    const db = getDb();
    const rows = db
      .prepare(
        `\n        SELECT e.nome as equipe, p.os_numero, p.inicio_previsto, p.fim_previsto, p.tipo\n        FROM planejamento p\n        LEFT JOIN equipes e ON e.id = p.equipe_id\n        ORDER BY e.id, p.ordem\n      `\n      )
      .all();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cronograma');
    XLSX.writeFile(workbook, result.filePath);

    return { exported: rows.length };
  });

  ipcMain.handle('planejamento:listByEquipe', (_event, equipeId: number) => {
    const db = getDb();
    return db
      .prepare(
        `
        SELECT p.*, o.descricao, o.descricao_posicao
        FROM planejamento p
        LEFT JOIN os_base o ON o.os_numero = p.os_numero
        WHERE p.equipe_id = ?
        ORDER BY p.ordem ASC
      `
      )
      .all(equipeId);
  });

  ipcMain.handle('planejamento:addItem', (_event, payload) => {
    const db = getDb();
    const now = formatISO(new Date());
    const stmt = db.prepare(`
      INSERT INTO planejamento (
        equipe_id,
        os_numero,
        ordem,
        tempo_execucao,
        inicio_previsto,
        fim_previsto,
        tipo,
        observacoes,
        created_at,
        updated_at
      ) VALUES (
        @equipe_id,
        @os_numero,
        @ordem,
        @tempo_execucao,
        @inicio_previsto,
        @fim_previsto,
        @tipo,
        @observacoes,
        @created_at,
        @updated_at
      )
    `);

    stmt.run({
      ...payload,
      created_at: now,
      updated_at: now
    });

    recalcPlanejamentoEquipe(payload.equipe_id);
    return { ok: true };
  });

  ipcMain.handle('planejamento:updateItem', (_event, payload) => {
    const db = getDb();
    const now = formatISO(new Date());
    const stmt = db.prepare(`
      UPDATE planejamento
      SET tempo_execucao = @tempo_execucao,
          tipo = @tipo,
          observacoes = @observacoes,
          updated_at = @updated_at
      WHERE id = @id
    `);

    stmt.run({ ...payload, updated_at: now });
    recalcPlanejamentoEquipe(payload.equipe_id);
    return { ok: true };
  });

  ipcMain.handle('planejamento:reorder', (_event, payload) => {
    const db = getDb();
    const now = formatISO(new Date());
    const update = db.prepare(
      'UPDATE planejamento SET ordem = ?, updated_at = ? WHERE id = ?'
    );

    const transaction = db.transaction(() => {
      for (const item of payload.items) {
        update.run(item.ordem, now, item.id);
      }
    });

    transaction();
    recalcPlanejamentoEquipe(payload.equipe_id);
    return { ok: true };
  });

  ipcMain.handle('planejamento:removeItem', (_event, payload) => {
    const db = getDb();
    db.prepare('DELETE FROM planejamento WHERE id = ?').run(payload.id);
    recalcPlanejamentoEquipe(payload.equipe_id);
    return { ok: true };
  });

  ipcMain.handle('equipes:list', () => {
    const db = getDb();
    return db.prepare('SELECT * FROM equipes ORDER BY id ASC').all();
  });

  ipcMain.handle('equipes:create', (_event, nome: string) => {
    const db = getDb();
    const now = formatISO(new Date());
    const stmt = db.prepare(`
      INSERT INTO equipes (nome, data_base, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(nome, formatISO(new Date(), { representation: 'date' }), now, now);
    return { id: info.lastInsertRowid };
  });

  ipcMain.handle('equipes:update', (_event, payload) => {
    const db = getDb();
    const now = formatISO(new Date());
    db.prepare('UPDATE equipes SET nome = ?, data_base = ?, updated_at = ? WHERE id = ?').run(
      payload.nome,
      payload.data_base,
      now,
      payload.id
    );
    recalcPlanejamentoEquipe(payload.id);
    return { ok: true };
  });

  ipcMain.handle('equipes:delete', (_event, id: number) => {
    const db = getDb();
    const transaction = db.transaction(() => {
      db.prepare('DELETE FROM planejamento WHERE equipe_id = ?').run(id);
      db.prepare('DELETE FROM equipes WHERE id = ?').run(id);
    });
    transaction();
    return { ok: true };
  });

  ipcMain.handle('config:setLogo', (_event, logoPath: string | null) => {
    insertConfigValue('caminho_logo', logoPath);
    return { ok: true };
  });

  ipcMain.handle('config:get', (_event, key: string) => {
    const row = getConfigValue(key);
    return row?.value ?? null;
  });

  ipcMain.handle('db:reset', async () => {
    const db = getDb();
    db.exec('DELETE FROM os_base; DELETE FROM planejamento;');
    return { ok: true };
  });
};

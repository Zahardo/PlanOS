export type PlanejamentoItem = {
  id: number;
  equipe_id: number;
  os_numero: string;
  ordem: number;
  tempo_execucao: number;
  inicio_previsto: string | null;
  fim_previsto: string | null;
  tipo: string | null;
  observacoes: string | null;
  descricao?: string | null;
  descricao_posicao?: string | null;
};

export type Equipe = {
  id: number;
  nome: string;
  data_base: string;
};

export type OsBase = {
  id: number;
  os_numero: string;
  descricao: string | null;
  descricao_posicao: string | null;
  previsao_inicio: string | null;
  previsao_termino: string | null;
  inicio_efetivo: string | null;
  termino_efetivo: string | null;
};

declare global {
  interface Window {
    api: {
      dbInit: () => Promise<{ ok: boolean }>;
      osBaseList: () => Promise<OsBase[]>;
      osBaseUpdate: (payload: unknown) => Promise<{ ok: boolean }>;
      osBaseImportExcel: () => Promise<{ imported: number; removed: number }>;
      osBaseExportExcel: () => Promise<{ exported: number }>;
      planejamentoListByEquipe: (equipeId: number) => Promise<PlanejamentoItem[]>;
      planejamentoAddItem: (payload: unknown) => Promise<{ ok: boolean }>;
      planejamentoUpdateItem: (payload: unknown) => Promise<{ ok: boolean }>;
      planejamentoReorder: (payload: unknown) => Promise<{ ok: boolean }>;
      planejamentoRemoveItem: (payload: unknown) => Promise<{ ok: boolean }>;
      planejamentoExportExcel: () => Promise<{ exported: number }>;
      equipesList: () => Promise<Equipe[]>;
      equipesCreate: (nome: string) => Promise<{ id: number }>;
      equipesUpdate: (payload: unknown) => Promise<{ ok: boolean }>;
      equipesDelete: (id: number) => Promise<{ ok: boolean }>;
      configSetLogo: (logoPath: string | null) => Promise<{ ok: boolean }>;
      configGet: (key: string) => Promise<string | null>;
      dbReset: () => Promise<{ ok: boolean }>;
      cronogramaExportExcel: () => Promise<{ exported: number }>;
    };
  }
}

export {};

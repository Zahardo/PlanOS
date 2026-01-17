import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import PageShell from '../components/PageShell';
import DataTable from '../components/DataTable';
import type { OsBase } from '../types/ipc';

const BaseOSPage = () => {
  const [data, setData] = useState<OsBase[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [query, setQuery] = useState('');
  const [importInfo, setImportInfo] = useState<string | null>(null);

  const loadData = async () => {
    const list = await window.api.osBaseList();
    setData(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = useMemo<ColumnDef<OsBase>[]>(
    () => [
      { header: 'OS', accessorKey: 'os_numero' },
      { header: 'Descrição', accessorKey: 'descricao' },
      { header: 'Descrição da Posição', accessorKey: 'descricao_posicao' },
      { header: 'Previsão Início', accessorKey: 'previsao_inicio' },
      { header: 'Previsão Término', accessorKey: 'previsao_termino' },
      { header: 'Início Efetivo', accessorKey: 'inicio_efetivo' },
      { header: 'Término Efetivo', accessorKey: 'termino_efetivo' },
      {
        header: 'Situação',
        cell: ({ row }) => {
          const inicio = row.original.inicio_efetivo;
          const termino = row.original.termino_efetivo;
          const status = !inicio
            ? 'Planejada'
            : inicio && !termino
              ? 'Em Execução'
              : 'Concluída';
          const badge =
            status === 'Planejada'
              ? 'bg-slate-100 text-slate-600'
              : status === 'Em Execução'
                ? 'bg-brand-500/10 text-brand-800'
                : 'bg-green-100 text-green-700';
          return (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
              {status}
            </span>
          );
        }
      }
    ],
    []
  );

  const filtered = data.filter((row) => {
    const search = query.toLowerCase();
    return (
      row.os_numero.toLowerCase().includes(search) ||
      (row.descricao ?? '').toLowerCase().includes(search) ||
      (row.descricao_posicao ?? '').toLowerCase().includes(search)
    );
  });

  const handleImport = async () => {
    const confirm = window.confirm(
      'Substituir base atual? Esta ação apaga a base anterior.'
    );
    if (!confirm) return;
    const result = await window.api.osBaseImportExcel();
    await loadData();
    setImportInfo(
      `${result.imported} OS importadas. ${result.removed} removidas do planejamento.`
    );
  };

  const handleExport = async () => {
    await window.api.osBaseExportExcel();
  };

  return (
    <PageShell>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-brand-900">Chamados / OS - CTJL</h3>
          <p className="text-sm text-slate-500">
            Importação, substituição completa e gestão da base de OS.
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            className="rounded-xl border border-brand-800 px-4 py-2 text-sm font-semibold text-brand-800"
            onClick={handleExport}
          >
            Exportar Base (Excel)
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            className="rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleImport}
          >
            Importar Base (Excel)
          </motion.button>
        </div>
      </section>

      {importInfo && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {importInfo}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por OS, descrição ou posição"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
            />
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400">
              {filtered.length} resultados
            </div>
          </div>
          <DataTable
            data={filtered}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>
        <aside className="space-y-4 rounded-3xl bg-white p-5 shadow-card">
          <h4 className="text-sm font-semibold text-brand-900">Filtros rápidos</h4>
          {[
            'Estado/Situação',
            'Semana / Fim de semana',
            'Prioridade',
            'Sensor/Grupo',
            'Técnica'
          ].map((label) => (
            <div key={label}>
              <label className="text-xs text-slate-400">{label}</label>
              <input
                placeholder="Selecionar"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-slate-400">Período</label>
            <div className="mt-2 flex gap-2">
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Data inicial" />
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Data final" />
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
};

export default BaseOSPage;

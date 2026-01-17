import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell';
import type { Equipe, PlanejamentoItem } from '../types/ipc';

const CronogramaPage = () => {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [rows, setRows] = useState<Record<number, PlanejamentoItem[]>>({});

  useEffect(() => {
    const load = async () => {
      const equipesData = await window.api.equipesList();
      setEquipes(equipesData);
      const entries = await Promise.all(
        equipesData.map(async (equipe) => {
          const items = await window.api.planejamentoListByEquipe(equipe.id);
          return [equipe.id, items] as const;
        })
      );
      setRows(Object.fromEntries(entries));
    };

    load();
  }, []);

  return (
    <PageShell>
      <section className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-brand-900">Cronograma de Atividades</h3>
          <p className="text-sm text-slate-500">
            Visão geral por equipes com exportação para Excel.
          </p>
        </div>
        <button
          onClick={() => window.api.cronogramaExportExcel()}
          className="rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
        >
          Exportar Cronograma
        </button>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {equipes.map((equipe) => (
          <div key={equipe.id} className="rounded-3xl bg-white p-5 shadow-card">
            <h4 className="text-sm font-semibold text-brand-900">{equipe.nome}</h4>
            <div className="mt-4 space-y-3">
              {(rows[equipe.id] ?? []).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="text-xs font-semibold text-brand-800">OS {item.os_numero}</p>
                  <p className="text-sm text-slate-500">
                    {item.inicio_previsto ?? '-'} → {item.fim_previsto ?? '-'}
                  </p>
                </div>
              ))}
              {(rows[equipe.id] ?? []).length === 0 && (
                <p className="text-sm text-slate-400">Sem OS programadas.</p>
              )}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
};

export default CronogramaPage;

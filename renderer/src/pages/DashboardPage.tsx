import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageShell from '../components/PageShell';

const DashboardPage = () => {
  const [totals, setTotals] = useState({ os: 0, planejamento: 0, concluidas: 0 });

  useEffect(() => {
    const load = async () => {
      const osBase = await window.api.osBaseList();
      const equipes = await window.api.equipesList();
      const planejamento = await Promise.all(
        equipes.map((equipe) => window.api.planejamentoListByEquipe(equipe.id))
      );
      const planejadas = planejamento.flat();
      const concluidas = osBase.filter(
        (item) => item.inicio_efetivo && item.termino_efetivo
      );

      setTotals({
        os: osBase.length,
        planejamento: planejadas.length,
        concluidas: concluidas.length
      });
    };

    load();
  }, []);

  return (
    <PageShell>
      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { label: 'Total de OS na base', value: totals.os },
          { label: 'Total em planejamento', value: totals.planejamento },
          { label: 'Concluídas', value: totals.concluidas }
        ].map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-white p-6 shadow-card"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-brand-900">
              {card.value}
            </p>
          </motion.div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-brand-900">
            Visão geral do dia
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Acompanhe o status diário das equipes e próximos andames planejados.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {['Equipe 1', 'Equipe 2'].map((team) => (
              <div key={team} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase text-slate-400">{team}</p>
                <p className="mt-3 text-sm text-slate-500">
                  4 OS planejadas · 1 em execução
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-brand-800 p-6 text-white shadow-card">
          <h3 className="text-lg font-semibold">Indicadores rápidos</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>80% dentro do prazo semanal</li>
            <li>12 OS aguardando aprovação</li>
            <li>3 equipes com fila cheia</li>
          </ul>
          <button className="mt-6 w-full rounded-xl bg-accent-500 py-2 text-sm font-semibold text-brand-900">
            Ver detalhes
          </button>
        </div>
      </section>
    </PageShell>
  );
};

export default DashboardPage;

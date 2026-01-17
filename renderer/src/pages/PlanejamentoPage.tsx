import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageShell from '../components/PageShell';
import type { Equipe, PlanejamentoItem } from '../types/ipc';

const PlanejamentoPage = () => {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [items, setItems] = useState<PlanejamentoItem[]>([]);
  const [newEquipe, setNewEquipe] = useState('');

  const loadEquipes = async () => {
    const list = await window.api.equipesList();
    setEquipes(list);
    if (list.length > 0 && selected === null) {
      setSelected(list[0].id);
    }
  };

  const loadItems = async (equipeId: number) => {
    const list = await window.api.planejamentoListByEquipe(equipeId);
    setItems(list);
  };

  useEffect(() => {
    loadEquipes();
  }, []);

  useEffect(() => {
    if (selected) {
      loadItems(selected);
    }
  }, [selected]);

  const handleCreateEquipe = async () => {
    if (!newEquipe.trim()) return;
    await window.api.equipesCreate(newEquipe.trim());
    setNewEquipe('');
    await loadEquipes();
  };

  return (
    <PageShell>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-brand-900">Planejamento por Equipe</h3>
          <p className="text-sm text-slate-500">
            Arraste e reorganize as filas com recalculo automático das datas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.api.planejamentoExportExcel()}
            className="rounded-xl border border-brand-800 px-4 py-2 text-sm font-semibold text-brand-800"
          >
            Exportar Planejamento
          </button>
          <input
            value={newEquipe}
            onChange={(event) => setNewEquipe(event.target.value)}
            placeholder="Nova equipe"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <motion.button
            whileHover={{ y: -2 }}
            className="rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleCreateEquipe}
          >
            + Nova Equipe
          </motion.button>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {equipes.map((equipe) => (
          <button
            key={equipe.id}
            onClick={() => setSelected(equipe.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selected === equipe.id
                ? 'bg-brand-800 text-white'
                : 'bg-white text-brand-800'
            }`}
          >
            {equipe.nome}
          </button>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-brand-900">Fila de programação</h4>
          <button className="rounded-xl border border-brand-800 px-4 py-2 text-sm font-semibold text-brand-800">
            Adicionar OS na fila
          </button>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                {[
                  'Ordem',
                  'OS',
                  'Descrição',
                  'Tempo Execução',
                  'Início Previsto',
                  'Fim Previsto',
                  'Tipo',
                  'Observações'
                ].map((col) => (
                  <th key={col} className="px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                    Nenhuma OS adicionada na fila desta equipe.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <motion.tr
                    key={item.id}
                    layout
                    className="border-t border-slate-100 even:bg-slate-50/70"
                  >
                    <td className="px-4 py-3 font-semibold text-brand-800">
                      {item.ordem}
                    </td>
                    <td className="px-4 py-3">{item.os_numero}</td>
                    <td className="px-4 py-3">{item.descricao ?? '-'}</td>
                    <td className="px-4 py-3">{item.tempo_execucao} dias</td>
                    <td className="px-4 py-3">{item.inicio_previsto ?? '-'}</td>
                    <td className="px-4 py-3">{item.fim_previsto ?? '-'}</td>
                    <td className="px-4 py-3">{item.tipo ?? 'Montagem'}</td>
                    <td className="px-4 py-3">{item.observacoes ?? '-'}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
};

export default PlanejamentoPage;

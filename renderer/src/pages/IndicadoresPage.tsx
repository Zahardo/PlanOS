import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import PageShell from '../components/PageShell';

const IndicadoresPage = () => {
  const barData = useMemo(
    () => [
      { name: 'Seg', value: 12 },
      { name: 'Ter', value: 9 },
      { name: 'Qua', value: 15 },
      { name: 'Qui', value: 7 },
      { name: 'Sex', value: 10 }
    ],
    []
  );

  const pieData = useMemo(
    () => [
      { name: 'Planejadas', value: 60 },
      { name: 'Em Execução', value: 25 },
      { name: 'Concluídas', value: 15 }
    ],
    []
  );

  return (
    <PageShell>
      <section>
        <h3 className="text-2xl font-semibold text-brand-900">Indicadores</h3>
        <p className="text-sm text-slate-500">
          KPIs com filtros por período, equipe e setor.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h4 className="text-sm font-semibold text-brand-900">
            OS por dia na semana
          </h4>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1F6FFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h4 className="text-sm font-semibold text-brand-900">
            Distribuição de status
          </h4>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" fill="#F4B000" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default IndicadoresPage;

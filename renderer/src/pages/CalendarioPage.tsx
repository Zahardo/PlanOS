import { useMemo } from 'react';
import PageShell from '../components/PageShell';

const CalendarioPage = () => {
  const days = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);

  return (
    <PageShell>
      <section>
        <h3 className="text-2xl font-semibold text-brand-900">Calendário</h3>
        <p className="text-sm text-slate-500">
          Visualize OS planejadas por dia com cores de montagem/desmontagem.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card">
        <div className="grid grid-cols-7 gap-3 text-xs font-semibold text-slate-400">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-7 gap-3">
          {days.map((day) => (
            <div key={day} className="rounded-2xl border border-slate-100 p-3">
              <p className="text-xs font-semibold text-brand-900">{day}</p>
              <div className="mt-2 space-y-2 text-xs">
                <span className="block rounded-full bg-green-100 px-2 py-1 text-green-700">
                  Montagem (2)
                </span>
                <span className="block rounded-full bg-red-100 px-2 py-1 text-red-600">
                  Desmontagem (1)
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default CalendarioPage;

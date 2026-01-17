import { useState } from 'react';
import PageShell from '../components/PageShell';

const ConfiguracoesPage = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const path = (file as File & { path?: string }).path;
    await window.api.configSetLogo(path ?? null);
    setStatus('Logo atualizada com sucesso.');
  };

  const handleReset = async () => {
    await window.api.dbReset();
    setStatus('Base local resetada com sucesso.');
  };

  return (
    <PageShell>
      <section>
        <h3 className="text-2xl font-semibold text-brand-900">Configurações</h3>
        <p className="text-sm text-slate-500">
          Personalize logo, tema e preferências locais.
        </p>
      </section>

      {status && (
        <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 px-4 py-3 text-sm text-brand-800">
          {status}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h4 className="text-sm font-semibold text-brand-900">Logo da empresa</h4>
          <p className="mt-2 text-sm text-slate-500">
            Faça upload de uma logo em PNG ou SVG para aplicar no menu e no header.
          </p>
          <input
            type="file"
            accept="image/png,image/svg+xml"
            className="mt-4 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            onChange={handleLogo}
          />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h4 className="text-sm font-semibold text-brand-900">Resetar base local</h4>
          <p className="mt-2 text-sm text-slate-500">
            Apaga os dados locais do planejamento e OS. Use com cuidado.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Resetar base
          </button>
        </div>
      </section>
    </PageShell>
  );
};

export default ConfiguracoesPage;

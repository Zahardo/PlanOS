import { useEffect, useState } from 'react';

const LogoBlock = () => {
  const [logoPath, setLogoPath] = useState<string | null>(null);

  useEffect(() => {
    window.api.configGet('caminho_logo').then(setLogoPath);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
        {logoPath ? (
          <img src={logoPath} alt="Logo" className="h-10 w-10 object-contain" />
        ) : (
          <span className="text-lg font-semibold text-accent-500">OS</span>
        )}
      </div>
      <div>
        <p className="text-sm uppercase tracking-widest text-white/60">
          Planejamento
        </p>
        <h1 className="text-xl font-semibold">PlanOS</h1>
      </div>
    </div>
  );
};

export default LogoBlock;

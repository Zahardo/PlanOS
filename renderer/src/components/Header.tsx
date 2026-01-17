import { Bell, Search } from 'lucide-react';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b border-white/70 bg-white px-6 py-4 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-brand-900">{title}</h2>
        <p className="text-sm text-slate-500">
          Planejamento e gerenciamento diário de andames
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
          <Search size={16} />
          Buscar OS, equipe, status...
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-800 text-white">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;

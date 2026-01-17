import { NavLink } from 'react-router-dom';
import {
  CalendarRange,
  ChartPie,
  ClipboardList,
  Home,
  LayoutGrid,
  Layers3,
  Settings
} from 'lucide-react';
import LogoBlock from './LogoBlock';

const navItems = [
  { to: '/dashboard', label: 'Início', icon: Home },
  { to: '/planejamento', label: 'Planejamento', icon: Layers3 },
  { to: '/base-os', label: 'Base de OS', icon: ClipboardList },
  { to: '/cronograma', label: 'Cronograma', icon: LayoutGrid },
  { to: '/indicadores', label: 'Indicadores', icon: ChartPie },
  { to: '/calendario', label: 'Calendário', icon: CalendarRange },
  { to: '/configuracoes', label: 'Configurações', icon: Settings }
];

const Sidebar = () => {
  return (
    <aside className="flex w-72 flex-col bg-brand-900 text-white shadow-xl">
      <div className="px-6 py-6">
        <LogoBlock />
      </div>
      <nav className="flex-1 px-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-6 pb-6 text-xs text-white/50">
        PlanOS Desktop · Offline First
      </div>
    </aside>
  );
};

export default Sidebar;

import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardPage from './DashboardPage';
import BaseOSPage from './BaseOSPage';
import PlanejamentoPage from './PlanejamentoPage';
import CronogramaPage from './CronogramaPage';
import IndicadoresPage from './IndicadoresPage';
import CalendarioPage from './CalendarioPage';
import ConfiguracoesPage from './ConfiguracoesPage';
import LoadingScreen from '../components/LoadingScreen';

const App = () => {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    window.api.dbInit().then(() => {
      if (mounted) {
        setIsReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/base-os')) return 'Base de OS';
    if (location.pathname.startsWith('/planejamento')) return 'Planejamento por Equipe';
    if (location.pathname.startsWith('/cronograma')) return 'Cronograma';
    if (location.pathname.startsWith('/indicadores')) return 'Indicadores';
    if (location.pathname.startsWith('/calendario')) return 'Calendário';
    if (location.pathname.startsWith('/configuracoes')) return 'Configurações';
    return 'Dashboard';
  }, [location.pathname]);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header title={pageTitle} />
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/base-os" element={<BaseOSPage />} />
              <Route path="/planejamento" element={<PlanejamentoPage />} />
              <Route path="/cronograma" element={<CronogramaPage />} />
              <Route path="/indicadores" element={<IndicadoresPage />} />
              <Route path="/calendario" element={<CalendarioPage />} />
              <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;

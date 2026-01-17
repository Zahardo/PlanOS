import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card"
      >
        <div className="h-4 w-32 rounded-full bg-slate-200" />
        <div className="mt-6 space-y-3">
          <div className="h-3 w-full rounded-full bg-slate-100" />
          <div className="h-3 w-5/6 rounded-full bg-slate-100" />
          <div className="h-3 w-2/3 rounded-full bg-slate-100" />
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Preparando banco local e carregando dados...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

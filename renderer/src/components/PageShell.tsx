import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

const PageShell = ({ children }: PropsWithChildren) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.2 }}
    className="space-y-6"
  >
    {children}
  </motion.div>
);

export default PageShell;

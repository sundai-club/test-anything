'use client';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;

  return (
    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="absolute h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
} 
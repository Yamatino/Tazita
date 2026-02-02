'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy } from 'lucide-react';
import { CoffeeType, COFFEE_TYPES, getCoffeeTypeInfo } from '@/types/coffee';
import { useTheme } from '@/context/ThemeContext';

interface StatsProps {
  entriesByType: Record<CoffeeType, number>;
  totalEntries: number;
}

export function Stats({ entriesByType, totalEntries }: StatsProps) {
  const { themeConfig } = useTheme();
  
  const sortedTypes = useMemo(() => {
    return COFFEE_TYPES.map(type => ({
      ...type,
      count: entriesByType[type.id] || 0
    })).sort((a, b) => b.count - a.count);
  }, [entriesByType]);

  const favorite = sortedTypes[0];
  const maxCount = Math.max(...sortedTypes.map(t => t.count), 1);

  if (totalEntries === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl p-6 shadow-lg text-center"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="text-4xl mb-3">📊</div>
        <p style={{ color: themeConfig.accent }}>Todavía no hay estadísticas</p>
        <p className="text-sm mt-1" style={{ color: themeConfig.accent, opacity: 0.7 }}>
          ¡Empezá a registrar tus cafés! ☕
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 shadow-lg"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5" style={{ color: themeConfig.accent }} />
        <h3 className="font-bold" style={{ color: themeConfig.text }}>Tus Preferencias</h3>
      </div>

      {/* Favorite */}
      {favorite.count > 0 && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="rounded-xl p-3 mb-4"
          style={{ 
            background: `linear-gradient(135deg, ${themeConfig.primary} 0%, ${themeConfig.secondary} 100%)` 
          }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              🏆
            </motion.div>
            <div>
              <p className="text-xs font-medium" style={{ color: themeConfig.text }}>Tu favorito</p>
              <p className="text-lg font-bold" style={{ color: themeConfig.text }}>
                {favorite.emoji} {favorite.name}
              </p>
              <p className="text-xs" style={{ color: themeConfig.text, opacity: 0.8 }}>
                {favorite.count} {favorite.count === 1 ? 'vez' : 'veces'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chart */}
      <div className="space-y-2">
        {sortedTypes.map((type, index) => {
          if (type.count === 0) return null;
          const percentage = (type.count / totalEntries) * 100;
          
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-lg w-6">{type.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium" style={{ color: themeConfig.text }}>
                    {type.name}
                  </span>
                  <span style={{ color: themeConfig.accent }}>
                    {type.count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: themeConfig.muted }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(type.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

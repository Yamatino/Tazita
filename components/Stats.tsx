'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy } from 'lucide-react';
import { CoffeeType, COFFEE_TYPES, getCoffeeTypeInfo } from '@/types/coffee';

interface StatsProps {
  entriesByType: Record<CoffeeType, number>;
  totalEntries: number;
}

export function Stats({ entriesByType, totalEntries }: StatsProps) {
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
        className="bg-white rounded-2xl p-6 shadow-lg text-center"
      >
        <div className="text-4xl mb-3">📊</div>
        <p className="text-[#8B6F47]">Todavía no hay estadísticas</p>
        <p className="text-sm text-[#D4A574] mt-1">¡Empezá a registrar tus cafés! ☕</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-[#D4A574]" />
        <h3 className="font-bold text-[#5C4A3A]">Tus Preferencias</h3>
      </div>

      {/* Favorite */}
      {favorite.count > 0 && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-[#FFE4A1] to-[#FFD1DC] rounded-xl p-3 mb-4"
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
              <p className="text-xs text-[#5C4A3A] font-medium">Tu favorito</p>
              <p className="text-lg font-bold text-[#5C4A3A]">
                {favorite.emoji} {favorite.name}
              </p>
              <p className="text-xs text-[#8B6F47]">{favorite.count} {favorite.count === 1 ? 'vez' : 'veces'}</p>
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
                  <span className="text-[#5C4A3A] font-medium">{type.name}</span>
                  <span className="text-[#8B6F47]">{type.count} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="h-2 bg-[#F5EDE0] rounded-full overflow-hidden">
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

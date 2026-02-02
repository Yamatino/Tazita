'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface StreakProps {
  streak: number;
}

const MESSAGES = [
  { min: 0, max: 0, text: '¡Empezá hoy! 🌟', subtext: 'Tu primera taza te espera' },
  { min: 1, max: 2, text: '¡Buen comienzo! ☕', subtext: 'Seguí así' },
  { min: 3, max: 6, text: '¡Vas bien! 🔥', subtext: 'Racha en progreso' },
  { min: 7, max: 13, text: '¡Una semana! 🎉', subtext: '¡Increíble constancia!' },
  { min: 14, max: 20, text: '¡Dos semanas! 🌟', subtext: 'Eres una leyenda' },
  { min: 21, max: 29, text: '¡Casi un mes! 👑', subtext: '¡Esto es café puro!' },
  { min: 30, max: Infinity, text: '¡LEYENDA! 🏆', subtext: 'Maestro del café' }
];

export function Streak({ streak }: StreakProps) {
  const { themeConfig } = useTheme();
  const message = MESSAGES.find(m => streak >= m.min && streak <= m.max) || MESSAGES[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-4 shadow-lg"
      style={{ 
        background: `linear-gradient(135deg, ${themeConfig.primary} 0%, ${themeConfig.secondary} 100%)` 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full p-2 shadow-md"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <Flame className="h-6 w-6 text-orange-500" />
          </motion.div>
          
          <div>
            <p className="text-sm font-medium" style={{ color: themeConfig.text }}>
              {message.subtext}
            </p>
            <motion.h3 
              key={streak}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold"
              style={{ color: themeConfig.text }}
            >
              {streak} {streak === 1 ? 'día' : 'días'} seguidos
            </motion.h3>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-right"
        >
          <p className="text-lg font-bold" style={{ color: themeConfig.text }}>
            {message.text}
          </p>
        </motion.div>
      </div>

      {/* Coffee cups visualization */}
      <div className="mt-4 flex gap-1 overflow-hidden">
        {Array.from({ length: Math.min(streak, 14) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="text-xl"
          >
            ☕
          </motion.div>
        ))}
        {streak > 14 && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold self-center ml-1"
            style={{ color: themeConfig.text }}
          >
            +{streak - 14}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

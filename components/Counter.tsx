'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface CounterProps {
  today: number;
  month: number;
  year: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const { themeConfig } = useTheme();

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.span
      key={value}
      initial={{ scale: 1.2, color: themeConfig.primary }}
      animate={{ scale: 1, color: themeConfig.text }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      {displayValue}
    </motion.span>
  );
}

export function Counter({ today, month, year }: CounterProps) {
  const { themeConfig } = useTheme();
  
  const counters = [
    { label: 'Hoy', value: today, icon: '☀️', color: themeConfig.primary },
    { label: 'Este mes', value: month, icon: '📅', color: themeConfig.secondary },
    { label: 'Este año', value: year, icon: '📊', color: themeConfig.accent }
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {counters.map((counter, index) => (
        <motion.div
          key={counter.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{counter.icon}</span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            >
              <Coffee className="h-4 w-4" style={{ color: themeConfig.accent }} />
            </motion.div>
          </div>
          
          <div className="text-3xl font-bold" style={{ color: themeConfig.text }}>
            <AnimatedNumber value={counter.value} />
          </div>
          
          <p className="text-xs mt-1 font-medium" style={{ color: themeConfig.accent }}>
            {counter.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

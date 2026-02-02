'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

interface CounterProps {
  today: number;
  month: number;
  year: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

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
      initial={{ scale: 1.2, color: '#FFE4A1' }}
      animate={{ scale: 1, color: '#5C4A3A' }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      {displayValue}
    </motion.span>
  );
}

export function Counter({ today, month, year }: CounterProps) {
  const counters = [
    { label: 'Hoy', value: today, icon: '☀️', color: '#FFE4A1' },
    { label: 'Este mes', value: month, icon: '📅', color: '#FFD1DC' },
    { label: 'Este año', value: year, icon: '📊', color: '#D4A574' }
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
          className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{counter.icon}</span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            >
              <Coffee className="h-4 w-4 text-[#D4A574]" />
            </motion.div>
          </div>
          
          <div className="text-3xl font-bold text-[#5C4A3A]">
            <AnimatedNumber value={counter.value} />
          </div>
          
          <p className="text-xs text-[#8B6F47] mt-1 font-medium">{counter.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

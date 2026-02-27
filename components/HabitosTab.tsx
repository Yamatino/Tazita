'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, Trophy, Calendar } from 'lucide-react';
import { CoffeeEntry } from '@/types/coffee';
import { useTheme } from '@/context/ThemeContext';

interface HabitosTabProps {
  entries: CoffeeEntry[];
}

type TimeRange = 'all' | '30days';

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function HabitosTab({ entries }: HabitosTabProps) {
  const { themeConfig } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const filteredEntries = useMemo(() => {
    if (timeRange === 'all') return entries;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return entries.filter(entry => new Date(entry.timestamp) >= thirtyDaysAgo);
  }, [entries, timeRange]);

  // Patrones Semanales - Coffees per day of week
  const weeklyPattern = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    filteredEntries.forEach(entry => {
      try {
        let dateStr = entry.date;
        
        // Fallback: if date field is missing, extract from timestamp
        if (!dateStr && entry.timestamp) {
          const timestamp = new Date(entry.timestamp);
          const year = timestamp.getFullYear();
          const month = String(timestamp.getMonth() + 1).padStart(2, '0');
          const day = String(timestamp.getDate()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        }
        
        if (!dateStr || typeof dateStr !== 'string') {
          console.warn('Invalid date for entry:', entry);
          return;
        }
        
        const [year, month, dayOfMonth] = dateStr.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(dayOfMonth)) {
          console.warn('Invalid date format for entry:', entry);
          return;
        }
        
        const date = new Date(year, month - 1, dayOfMonth);
        const day = date.getDay();
        counts[day]++;
      } catch (error) {
        console.error('Error processing entry date:', error, entry);
      }
    });
    return counts;
  }, [filteredEntries]);

  const maxWeekly = Math.max(...weeklyPattern, 1);

  // Evolución Mensual - Last 6 months
  const monthlyEvolution = useMemo(() => {
    const now = new Date();
    const months = [];
    const counts = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(MONTHS[d.getMonth()]);
      
      const count = entries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.getMonth() === d.getMonth() && entryDate.getFullYear() === d.getFullYear();
      }).length;
      counts.push(count);
    }
    
    return { months, counts };
  }, [entries]);

  const maxMonthly = Math.max(...monthlyEvolution.counts, 1);

  // Horarios Favoritos
  const timeDistribution = useMemo(() => {
    let morning = 0; // 6-12
    let afternoon = 0; // 12-18
    let night = 0; // 18-6
    
    filteredEntries.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      if (hour >= 6 && hour < 12) morning++;
      else if (hour >= 12 && hour < 18) afternoon++;
      else night++;
    });
    
    const total = morning + afternoon + night || 1;
    return {
      morning: { count: morning, percent: Math.round((morning / total) * 100) },
      afternoon: { count: afternoon, percent: Math.round((afternoon / total) * 100) },
      night: { count: night, percent: Math.round((night / total) * 100) }
    };
  }, [filteredEntries]);

  // Récords
  const records = useMemo(() => {
    if (entries.length === 0) {
      return { streak: 0, maxDay: 0, total: 0 };
    }

    // Calculate streak
    const sortedDates = [...new Set(
      entries.map(e => new Date(e.timestamp).toDateString())
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i || (i === 0 && diffDays === 0)) {
        streak++;
      } else if (diffDays > i) {
        break;
      }
    }

    // Max in one day
    const dayCounts: Record<string, number> = {};
    entries.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      dayCounts[date] = (dayCounts[date] || 0) + 1;
    });
    const maxDay = Math.max(...Object.values(dayCounts), 0);

    return {
      streak,
      maxDay,
      total: entries.length
    };
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* Time Range Toggle */}
      <div 
        className="flex rounded-2xl p-1"
        style={{ backgroundColor: themeConfig.muted }}
      >
        <button
          onClick={() => setTimeRange('all')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
            timeRange === 'all' ? 'shadow-md' : ''
          }`}
          style={{
            backgroundColor: timeRange === 'all' ? themeConfig.primary : 'transparent',
            color: timeRange === 'all' ? themeConfig.text : themeConfig.accent
          }}
        >
          Todo el tiempo
        </button>
        <button
          onClick={() => setTimeRange('30days')}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
            timeRange === '30days' ? 'shadow-md' : ''
          }`}
          style={{
            backgroundColor: timeRange === '30days' ? themeConfig.primary : 'transparent',
            color: timeRange === '30days' ? themeConfig.text : themeConfig.accent
          }}
        >
          Últimos 30 días
        </button>
      </div>

      {/* Patrones Semanales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 shadow-lg"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" style={{ color: themeConfig.accent }} />
          <h3 className="font-bold" style={{ color: themeConfig.text }}>Patrones Semanales</h3>
        </div>

        <div className="h-40">
          <div className="h-full flex items-end justify-between gap-2">
            {WEEKDAYS.map((day, index) => {
              const count = weeklyPattern[index];
              const height = maxWeekly > 0 ? (count / maxWeekly) * 100 : 0;
              // Small minimum for visibility but don't override real proportions
              const displayHeight = count > 0 ? Math.max(height, 2) : 0;
              
              return (
                <div key={day} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
                  <div
                    className="w-full rounded-t-lg relative group cursor-pointer"
                    style={{ 
                      height: `${displayHeight}%`,
                      backgroundColor: themeConfig.primary,
                      minHeight: count > 0 ? '2px' : '0'
                    }}
                  >
                    <div 
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                      style={{ backgroundColor: themeConfig.text, color: '#FFFFFF' }}
                    >
                      {count} café{count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <span className="text-xs font-medium" style={{ color: themeConfig.accent }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Evolución Mensual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 shadow-lg"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" style={{ color: themeConfig.accent }} />
          <h3 className="font-bold" style={{ color: themeConfig.text }}>Evolución Mensual</h3>
        </div>

        <div className="h-40 flex items-end justify-between gap-2">
          {monthlyEvolution.months.map((month, i) => {
            const count = monthlyEvolution.counts[i];
            const height = maxMonthly > 0 ? (count / maxMonthly) * 100 : 0;
            const hasData = count > 0;
            
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end relative">
                  {/* Background bar */}
                  <div 
                    className="w-full rounded-t-lg absolute bottom-0"
                    style={{ 
                      height: '100%',
                      backgroundColor: themeConfig.muted,
                      opacity: 0.3
                    }}
                  />
                  {/* Data bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, hasData ? 5 : 0)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full rounded-t-lg relative z-10"
                    style={{ 
                      backgroundColor: hasData ? themeConfig.primary : 'transparent',
                      minHeight: hasData ? '4px' : '0'
                    }}
                  >
                    {hasData && (
                      <div 
                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap"
                        style={{ color: themeConfig.text }}
                      >
                        {count}
                      </div>
                    )}
                  </motion.div>
                </div>
                <span className="text-xs font-medium" style={{ color: themeConfig.accent }}>
                  {month}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Horarios Favoritos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 shadow-lg"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5" style={{ color: themeConfig.accent }} />
          <h3 className="font-bold" style={{ color: themeConfig.text }}>Horarios Favoritos</h3>
        </div>

        <div className="space-y-4">
          {/* Morning */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2" style={{ color: themeConfig.text }}>
                <span>🌅</span> Mañana (6-12h)
              </span>
              <span className="font-bold" style={{ color: themeConfig.accent }}>
                {timeDistribution.morning.count} ({timeDistribution.morning.percent}%)
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: themeConfig.muted }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${timeDistribution.morning.percent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: themeConfig.primary }}
              />
            </div>
          </div>

          {/* Afternoon */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2" style={{ color: themeConfig.text }}>
                <span>☀️</span> Tarde (12-18h)
              </span>
              <span className="font-bold" style={{ color: themeConfig.accent }}>
                {timeDistribution.afternoon.count} ({timeDistribution.afternoon.percent}%)
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: themeConfig.muted }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${timeDistribution.afternoon.percent}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: themeConfig.secondary }}
              />
            </div>
          </div>

          {/* Night */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2" style={{ color: themeConfig.text }}>
                <span>🌙</span> Noche (18-6h)
              </span>
              <span className="font-bold" style={{ color: themeConfig.accent }}>
                {timeDistribution.night.count} ({timeDistribution.night.percent}%)
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: themeConfig.muted }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${timeDistribution.night.percent}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: themeConfig.text }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Récords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-4 shadow-lg"
        style={{ 
          background: `linear-gradient(135deg, ${themeConfig.primary} 0%, ${themeConfig.secondary} 100%)` 
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5" style={{ color: themeConfig.text }} />
          <h3 className="font-bold" style={{ color: themeConfig.text }}>Tus Récords</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="text-3xl font-bold mb-1"
              style={{ color: themeConfig.text }}
            >
              {records.streak}
            </motion.div>
            <p className="text-xs" style={{ color: themeConfig.text, opacity: 0.8 }}>
              Días seguidos 🔥
            </p>
          </div>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-3xl font-bold mb-1"
              style={{ color: themeConfig.text }}
            >
              {records.maxDay}
            </motion.div>
            <p className="text-xs" style={{ color: themeConfig.text, opacity: 0.8 }}>
              Máx. en un día ⚡
            </p>
          </div>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="text-3xl font-bold mb-1"
              style={{ color: themeConfig.text }}
            >
              {records.total}
            </motion.div>
            <p className="text-xs" style={{ color: themeConfig.text, opacity: 0.8 }}>
              Total ☕
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

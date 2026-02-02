'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoffeeEntry, getCoffeeTypeInfo } from '@/types/coffee';

interface CalendarProps {
  entries: CoffeeEntry[];
  onDayClick?: (date: Date) => void;
  onDayLongPress?: (date: Date) => void;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Color coding based on coffee count
const getDayColor = (count: number): string => {
  if (count === 0) return '';
  if (count === 1) return '#FFF8E7'; // cream
  if (count === 2) return '#FFE4A1'; // light yellow
  return '#FFD1DC'; // soft pink (3+ coffees)
};

export function Calendar({ entries, onDayClick, onDayLongPress }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, CoffeeEntry[]>();
    entries.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)!.push(entry);
    });
    return map;
  }, [entries]);

  const navigateMonth = (dir: number) => {
    setDirection(dir);
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getDayEntries = (day: number) => {
    const date = new Date(year, month, day).toDateString();
    return entriesByDate.get(date) || [];
  };

  const handleDayClick = (day: number) => {
    if (onDayClick) {
      onDayClick(new Date(year, month, day));
    }
  };

  const handleDayMouseDown = (day: number) => {
    if (onDayLongPress) {
      const timer = setTimeout(() => {
        onDayLongPress(new Date(year, month, day));
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handleDayMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDayTouchStart = (day: number) => {
    if (onDayLongPress) {
      const timer = setTimeout(() => {
        onDayLongPress(new Date(year, month, day));
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handleDayTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, day: number) => {
    e.preventDefault();
    if (onDayLongPress) {
      onDayLongPress(new Date(year, month, day));
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(-1)}
          className="rounded-full hover:bg-[#FFE4A1]/30"
        >
          <ChevronLeft className="h-5 w-5 text-[#5C4A3A]" />
        </Button>
        
        <motion.h3 
          key={`${year}-${month}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-[#5C4A3A]"
        >
          {MONTHS[month]} {year}
        </motion.h3>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(1)}
          className="rounded-full hover:bg-[#FFE4A1]/30"
        >
          <ChevronRight className="h-5 w-5 text-[#5C4A3A]" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div 
            key={day} 
            className="text-center text-xs font-medium text-[#8B6F47] py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${year}-${month}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="grid grid-cols-7 gap-1"
        >
          {/* Empty cells for days before the first day */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayEntries = getDayEntries(day);
            const hasEntries = dayEntries.length > 0;
            const today = isToday(day);
            const dayColor = getDayColor(dayEntries.length);

            return (
              <motion.div
                key={day}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleDayClick(day)}
                onMouseDown={() => handleDayMouseDown(day)}
                onMouseUp={handleDayMouseUp}
                onMouseLeave={handleDayMouseUp}
                onTouchStart={() => handleDayTouchStart(day)}
                onTouchEnd={handleDayTouchEnd}
                onContextMenu={(e) => handleContextMenu(e, day)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center
                  relative cursor-pointer transition-all duration-200 select-none
                  ${today ? 'ring-2 ring-[#5C4A3A] shadow-md' : ''}
                `}
                data-today={today ? 'true' : 'false'}
                style={{
                  backgroundColor: dayColor || '#F5EDE0',
                  border: hasEntries ? '1px solid #E8DCC8' : 'none'
                }}
              >
                <span className={`
                  text-sm font-medium
                  ${today ? 'text-[#5C4A3A]' : 'text-[#5C4A3A]'}
                `}>
                  {day}
                </span>
                
                {hasEntries && (
                  <motion.div 
                    className="flex flex-wrap justify-center gap-0.5 mt-0.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {dayEntries.slice(0, 3).map((entry, i) => {
                      const typeInfo = getCoffeeTypeInfo(entry.type);
                      return (
                        <motion.span
                          key={entry.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-[10px]"
                        >
                          {typeInfo.emoji}
                        </motion.span>
                      );
                    })}
                    {dayEntries.length > 3 && (
                      <span className="text-[8px] text-[#8B6F47]">+{dayEntries.length - 3}</span>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-[#E8DCC8]">
        <div className="flex items-center justify-center gap-3 text-xs text-[#8B6F47] flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FFF8E7' }} />
            <span>1 café</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FFE4A1' }} />
            <span>2 cafés</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FFD1DC' }} />
            <span>3+ cafés</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded ring-2 ring-[#5C4A3A]" />
            <span>Hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

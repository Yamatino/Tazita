'use client';

import { useState, useEffect, useCallback } from 'react';
import { CoffeeData, CoffeeEntry, CoffeeType, generateRecoveryCode, generateId } from '@/types/coffee';

const STORAGE_KEY = 'tazita-coffee-data';

export function useCoffeeData() {
  const [data, setData] = useState<CoffeeData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
      } catch (e) {
        console.error('Error parsing coffee data:', e);
        initializeData();
      }
    } else {
      initializeData();
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (data && isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const initializeData = () => {
    const newData: CoffeeData = {
      entries: [],
      recoveryCode: generateRecoveryCode(),
      createdAt: new Date().toISOString()
    };
    setData(newData);
  };

  const addCoffee = useCallback((type: CoffeeType, notes?: string) => {
    const newEntry: CoffeeEntry = {
      id: generateId(),
      type,
      timestamp: new Date().toISOString(),
      notes
    };

    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        entries: [...prev.entries, newEntry]
      };
    });

    return newEntry;
  }, []);

  const removeCoffee = useCallback((id: string) => {
    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        entries: prev.entries.filter(e => e.id !== id)
      };
    });
  }, []);

  const loadFromCode = useCallback((code: string, entries: CoffeeEntry[]) => {
    setData({
      entries,
      recoveryCode: code,
      createdAt: new Date().toISOString()
    });
  }, []);

  const getStats = useCallback(() => {
    if (!data) return { today: 0, month: 0, year: 0 };

    const now = new Date();
    const today = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const todayCount = data.entries.filter(e => 
      new Date(e.timestamp).toDateString() === today
    ).length;

    const monthCount = data.entries.filter(e => {
      const date = new Date(e.timestamp);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const yearCount = data.entries.filter(e => 
      new Date(e.timestamp).getFullYear() === currentYear
    ).length;

    return { today: todayCount, month: monthCount, year: yearCount };
  }, [data]);

  const getStreak = useCallback(() => {
    if (!data || data.entries.length === 0) return 0;

    const sortedDates = [...new Set(
      data.entries.map(e => new Date(e.timestamp).toDateString())
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

    return streak;
  }, [data]);

  const getEntriesByType = useCallback(() => {
    if (!data) return {};
    
    const counts: Record<string, number> = {};
    data.entries.forEach(entry => {
      counts[entry.type] = (counts[entry.type] || 0) + 1;
    });
    
    return counts;
  }, [data]);

  const getEntriesForDate = useCallback((date: Date) => {
    if (!data) return [];
    const dateStr = date.toDateString();
    return data.entries.filter(e => new Date(e.timestamp).toDateString() === dateStr);
  }, [data]);

  const getEntriesForMonth = useCallback((year: number, month: number) => {
    if (!data) return [];
    return data.entries.filter(e => {
      const date = new Date(e.timestamp);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [data]);

  return {
    data,
    isLoaded,
    addCoffee,
    removeCoffee,
    loadFromCode,
    getStats,
    getStreak,
    getEntriesByType,
    getEntriesForDate,
    getEntriesForMonth
  };
}

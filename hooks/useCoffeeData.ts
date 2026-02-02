'use client';

import { useState, useEffect, useCallback } from 'react';
import { CoffeeData, CoffeeEntry, CoffeeType, generateId } from '@/types/coffee';
import { checkUsernameExists, getUserData, saveUserData } from '@/lib/supabase';

const USERNAME_KEY = 'tazita-username';

export function useCoffeeData() {
  const [data, setData] = useState<CoffeeData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Load username from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsLoaded(true);
  }, []);

  // Load data when username changes
  useEffect(() => {
    if (username) {
      loadUserData(username);
    }
  }, [username]);

  // Auto-save to Supabase when data changes
  useEffect(() => {
    if (data && username && isLoaded) {
      const timeoutId = setTimeout(() => {
        syncToSupabase();
      }, 1000); // Debounce 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [data, username, isLoaded]);

  const loadUserData = async (user: string) => {
    try {
      const userData = await getUserData(user);
      if (userData) {
        setData(userData);
      } else {
        // Initialize new user
        const newData: CoffeeData = {
          entries: [],
          username: user,
          createdAt: new Date().toISOString()
        };
        setData(newData);
        await saveUserData(user, newData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(`tazita-data-${user}`);
      if (localData) {
        setData(JSON.parse(localData));
      } else {
        initializeData(user);
      }
    }
  };

  const syncToSupabase = async () => {
    if (!data || !username) return;
    
    setIsSyncing(true);
    try {
      await saveUserData(username, data);
      setLastSync(new Date());
      // Also save to localStorage as backup
      localStorage.setItem(`tazita-data-${username}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error syncing to Supabase:', error);
      // Save to localStorage as fallback
      localStorage.setItem(`tazita-data-${username}`, JSON.stringify(data));
    } finally {
      setIsSyncing(false);
    }
  };

  const initializeData = (user?: string) => {
    const newData: CoffeeData = {
      entries: [],
      username: user || username || '',
      createdAt: new Date().toISOString()
    };
    setData(newData);
    return newData;
  };

  const setUser = async (newUsername: string): Promise<{ exists: boolean; data?: CoffeeData }> => {
    const normalizedUsername = newUsername.toLowerCase().trim();
    const exists = await checkUsernameExists(normalizedUsername);
    
    if (exists) {
      const existingData = await getUserData(normalizedUsername);
      return { 
        exists: true, 
        data: existingData || undefined
      };
    }
    
    localStorage.setItem(USERNAME_KEY, normalizedUsername);
    setUsername(normalizedUsername);
    return { exists: false };
  };

  const switchUser = (newUsername: string) => {
    const normalizedUsername = newUsername.toLowerCase().trim();
    localStorage.setItem(USERNAME_KEY, normalizedUsername);
    setUsername(normalizedUsername);
  };

  const addCoffee = useCallback((type: CoffeeType, date: string, notes?: string) => {
    const newEntry: CoffeeEntry = {
      id: generateId(),
      type,
      timestamp: new Date().toISOString(),
      date,
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
    username,
    isSyncing,
    lastSync,
    setUser,
    switchUser,
    addCoffee,
    removeCoffee,
    getStats,
    getStreak,
    getEntriesByType,
    getEntriesForDate,
    getEntriesForMonth,
    syncToSupabase
  };
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, User, BarChart3, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoffeeData } from '@/hooks/useCoffeeData';
import { CoffeeType } from '@/types/coffee';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/context/ThemeContext';
import { AddCoffeeButton } from '@/components/AddCoffeeButton';
import { CoffeeTypeModal } from '@/components/CoffeeTypeModal';
import { Calendar } from '@/components/Calendar';
import { Counter } from '@/components/Counter';
import { Streak } from '@/components/Streak';
import { Stats } from '@/components/Stats';
import { UsernameManager } from '@/components/UsernameManager';
import { ShareStats } from '@/components/ShareStats';
import { DayDetailsModal } from '@/components/DayDetailsModal';
import { ThemeSelector } from '@/components/ThemeSelector';
import { HabitosTab } from '@/components/HabitosTab';

type Tab = 'main' | 'habitos' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('main');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false);
  
  const {
    data,
    isLoaded,
    username,
    isSyncing,
    setUser,
    switchUser,
    addCoffee,
    removeCoffee,
    getStats,
    getStreak,
    getEntriesByType,
    getEntriesForDate
  } = useCoffeeData();

  const { themeConfig } = useTheme();

  const stats = getStats();
  const streak = getStreak();
  const entriesByType = getEntriesByType();
  const totalEntries = data?.entries.length || 0;

  const handleAddCoffee = (type: CoffeeType, date: string, notes?: string) => {
    addCoffee(type, date, notes);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayDetailsOpen(true);
  };

  const handleDayLongPress = (date: Date) => {
    setSelectedDate(date);
    setIsDayDetailsOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    removeCoffee(id);
  };

  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  if (!isLoaded) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: themeConfig.background }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          ☕
        </motion.div>
      </div>
    );
  }

  // Show username setup if no username
  if (!username) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: themeConfig.background }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl p-8 shadow-xl max-w-sm w-full"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              {themeConfig.emoji}
            </motion.div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: themeConfig.text }}>
              Bienvenido a Tazita
            </h1>
            <p style={{ color: themeConfig.accent }}>Tu rastreador personal de café ☕</p>
          </div>

          <UsernameManager
            currentUsername={username}
            onSetUsername={setUser}
            onSwitchUser={switchUser}
            isFirstSetup={true}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: themeConfig.background }}>
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 backdrop-blur-md border-b px-4 py-3"
        style={{ 
          backgroundColor: `${themeConfig.background}E6`,
          borderColor: themeConfig.border 
        }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-3xl"
            >
              {themeConfig.emoji}
            </motion.div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: themeConfig.text }}>Tazita</h1>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" style={{ color: themeConfig.accent }} />
                <p className="text-xs" style={{ color: themeConfig.accent }}>{username}</p>
                {isSyncing && (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-[10px]"
                    style={{ color: themeConfig.accent }}
                  >
                    sincronizando...
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab(activeTab === 'habitos' ? 'main' : 'habitos')}
              className={`rounded-full transition-all duration-300 ${
                activeTab === 'habitos' ? '' : 'hover:bg-opacity-30'
              }`}
              style={{
                backgroundColor: activeTab === 'habitos' ? themeConfig.primary : 'transparent',
                color: themeConfig.text
              }}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab(activeTab === 'settings' ? 'main' : 'settings')}
              className={`rounded-full transition-all duration-300 ${
                activeTab === 'settings' ? '' : 'hover:bg-opacity-30'
              }`}
              style={{
                backgroundColor: activeTab === 'settings' ? themeConfig.primary : 'transparent',
                color: themeConfig.text
              }}
            >
              {activeTab === 'settings' ? (
                <X className="h-5 w-5" />
              ) : (
                <Settings className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'settings' ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div 
                className="rounded-2xl p-4 shadow-lg"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5" style={{ color: themeConfig.accent }} />
                  <h2 className="text-lg font-bold" style={{ color: themeConfig.text }}>Configuración ⚙️</h2>
                </div>
                
                <UsernameManager
                  currentUsername={username}
                  onSetUsername={setUser}
                  onSwitchUser={switchUser}
                />
              </div>
              
              <div 
                className="rounded-2xl p-4 shadow-lg"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <ThemeSelector />
              </div>
              
              <div 
                className="rounded-2xl p-4 shadow-lg"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <h3 className="font-bold mb-3" style={{ color: themeConfig.text }}>Acerca de</h3>
                <p className="text-sm" style={{ color: themeConfig.accent }}>
                  Tazita v1.0 - Hecho con ☕ y {themeConfig.emoji}
                </p>
                <p className="text-xs mt-2" style={{ color: themeConfig.accent, opacity: 0.7 }}>
                  Tema {themeConfig.name}
                </p>
              </div>
            </motion.div>
          ) : activeTab === 'habitos' ? (
            <motion.div
              key="habitos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <HabitosTab entries={data?.entries || []} />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Counters */}
              <Counter 
                today={stats.today} 
                month={stats.month} 
                year={stats.year} 
              />

              {/* Streak */}
              <Streak streak={streak} />

              {/* Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Calendar 
                  entries={data?.entries || []}
                  onDayClick={handleDayClick}
                  onDayLongPress={handleDayLongPress}
                />
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Stats 
                  entriesByType={entriesByType} 
                  totalEntries={totalEntries} 
                />
              </motion.div>

              {/* Share Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <ShareStats
                  today={stats.today}
                  month={stats.month}
                  year={stats.year}
                  streak={streak}
                  entriesByType={entriesByType}
                  totalEntries={totalEntries}
                  username={username}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Coffee Button */}
      {activeTab === 'main' && (
        <AddCoffeeButton onClick={() => setIsModalOpen(true)} />
      )}

      {/* Coffee Type Modal */}
      <CoffeeTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddCoffee}
      />

      {/* Day Details Modal */}
      <DayDetailsModal
        isOpen={isDayDetailsOpen}
        onClose={() => setIsDayDetailsOpen(false)}
        date={selectedDate}
        entries={selectedDateEntries}
        onDeleteEntry={handleDeleteEntry}
      />
    </main>
  );
}

export default function HomePage() {
  return (
    <ThemeProvider username={null}>
      <AppContent />
    </ThemeProvider>
  );
}

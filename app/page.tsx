'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCoffeeData } from '@/hooks/useCoffeeData';
import { CoffeeType } from '@/types/coffee';
import { AddCoffeeButton } from '@/components/AddCoffeeButton';
import { CoffeeTypeModal } from '@/components/CoffeeTypeModal';
import { Calendar } from '@/components/Calendar';
import { Counter } from '@/components/Counter';
import { Streak } from '@/components/Streak';
import { Stats } from '@/components/Stats';
import { UsernameManager } from '@/components/UsernameManager';
import { ShareStats } from '@/components/ShareStats';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    data,
    isLoaded,
    username,
    isSyncing,
    setUser,
    switchUser,
    addCoffee,
    getStats,
    getStreak,
    getEntriesByType
  } = useCoffeeData();

  const stats = getStats();
  const streak = getStreak();
  const entriesByType = getEntriesByType();
  const totalEntries = data?.entries.length || 0;

  const handleAddCoffee = (type: CoffeeType, notes?: string) => {
    addCoffee(type, notes);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full"
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🍮
            </motion.div>
            <h1 className="text-2xl font-bold text-[#5C4A3A] mb-2">Welcome to Tazita</h1>
            <p className="text-[#8B6F47]">Your personal coffee tracker ☕</p>
          </div>

          <UsernameManager
            currentUsername={username}
            onSetUsername={setUser}
            onSwitchUser={switchUser}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-[#FFF8E7]/90 backdrop-blur-md border-b border-[#E8DCC8] px-4 py-3"
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-3xl"
            >
              🍮
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-[#5C4A3A]">Tazita</h1>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-[#8B6F47]" />
                <p className="text-xs text-[#8B6F47]">{username}</p>
                {isSyncing && (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-[10px] text-[#D4A574]"
                  >
                    syncing...
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-full hover:bg-[#FFE4A1]/30"
          >
            {showSettings ? (
              <X className="h-5 w-5 text-[#5C4A3A]" />
            ) : (
              <Settings className="h-5 w-5 text-[#5C4A3A]" />
            )}
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {showSettings ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <h2 className="text-lg font-bold text-[#5C4A3A] mb-4">Settings ⚙️</h2>
              <UsernameManager
                currentUsername={username}
                onSetUsername={setUser}
                onSwitchUser={switchUser}
              />
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-[#5C4A3A] mb-3">About</h3>
              <p className="text-sm text-[#8B6F47]">
                Tazita v1.0 - Made with ☕ and 🍮
              </p>
              <p className="text-xs text-[#D4A574] mt-2">
                Pompompurin Theme 💛
              </p>
            </div>
          </motion.div>
        ) : (
          <>
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
              <Calendar entries={data?.entries || []} />
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
          </>
        )}
      </div>

      {/* Add Coffee Button */}
      {!showSettings && (
        <AddCoffeeButton onClick={() => setIsModalOpen(true)} />
      )}

      {/* Coffee Type Modal */}
      <CoffeeTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddCoffee}
      />
    </main>
  );
}

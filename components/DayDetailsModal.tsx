'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoffeeEntry, getCoffeeTypeInfo } from '@/types/coffee';

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  entries: CoffeeEntry[];
  onDeleteEntry: (id: string) => void;
}

export function DayDetailsModal({ isOpen, onClose, date, entries, onDeleteEntry }: DayDetailsModalProps) {
  if (!date) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-auto"
          >
            <div className="p-6 pb-24">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <motion.h2 
                  className="text-xl font-bold text-[#5C4A3A]"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {formatDate(date)} ☕
                </motion.h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-[#FFE4A1]/30"
                >
                  <X className="h-6 w-6 text-[#5C4A3A]" />
                </Button>
              </div>

              {/* Entries List */}
              {entries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-4xl mb-4">😴</div>
                  <p className="text-[#8B6F47]">No coffees recorded for this day</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {entries.map((entry, index) => {
                    const typeInfo = getCoffeeTypeInfo(entry.type);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#FFF8E7] rounded-2xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{typeInfo.emoji}</span>
                          <div>
                            <p className="font-bold text-[#5C4A3A]">{typeInfo.name}</p>
                            <p className="text-xs text-[#8B6F47]">{formatTime(entry.timestamp)}</p>
                            {entry.notes && (
                              <p className="text-sm text-[#8B6F47] mt-1 italic">"{entry.notes}"</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteEntry(entry.id)}
                          className="rounded-full hover:bg-red-100 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Summary */}
              {entries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 pt-4 border-t border-[#E8DCC8]"
                >
                  <p className="text-center text-[#5C4A3A] font-medium">
                    Total: {entries.length} coffee{entries.length !== 1 ? 's' : ''} ☕
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

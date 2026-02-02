'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoffeeType, COFFEE_TYPES } from '@/types/coffee';

interface CoffeeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: CoffeeType, date: string, notes?: string) => void;
}

export function CoffeeTypeModal({ isOpen, onClose, onSelect }: CoffeeTypeModalProps) {
  const [selectedType, setSelectedType] = useState<CoffeeType | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelect = (type: CoffeeType) => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType, selectedDate, notes.trim() || undefined);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedType(null);
        setNotes('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
        onClose();
      }, 1200);
    }
  };

  const handleClose = () => {
    setSelectedType(null);
    setNotes('');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

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
            onClick={handleClose}
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
                  className="text-2xl font-bold text-[#5C4A3A]"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  ¿Qué café tomaste? ☕
                </motion.h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="rounded-full hover:bg-[#FFE4A1]/30"
                >
                  <X className="h-6 w-6 text-[#5C4A3A]" />
                </Button>
              </div>

              {/* Success Animation */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-white/95 z-10 rounded-t-3xl"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="text-6xl mb-4">☕✨</div>
                      <p className="text-xl font-bold text-[#5C4A3A]">¡Agregado! 🎉</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Date Picker */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-6"
              >
                <Label htmlFor="coffee-date" className="text-[#5C4A3A] font-medium mb-2 block">
                  Fecha 📅
                </Label>
                <Input
                  id="coffee-date"
                  type="date"
                  value={selectedDate}
                  max={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-[#E8DCC8] focus:border-[#FFE4A1] focus:ring-[#FFE4A1] rounded-xl"
                />
              </motion.div>

              {/* Coffee Types Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {COFFEE_TYPES.map((coffee, index) => (
                  <motion.button
                    key={coffee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(coffee.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      selectedType === coffee.id
                        ? 'border-[#FFE4A1] bg-[#FFE4A1]/20 shadow-lg'
                        : 'border-[#E8DCC8] bg-white hover:border-[#D4A574]'
                    }`}
                  >
                    <motion.div
                      className="text-3xl mb-2"
                      animate={selectedType === coffee.id ? {
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {coffee.emoji}
                    </motion.div>
                    <p className="font-bold text-[#5C4A3A] text-sm">{coffee.name}</p>
                    <p className="text-xs text-[#8B6F47] mt-1">{coffee.description}</p>
                  </motion.button>
                ))}
              </div>

              {/* Notes Input */}
              <AnimatePresence>
                {selectedType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <Label htmlFor="notes" className="text-[#5C4A3A] font-medium mb-2 block">
                      ¿Algo especial? (opcional) 📝
                    </Label>
                    <Input
                      id="notes"
                      placeholder="Ej: Delicioso, con leche, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="border-[#E8DCC8] focus:border-[#FFE4A1] focus:ring-[#FFE4A1] rounded-xl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm Button */}
              <AnimatePresence>
                {selectedType && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Button
                      onClick={handleConfirm}
                      className="w-full h-14 bg-[#FFE4A1] hover:bg-[#FFD93D] text-[#5C4A3A] font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <motion.span
                        className="flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ¡Agregar café! ☕✨
                      </motion.span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

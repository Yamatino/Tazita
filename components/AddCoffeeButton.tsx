'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddCoffeeButtonProps {
  onClick: () => void;
}

export function AddCoffeeButton({ onClick }: AddCoffeeButtonProps) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Button
          onClick={onClick}
          size="lg"
          className="h-16 w-16 rounded-full bg-[#FFE4A1] hover:bg-[#FFD93D] text-[#5C4A3A] shadow-lg hover:shadow-xl transition-all duration-300 border-4 border-white"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="h-8 w-8" strokeWidth={3} />
          </motion.div>
        </Button>
      </motion.div>
      
      {/* Floating coffee beans decoration */}
      <motion.div
        className="absolute -top-2 -right-2 text-2xl"
        animate={{
          y: [0, -5, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        ☕
      </motion.div>
      
      <motion.div
        className="absolute -bottom-1 -left-3 text-xl"
        animate={{
          y: [0, -3, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
      >
        🍮
      </motion.div>
    </motion.div>
  );
}

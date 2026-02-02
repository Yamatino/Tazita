'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { CoffeeType, COFFEE_TYPES, getCoffeeTypeInfo } from '@/types/coffee';

interface ShareStatsProps {
  today: number;
  month: number;
  year: number;
  streak: number;
  entriesByType: Record<CoffeeType, number>;
  totalEntries: number;
}

export function ShareStats({ today, month, year, streak, entriesByType, totalEntries }: ShareStatsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const sortedTypes = Object.entries(entriesByType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#FFF8E7',
        scale: 2,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `tazita-stats-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#FFF8E7',
        scale: 2,
        logging: false
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], 'tazita-stats.png', { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Mis estadísticas de café ☕',
            text: '¡Mira cuánto café he tomado con Tazita! 🍮'
          });
        } else {
          handleGenerate();
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
      handleGenerate();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="rounded-xl border-[#E8DCC8] hover:bg-[#FFE4A1]/30"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Compartir
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-3xl z-50 overflow-auto md:w-[400px] md:max-h-[90vh]"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#5C4A3A]">Compartir Stats</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Preview Card */}
                <div
                  ref={cardRef}
                  className="bg-gradient-to-br from-[#FFE4A1] via-[#FFF8E7] to-[#FFD1DC] rounded-2xl p-6 mb-4"
                  style={{ aspectRatio: '1/1' }}
                >
                  <div className="h-full flex flex-col">
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-2">☕🍮</div>
                      <h2 className="text-2xl font-bold text-[#5C4A3A]">Tazita</h2>
                      <p className="text-sm text-[#8B6F47]">Mi rastreador de café</p>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="bg-white/80 rounded-xl p-3 text-center">
                        <p className="text-3xl font-bold text-[#5C4A3A]">{today}</p>
                        <p className="text-xs text-[#8B6F47]">Hoy</p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-3 text-center">
                        <p className="text-3xl font-bold text-[#5C4A3A]">{month}</p>
                        <p className="text-xs text-[#8B6F47]">Este mes</p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-3 text-center">
                        <p className="text-3xl font-bold text-[#5C4A3A]">{year}</p>
                        <p className="text-xs text-[#8B6F47]">Este año</p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-3 text-center">
                        <p className="text-3xl font-bold text-[#5C4A3A]">{streak}</p>
                        <p className="text-xs text-[#8B6F47]">Días seguidos 🔥</p>
                      </div>
                    </div>

                    {sortedTypes.length > 0 && (
                      <div className="mt-4 bg-white/60 rounded-xl p-3">
                        <p className="text-xs text-[#8B6F47] mb-2 text-center">Mis favoritos:</p>
                        <div className="flex justify-center gap-2">
                          {sortedTypes.map(([type, count]) => {
                            const info = getCoffeeTypeInfo(type as CoffeeType);
                            return (
                              <div key={type} className="text-center">
                                <span className="text-xl">{info.emoji}</span>
                                <p className="text-xs text-[#5C4A3A] font-bold">{count}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4 text-center">
                      <p className="text-xs text-[#8B6F47]">🍮 Tazita - Rastrea tu café ☕</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generando...' : 'Guardar'}
                  </Button>
                  <Button
                    onClick={handleShare}
                    disabled={isGenerating}
                    className="flex-1 rounded-xl bg-[#FFE4A1] hover:bg-[#FFD93D] text-[#5C4A3A] font-bold"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

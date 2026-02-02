'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { CoffeeType, getCoffeeTypeInfo } from '@/types/coffee';

interface ShareStatsProps {
  today: number;
  month: number;
  year: number;
  streak: number;
  entriesByType: Record<CoffeeType, number>;
  totalEntries: number;
  username: string;
}

export function ShareStats({ today, month, year, streak, entriesByType, totalEntries, username }: ShareStatsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const sortedTypes = Object.entries(entriesByType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const generateImage = async (): Promise<HTMLCanvasElement | null> => {
    if (!cardRef.current) return null;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-share-card]');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.transform = 'none';
          }
        }
      });
      
      return canvas;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    
    const canvas = await generateImage();
    if (!canvas) {
      setIsGenerating(false);
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.download = `tazita-${username}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error downloading:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    
    const canvas = await generateImage();
    if (!canvas) {
      setIsGenerating(false);
      return;
    }
    
    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
      });
      
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      
      const file = new File([blob], `tazita-${username}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Coffee Stats ☕',
          text: `Check out my coffee journey with Tazita! 🍮\nTracked ${totalEntries} coffees so far.`
        });
      } else {
        // Fallback to download
        const link = document.createElement('a');
        link.download = `tazita-${username}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to download on error
      handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="rounded-xl border-[#E8DCC8] hover:bg-[#FFE4A1]/30"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-3xl z-50 overflow-hidden md:w-[420px] shadow-2xl"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#5C4A3A]">Share Your Journey</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full hover:bg-[#FFE4A1]/30"
                  >
                    <X className="h-5 w-5 text-[#5C4A3A]" />
                  </Button>
                </div>

                {/* Instagram Story Format Card */}
                <div className="flex-1 flex items-center justify-center mb-4">
                  <div
                    ref={cardRef}
                    data-share-card
                    className="relative w-[280px] h-[500px] rounded-3xl overflow-hidden shadow-xl"
                    style={{
                      background: '#FFE4A1'
                    }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-10 left-10 text-4xl">☕</div>
                      <div className="absolute top-20 right-8 text-3xl">🍮</div>
                      <div className="absolute bottom-32 left-8 text-3xl">✨</div>
                      <div className="absolute bottom-20 right-12 text-4xl">☕</div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col p-6">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-6xl mb-3"
                        >
                          🍮
                        </motion.div>
                        <h2 className="text-3xl font-bold text-[#5C4A3A] mb-1">Tazita</h2>
                        <p className="text-sm text-[#8B6F47]">@{username}</p>
                        <p className="text-xs text-[#D4A574] mt-1">{currentDate}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="bg-white/95 rounded-2xl p-4 flex flex-col items-center justify-center shadow-md border border-[#FFE4A1]/50">
                          <p className="text-4xl font-bold text-[#5C4A3A]">{today}</p>
                          <p className="text-xs text-[#8B6F47] font-medium mt-1">Today</p>
                        </div>
                        
                        <div className="bg-white/95 rounded-2xl p-4 flex flex-col items-center justify-center shadow-md border border-[#FFE4A1]/50">
                          <p className="text-4xl font-bold text-[#5C4A3A]">{month}</p>
                          <p className="text-xs text-[#8B6F47] font-medium mt-1">This Month</p>
                        </div>
                        
                        <div className="bg-white/95 rounded-2xl p-4 flex flex-col items-center justify-center shadow-md border border-[#FFE4A1]/50">
                          <p className="text-4xl font-bold text-[#5C4A3A]">{year}</p>
                          <p className="text-xs text-[#8B6F47] font-medium mt-1">This Year</p>
                        </div>
                        
                        <div className="bg-white/95 rounded-2xl p-4 flex flex-col items-center justify-center shadow-md border border-[#FFE4A1]/50">
                          <p className="text-4xl font-bold text-[#5C4A3A]">{streak}</p>
                          <p className="text-xs text-[#8B6F47] font-medium mt-1">Day Streak 🔥</p>
                        </div>
                      </div>

                      {/* Favorites */}
                      {sortedTypes.length > 0 && (
                        <div className="mt-4 bg-white/90 rounded-2xl p-4 shadow-md border border-[#FFE4A1]/50">
                          <p className="text-xs text-[#8B6F47] mb-2 text-center font-medium">My Favorites</p>
                          <div className="flex justify-center gap-4">
                            {sortedTypes.map(([type, count]) => {
                              const info = getCoffeeTypeInfo(type as CoffeeType);
                              return (
                                <div key={type} className="text-center">
                                  <span className="text-2xl">{info.emoji}</span>
                                  <p className="text-xs text-[#5C4A3A] font-bold mt-1">{count}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto pt-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-[#8B6F47]">
                          <Sparkles className="h-3 w-3" />
                          <p className="text-xs">Track your coffee with Tazita</p>
                          <Sparkles className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center mb-3"
                    >
                      <p className="text-green-600 font-medium text-sm">✓ Image saved successfully!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    variant="outline"
                    className="rounded-xl h-12 border-[#E8DCC8] hover:bg-[#FFE4A1]/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Saving...' : 'Save'}
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    disabled={isGenerating}
                    className="rounded-xl h-12 bg-[#FFE4A1] hover:bg-[#FFD93D] text-[#5C4A3A] font-bold"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Sharing...' : 'Share'}
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

'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Theme, THEMES, getThemeConfig } from '@/types/coffee';
import { useTheme } from '@/context/ThemeContext';

interface ThemeSelectorProps {
  onThemeSelect?: (theme: Theme) => void;
  showLabel?: boolean;
}

export function ThemeSelector({ onThemeSelect, showLabel = true }: ThemeSelectorProps) {
  const { currentTheme, setTheme, themeConfig } = useTheme();

  const handleThemeClick = (themeId: Theme) => {
    setTheme(themeId);
    if (onThemeSelect) {
      onThemeSelect(themeId);
    }
  };

  return (
    <div className="space-y-4">
      {showLabel && (
        <div className="flex items-center gap-2">
          <span className="text-2xl">{themeConfig.emoji}</span>
          <h3 className="font-bold" style={{ color: themeConfig.text }}>
            Selecciona tu tema
          </h3>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-3">
        {THEMES.map((theme, index) => {
          const isSelected = currentTheme === theme.id;
          const config = getThemeConfig(theme.id);
          
          return (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleThemeClick(theme.id)}
              className={`
                relative rounded-2xl p-4 transition-all duration-300
                ${isSelected ? 'ring-2 ring-offset-2' : 'hover:shadow-lg'}
              `}
              style={{
                background: `linear-gradient(135deg, ${config.background} 0%, ${config.muted} 100%)`,
                border: `2px solid ${isSelected ? config.primary : config.border}`,
                boxShadow: isSelected ? `0 4px 20px ${config.primary}40` : 'none',
                ...(isSelected && { ringColor: config.primary })
              }}
            >
              <div className="flex items-center gap-4">
                {/* Emoji */}
                <motion.div
                  animate={isSelected ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-4xl"
                >
                  {theme.emoji}
                </motion.div>
                
                {/* Theme Info */}
                <div className="flex-1 text-left">
                  <p 
                    className="font-bold text-lg"
                    style={{ color: config.text }}
                  >
                    {theme.name}
                  </p>
                  
                  {/* Color Palette Preview */}
                  <div className="flex gap-2 mt-2">
                    <div 
                      className="w-6 h-6 rounded-full shadow-sm"
                      style={{ backgroundColor: config.primary }}
                      title="Primario"
                    />
                    <div 
                      className="w-6 h-6 rounded-full shadow-sm"
                      style={{ backgroundColor: config.secondary }}
                      title="Secundario"
                    />
                    <div 
                      className="w-6 h-6 rounded-full shadow-sm border"
                      style={{ backgroundColor: config.background, borderColor: config.border }}
                      title="Fondo"
                    />
                    <div 
                      className="w-6 h-6 rounded-full shadow-sm flex items-center justify-center"
                      style={{ backgroundColor: config.text }}
                      title="Texto"
                    >
                      <span className="text-[8px] text-white font-bold">T</span>
                    </div>
                  </div>
                </div>
                
                {/* Selection Indicator */}
                <motion.div
                  initial={false}
                  animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: config.primary }}
                >
                  <Check className="w-5 h-5" style={{ color: config.text }} />
                </motion.div>
              </div>
              
              {/* Decorative Elements */}
              {isSelected && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    className="absolute -top-2 -right-2 w-12 h-12 rounded-full"
                    style={{ backgroundColor: config.primary }}
                  />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full"
                    style={{ backgroundColor: config.secondary }}
                  />
                </>
              )}
            </motion.button>
          );
        })}
      </div>
      
      <p className="text-xs text-center" style={{ color: themeConfig.accent }}>
        El tema se aplicará inmediatamente ✨
      </p>
    </div>
  );
}

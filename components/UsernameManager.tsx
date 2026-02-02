'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, AlertCircle, Check, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoffeeData, Theme, THEMES, getThemeConfig } from '@/types/coffee';
import { useTheme } from '@/context/ThemeContext';

interface UsernameManagerProps {
  currentUsername: string | null;
  onSetUsername: (username: string, theme?: Theme) => Promise<{ exists: boolean; data?: CoffeeData }>;
  onSwitchUser: (username: string) => void;
  isFirstSetup?: boolean;
}

export function UsernameManager({ currentUsername, onSetUsername, onSwitchUser, isFirstSetup = false }: UsernameManagerProps) {
  const [inputUsername, setInputUsername] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('pompompurin');
  const [isChecking, setIsChecking] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [existingData, setExistingData] = useState<CoffeeData | undefined>(undefined);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { setTheme, themeConfig } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputUsername.trim()) {
      setError('Por favor ingresa un nombre de usuario');
      return;
    }

    if (inputUsername.trim().toLowerCase() === currentUsername?.toLowerCase()) {
      setError('Este ya es tu usuario actual');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      // Set theme before creating user
      await setTheme(selectedTheme);
      
      const result = await onSetUsername(inputUsername.trim(), selectedTheme);
      
      if (result.exists) {
        setExistingData(result.data);
        setShowConfirmDialog(true);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        setInputUsername('');
      }
    } catch (err) {
      setError('Error al verificar el usuario. Por favor intenta de nuevo.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLoadExisting = () => {
    onSwitchUser(inputUsername.trim());
    setShowConfirmDialog(false);
    setInputUsername('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleCreateNew = async () => {
    // Force create new by switching to a modified username
    const newUsername = inputUsername.trim() + '_new';
    onSwitchUser(newUsername);
    setShowConfirmDialog(false);
    setInputUsername('');
  };

  const handleLogout = () => {
    localStorage.removeItem('tazita-username');
    localStorage.removeItem('tazita-theme');
    window.location.reload();
  };

  const handleThemeSelect = (themeId: Theme) => {
    setSelectedTheme(themeId);
    setTheme(themeId);
  };

  return (
    <div className="space-y-4">
      {/* Current User Display */}
      {currentUsername && !isFirstSetup && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4"
          style={{ 
            background: `linear-gradient(135deg, ${themeConfig.primary} 0%, ${themeConfig.secondary} 100%)` 
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="rounded-full p-2"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <User className="h-5 w-5" style={{ color: themeConfig.text }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: themeConfig.text, opacity: 0.8 }}>Usuario actual</p>
                <p className="text-lg font-bold" style={{ color: themeConfig.text }}>{currentUsername}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-white/50"
              style={{ color: themeConfig.text }}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Salir
            </Button>
          </div>
        </motion.div>
      )}

      {/* Theme Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" style={{ color: themeConfig.accent }} />
          <Label style={{ color: themeConfig.text }} className="font-medium">
            {isFirstSetup ? 'Elige tu tema favorito:' : 'Cambiar tema:'}
          </Label>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((theme) => {
            const config = getThemeConfig(theme.id);
            const isSelected = selectedTheme === theme.id;
            
            return (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThemeSelect(theme.id)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center gap-1
                  transition-all duration-300
                  ${isSelected ? 'ring-2 ring-offset-2' : 'hover:shadow-md'}
                `}
                style={{
                  backgroundColor: config.background,
                  border: `2px solid ${isSelected ? config.primary : config.border}`,
                  ['--tw-ring-color' as string]: config.primary
                }}
              >
                <span className="text-2xl">{theme.emoji}</span>
                <span className="text-[10px] font-medium truncate w-full text-center px-1" style={{ color: config.text }}>
                  {theme.name.split(' ')[0]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Username Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="username" style={{ color: themeConfig.text }} className="font-medium">
            {currentUsername ? 'Cambiar a otro usuario:' : 'Ingresa tu nombre de usuario:'}
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="ej: maria, amante_del_cafe, etc."
            value={inputUsername}
            onChange={(e) => {
              setInputUsername(e.target.value);
              setError('');
            }}
            className="mt-1 rounded-xl"
            style={{ 
              borderColor: themeConfig.border,
            }}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-500 text-sm"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-600 text-sm"
          >
            <Check className="h-4 w-4" />
            ¡Usuario configurado exitosamente!
          </motion.div>
        )}

        <Button
          type="submit"
          disabled={isChecking || !inputUsername.trim()}
          className="w-full rounded-xl font-bold transition-all duration-300"
          style={{
            backgroundColor: themeConfig.primary,
            color: themeConfig.text,
          }}
        >
          {isChecking ? 'Verificando...' : currentUsername ? 'Cambiar Usuario' : 'Comenzar'}
        </Button>
      </form>

      <p className="text-xs text-center" style={{ color: themeConfig.accent }}>
        Tus datos se guardan y sincronizan automáticamente entre dispositivos.
      </p>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowConfirmDialog(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 rounded-3xl z-50 p-6 md:w-[400px]"
              style={{ backgroundColor: themeConfig.background }}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">🤔</div>
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: themeConfig.text }}
                >
                  ¡El usuario ya existe!
                </h3>
                <p className="mb-6" style={{ color: themeConfig.accent }}>
                  El usuario "{inputUsername}" ya tiene datos. ¿Qué te gustaría hacer?
                </p>

                {existingData && (
                  <div 
                    className="rounded-xl p-3 mb-4 text-left"
                    style={{ backgroundColor: themeConfig.muted }}
                  >
                    <p className="text-xs mb-1" style={{ color: themeConfig.accent }}>Datos existentes:</p>
                    <p className="text-sm font-medium" style={{ color: themeConfig.text }}>
                      ☕ {existingData.entries.length} cafés registrados
                    </p>
                    <p className="text-xs" style={{ color: themeConfig.accent }}>
                      Desde {new Date(existingData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={handleLoadExisting}
                    className="w-full rounded-xl font-bold"
                    style={{
                      backgroundColor: themeConfig.primary,
                      color: themeConfig.text
                    }}
                  >
                    Cargar Datos Existentes
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCreateNew}
                    className="w-full rounded-xl"
                    style={{
                      borderColor: themeConfig.border,
                      color: themeConfig.text
                    }}
                  >
                    Crear Nueva Cuenta
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setShowConfirmDialog(false)}
                    className="w-full"
                    style={{ color: themeConfig.accent }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

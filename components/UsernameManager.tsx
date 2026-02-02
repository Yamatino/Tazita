'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoffeeData } from '@/types/coffee';

interface UsernameManagerProps {
  currentUsername: string | null;
  onSetUsername: (username: string) => Promise<{ exists: boolean; data?: CoffeeData }>;
  onSwitchUser: (username: string) => void;
}

export function UsernameManager({ currentUsername, onSetUsername, onSwitchUser }: UsernameManagerProps) {
  const [inputUsername, setInputUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [existingData, setExistingData] = useState<CoffeeData | undefined>(undefined);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      const result = await onSetUsername(inputUsername.trim());
      
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
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {/* Current User Display */}
      {currentUsername && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FFE4A1] to-[#FFD1DC] rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <User className="h-5 w-5 text-[#5C4A3A]" />
              </div>
              <div>
                <p className="text-xs text-[#8B6F47]">Usuario actual</p>
                <p className="text-lg font-bold text-[#5C4A3A]">{currentUsername}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[#8B6F47] hover:text-[#5C4A3A] hover:bg-white/50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Salir
            </Button>
          </div>
        </motion.div>
      )}

      {/* Username Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="username" className="text-[#5C4A3A] font-medium">
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
            className="mt-1 border-[#E8DCC8] focus:border-[#FFE4A1] focus:ring-[#FFE4A1] rounded-xl"
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
          className="w-full rounded-xl bg-[#FFE4A1] hover:bg-[#FFD93D] text-[#5C4A3A] font-bold"
        >
          {isChecking ? 'Verificando...' : currentUsername ? 'Cambiar Usuario' : 'Comenzar'}
        </Button>
      </form>

      <p className="text-xs text-[#8B6F47] text-center">
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
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white rounded-3xl z-50 p-6 md:w-[400px]"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-xl font-bold text-[#5C4A3A] mb-2">
                  ¡El usuario ya existe!
                </h3>
                <p className="text-[#8B6F47] mb-6">
                  El usuario "{inputUsername}" ya tiene datos. ¿Qué te gustaría hacer?
                </p>

                {existingData && (
                  <div className="bg-[#FFF8E7] rounded-xl p-3 mb-4 text-left">
                    <p className="text-xs text-[#8B6F47] mb-1">Datos existentes:</p>
                    <p className="text-sm text-[#5C4A3A]">
                      ☕ {existingData.entries.length} cafés registrados
                    </p>
                    <p className="text-xs text-[#8B6F47]">
                      Desde {new Date(existingData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={handleLoadExisting}
                    className="w-full rounded-xl bg-[#FFE4A1] hover:bg-[#FFD93D] text-[#5C4A3A] font-bold"
                  >
                    Cargar Datos Existentes
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCreateNew}
                    className="w-full rounded-xl border-[#E8DCC8]"
                  >
                    Crear Nueva Cuenta
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setShowConfirmDialog(false)}
                    className="w-full"
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

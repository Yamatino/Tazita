'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, Copy, Check, RefreshCw, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoffeeData, CoffeeEntry, generateRecoveryCode } from '@/types/coffee';

interface RecoveryCodeProps {
  data: CoffeeData | null;
  onLoadData: (code: string, entries: CoffeeEntry[]) => void;
}

export function RecoveryCode({ data, onLoadData }: RecoveryCodeProps) {
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [inputData, setInputData] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopy = async () => {
    if (!data) return;
    
    const exportData = {
      code: data.recoveryCode,
      entries: data.entries
    };
    
    await navigator.clipboard.writeText(JSON.stringify(exportData));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoad = () => {
    try {
      const parsed = JSON.parse(inputData);
      if (parsed.code && parsed.entries) {
        onLoadData(parsed.code, parsed.entries);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowLoadDialog(false);
          setInputCode('');
          setInputData('');
        }, 1500);
      }
    } catch (e) {
      alert('Código inválido. Asegurate de pegar todo el texto copiado.');
    }
  };

  const handleExport = () => {
    if (!data) return;
    
    const exportData = {
      code: data.recoveryCode,
      entries: data.entries
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tazita-backup-${data.recoveryCode}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-3">
          <Key className="h-5 w-5 text-[#D4A574]" />
          <h3 className="font-bold text-[#5C4A3A]">Código de Recuperación</h3>
        </div>

        {data && (
          <>
            <div className="bg-[#FFF8E7] rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#8B6F47] mb-1">Tu código:</p>
                  <p className="text-2xl font-mono font-bold text-[#5C4A3A] tracking-wider">
                    {data.recoveryCode}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="rounded-full hover:bg-[#FFE4A1]/50"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-[#8B6F47]" />
                  )}
                </Button>
              </div>
            </div>

            <p className="text-xs text-[#8B6F47] mb-3">
              Guardá este código o el archivo de backup para recuperar tus datos en otro dispositivo.
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex-1 rounded-xl border-[#E8DCC8] hover:bg-[#FFE4A1]/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLoadDialog(true)}
                className="flex-1 rounded-xl border-[#E8DCC8] hover:bg-[#FFE4A1]/30"
              >
                <Upload className="h-4 w-4 mr-2" />
                Cargar
              </Button>
            </div>
          </>
        )}
      </motion.div>

      {/* Load Dialog */}
      <AnimatePresence>
        {showLoadDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowLoadDialog(false)}
            />
            
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6"
            >
              <AnimatePresence>
                {showSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-6xl mb-4">✨🎉✨</div>
                    <p className="text-xl font-bold text-[#5C4A3A]">¡Datos cargados!</p>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-[#5C4A3A] mb-4">
                      Cargar datos guardados
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-[#5C4A3A] mb-2 block">
                          Pegá el código o el contenido del archivo:
                        </Label>
                        <textarea
                          value={inputData}
                          onChange={(e) => setInputData(e.target.value)}
                          placeholder={`{&quot;code&quot;: &quot;ABC123&quot;, &quot;entries&quot;: [...]}`}
                          className="w-full h-32 p-3 rounded-xl border border-[#E8DCC8] focus:border-[#FFE4A1] focus:ring-[#FFE4A1] text-sm font-mono resize-none"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowLoadDialog(false)}
                          className="flex-1 rounded-xl"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleLoad}
                          disabled={!inputData.trim()}
                          className="flex-1 rounded-xl bg-[#FFE4A1] hover:bg-[#FFD93D] text-[#5C4A3A] font-bold"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Cargar
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

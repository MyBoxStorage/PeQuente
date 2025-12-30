'use client';

import { useState } from 'react';
import { X, MapPin } from 'lucide-react';

interface CEPSearchProps {
  onClose: () => void;
}

export default function CEPSearch({ onClose }: CEPSearchProps) {
  const [cep, setCep] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateCEP = (value: string) => {
    const cleanCEP = value.replace(/\D/g, '');
    return cleanCEP.length === 8;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCEP(cep)) {
      setIsValid(true);
      // Aqui você pode adicionar lógica para buscar informações do CEP
      // Por enquanto, apenas fecha o modal
      onClose();
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full mx-4 border border-[#252525]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MapPin className="text-[#FFD700]" size={24} />
            <h2 className="text-2xl font-bold text-white">Informe seu CEP</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          Para verificar a disponibilidade de produtos e opções de entrega para sua região, 
          informe seu CEP abaixo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={cep}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                  setCep(value);
                  setIsValid(true);
                }
              }}
              placeholder="00000-000"
              className={`w-full px-4 py-3 bg-[#252525] text-white rounded-lg focus:outline-none focus:ring-2 ${
                isValid ? 'focus:ring-[#FFD700]' : 'focus:ring-[#DC143C] border-[#DC143C]'
              }`}
              maxLength={8}
            />
            {!isValid && (
              <p className="text-[#DC143C] text-sm mt-2">
                Por favor, insira um CEP válido (8 dígitos)
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-[#252525] text-white font-medium py-3 px-6 rounded-lg hover:border-[#FFD700] transition"
            >
              Pular
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#FFD700] text-[#0a0a0a] font-bold py-3 px-6 rounded-lg hover:bg-[#FFD700]/90 transition"
            >
              Buscar
            </button>
          </div>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Não se preocupe, você pode alterar isso depois.
        </p>
      </div>
    </div>
  );
}

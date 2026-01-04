'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#FF0000]/20 p-4">
            <AlertCircle className="text-[#FF0000] size-12" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Oops! Algo deu errado
        </h1>
        
        <p className="text-gray-400 mb-8">
          Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
        </p>

        {error.digest && (
          <p className="text-xs text-gray-500 mb-8">
            Código do erro: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="default"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Tentar Novamente
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2"
          >
            <Link href="/">
              <Home size={16} />
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

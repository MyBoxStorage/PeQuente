'use client';

import * as THREE from 'three';
import { useEffect } from 'react';

/**
 * Componente temporário para testar importação de Three.js
 * Será removido após verificação
 */
export default function TestThree() {
  useEffect(() => {
    // Testa se Three.js está importando corretamente
    console.log('Three.js importado com sucesso:', THREE);
    console.log('Versão Three.js:', THREE.REVISION);
  }, []);

  return (
    <div className="p-4 text-sm text-gray-400">
      Verifique o console do navegador para confirmar a importação do Three.js
    </div>
  );
}

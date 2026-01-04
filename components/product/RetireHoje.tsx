'use client';

import { MapPin } from 'lucide-react';

export default function RetireHoje() {
  return (
    <div className="bg-[#2d2d2d] rounded-lg p-6 border border-[#353535] mt-6">
      <div className="flex items-start gap-4">
        <div className="bg-[#FF0000]/10 p-3 rounded-lg flex-shrink-0">
          <MapPin className="text-[#FF0000]" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">
            Retire Hoje
          </h3>
          <p className="text-gray-400 text-sm mb-2">
            Centro de Paraíba do Sul, RJ
          </p>
          <p className="text-gray-300 text-sm">
            Praça Garcia 136/140, Paraíba do Sul - RJ
          </p>
        </div>
      </div>
    </div>
  );
}

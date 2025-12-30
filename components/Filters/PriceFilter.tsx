'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

interface PriceFilterProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function PriceFilter({ min, max, value, onChange }: PriceFilterProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(min, Math.min(parseInt(e.target.value) || min, localValue[1]));
    setLocalValue([newMin, localValue[1]]);
    onChange([newMin, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.min(max, Math.max(parseInt(e.target.value) || max, localValue[0]));
    setLocalValue([localValue[0], newMax]);
    onChange([localValue[0], newMax]);
  };

  return (
    <div>
      <h3 className="text-white font-medium mb-3">Preço</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={min}
            max={max}
            value={localValue[0]}
            onChange={handleMinChange}
            className="w-24 px-3 py-2 bg-[#252525] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            placeholder="Min"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min={min}
            max={max}
            value={localValue[1]}
            onChange={handleMaxChange}
            className="w-24 px-3 py-2 bg-[#252525] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            placeholder="Max"
          />
        </div>
        <div className="text-sm text-gray-400">
          {formatPrice(localValue[0])} - {formatPrice(localValue[1])}
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => {
            const newMax = parseInt(e.target.value);
            setLocalValue([localValue[0], newMax]);
            onChange([localValue[0], newMax]);
          }}
          className="w-full h-2 bg-[#252525] rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
        />
      </div>
    </div>
  );
}

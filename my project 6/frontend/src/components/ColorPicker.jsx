import React from 'react';
import { PAPER_COLORS } from '../constants';
import { Check } from 'lucide-react';

export default function ColorPicker({ selectedColor, onSelectColor, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex items-center flex-wrap gap-2">
      {PAPER_COLORS.map((paper) => {
        const isSelected = selectedColor.toUpperCase() === paper.hex.toUpperCase();
        return (
          <button
            key={paper.id}
            type="button"
            title={`${paper.name} (${paper.hex})`}
            onClick={() => onSelectColor(paper.hex)}
            style={{ backgroundColor: paper.hex, borderColor: paper.border }}
            className={`
              ${sizeClasses[size] || sizeClasses.md}
              rounded-full border-2 transition-all duration-150 transform hover:scale-110
              flex items-center justify-center shadow-sm relative focus:outline-none focus:ring-2 focus:ring-stone-400
              ${isSelected ? 'ring-2 ring-stone-800 scale-105 shadow-md' : 'hover:shadow'}
            `}
          >
            {isSelected && (
              <Check className="w-3.5 h-3.5 text-stone-800 stroke-[2.5]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

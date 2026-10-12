import React from 'react';
import { PAPER_COLORS } from '../constants';
import { Pin, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterBar({
  selectedColor,
  onSelectColor,
  pinnedFilter,
  onTogglePinnedFilter,
  sortBy,
  onSortChange,
  notes,
}) {
  // Count notes per color
  const colorCounts = notes.reduce((acc, note) => {
    const col = (note.color || '').toUpperCase();
    acc[col] = (acc[col] || 0) + 1;
    return acc;
  }, {});

  const totalCount = notes.length;
  const pinnedCount = notes.filter((n) => n.pinned).length;

  const hasActiveFilter = selectedColor !== '' || pinnedFilter;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-6 border-b border-stone-200/70">
      
      {/* Paper Color Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {/* All notes */}
        <button
          onClick={() => onSelectColor('')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 border whitespace-nowrap ${
            selectedColor === ''
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white/80 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <span>All Papers</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedColor === '' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200/80 text-stone-600'}`}>
            {totalCount}
          </span>
        </button>

        {/* Color buttons */}
        {PAPER_COLORS.map((paper) => {
          const count = colorCounts[paper.hex.toUpperCase()] || 0;
          const isSelected = selectedColor.toUpperCase() === paper.hex.toUpperCase();

          return (
            <button
              key={paper.id}
              onClick={() => onSelectColor(isSelected ? '' : paper.hex)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 border whitespace-nowrap shadow-sm ${
                isSelected ? 'ring-2 ring-stone-900 font-semibold' : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: paper.hex,
                borderColor: paper.border,
              }}
            >
              <span className="w-2 h-2 rounded-full border border-black/20" style={{ backgroundColor: paper.hex }} />
              <span className="text-stone-800">{paper.name.split(' ')[0]}</span>
              {count > 0 && (
                <span className="text-[10px] bg-black/10 text-stone-800 px-1.5 rounded-full font-mono">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Pin filter, Sort, Reset */}
      <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
        {/* Pinned filter toggle */}
        <button
          type="button"
          onClick={() => onTogglePinnedFilter(!pinnedFilter)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center space-x-1.5 ${
            pinnedFilter
              ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold shadow-sm'
              : 'bg-white/80 border-stone-200 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Pin className={`w-3.5 h-3.5 ${pinnedFilter ? 'fill-amber-900' : ''}`} />
          <span>Pinned</span>
          {pinnedCount > 0 && (
            <span className="text-[10px] bg-black/10 px-1.5 rounded-full">
              {pinnedCount}
            </span>
          )}
        </button>

        {/* Sort Select */}
        <div className="flex items-center space-x-1.5 text-xs text-stone-600 bg-white/80 border border-stone-200 rounded-xl px-2.5 py-1.5 shadow-sm">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-stone-800 focus:outline-none text-xs font-medium cursor-pointer"
          >
            <option value="newest">Newest Updated</option>
            <option value="oldest">Oldest Updated</option>
            <option value="az">Title (A-Z)</option>
            <option value="za">Title (Z-A)</option>
          </select>
        </div>

        {/* Reset filter */}
        {hasActiveFilter && (
          <button
            onClick={() => {
              onSelectColor('');
              onTogglePinnedFilter(false);
            }}
            title="Reset filters"
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-xl transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}

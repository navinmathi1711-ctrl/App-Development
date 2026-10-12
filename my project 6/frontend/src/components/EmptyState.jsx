import React from 'react';
import { BookOpen, SearchX, Plus, RotateCcw } from 'lucide-react';

export default function EmptyState({ isSearching, onResetSearch, onOpenNewNote }) {
  if (isSearching) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-stone-200/80 text-stone-600 flex items-center justify-center">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="font-serif font-bold text-xl text-stone-800 mb-1">No notes match your search</h3>
        <p className="text-stone-500 text-sm mb-6">
          Try searching for different keywords or clear your active paper color filters.
        </p>
        <button
          onClick={onResetSearch}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium shadow transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="py-20 text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#EBE2D4] text-stone-700 flex items-center justify-center shadow-inner">
        <BookOpen className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="font-serif font-bold text-2xl text-stone-900 mb-2">Your Folio is Empty</h3>
      <p className="text-stone-600 text-sm mb-6 leading-relaxed">
        Capture your thoughts, ideas, meeting notes, or checklists. Choose your paper tone and organize effortlessly.
      </p>
      <button
        onClick={onOpenNewNote}
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-sm font-medium shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
      >
        <Plus className="w-4 h-4" />
        <span>Create First Note</span>
      </button>
    </div>
  );
}

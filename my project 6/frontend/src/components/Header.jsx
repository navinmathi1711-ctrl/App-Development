import React from 'react';
import { BookOpen, Search, Plus, LayoutGrid, List, Database, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Header({
  searchQuery,
  onSearchChange,
  onOpenNewNote,
  viewMode,
  onToggleViewMode,
  health,
  onOpenHealthModal,
}) {
  const isMongoConnected = health?.database?.connected;

  return (
    <header className="sticky top-0 z-30 bg-[#F8F5EE]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-folio-700 text-stone-50 flex items-center justify-center shadow-md shadow-folio-800/20">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif font-bold text-2xl text-stone-900 tracking-tight leading-none">
                  Folio Notes
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider bg-stone-200/80 text-stone-700 px-1.5 py-0.5 rounded font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-stone-500 font-sans hidden sm:block">
                Tactile stationery notes with React, Express & MongoDB
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-6">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes by title, content..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/80 hover:bg-white focus:bg-white border border-stone-200 rounded-xl pl-10 pr-9 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 shadow-sm transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 p-0.5 text-stone-400 hover:text-stone-700 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Database & API Status Badge */}
            <button
              type="button"
              onClick={onOpenHealthModal}
              title="Click to view database connection info"
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors shadow-sm ${
                isMongoConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isMongoConnected ? 'MongoDB Live' : 'API Active'}</span>
              {isMongoConnected ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-amber-600" />
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="bg-stone-200/80 p-1 rounded-xl flex items-center space-x-1">
              <button
                type="button"
                onClick={() => onToggleViewMode('grid')}
                title="Grid layout"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onToggleViewMode('list')}
                title="List layout"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* New Note Button */}
            <button
              onClick={onOpenNewNote}
              className="bg-stone-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

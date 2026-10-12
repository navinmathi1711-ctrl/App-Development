import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import QuickAdd from './components/QuickAdd';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import HealthModal from './components/HealthModal';
import EmptyState from './components/EmptyState';
import { fetchHealth, fetchNotes, createNote, updateNote, deleteNote } from './api';
import { Sparkles, AlertCircle, RefreshCw, Pin, Layers } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & layout
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pinnedFilter, setPinnedFilter] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals & forms
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [health, setHealth] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load health info
  const checkHealth = useCallback(async () => {
    try {
      const data = await fetchHealth();
      setHealth(data);
    } catch (err) {
      console.error('Health check failed', err);
    }
  }, []);

  // Fetch notes from Express API
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotes({ q: searchQuery, color: selectedColor });
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load notes', err);
      setError('Unable to load notes. Please verify the Express backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedColor]);

  // Initial load
  useEffect(() => {
    checkHealth();
    loadNotes();
  }, [checkHealth, loadNotes]);

  // Global keyboard shortcuts (N for new note, / for search)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingNote(null);
        setIsNoteModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Create note
  const handleCreate = async (noteData) => {
    try {
      const created = await createNote(noteData);
      setNotes((prev) => [created, ...prev]);
      showToast('Note created successfully!', 'success');
      checkHealth();
    } catch (err) {
      showToast(err.message || 'Error creating note', 'error');
      throw err;
    }
  };

  // Update existing note
  const handleUpdate = async (noteData) => {
    if (!editingNote) return;
    const noteId = editingNote._id || editingNote.id;
    try {
      const updated = await updateNote(noteId, noteData);
      setNotes((prev) => prev.map((n) => ((n._id || n.id) === noteId ? updated : n)));
      showToast('Note updated successfully!', 'success');
      checkHealth();
    } catch (err) {
      showToast(err.message || 'Error updating note', 'error');
      throw err;
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => (n._id || n.id) !== id));
      showToast('Note removed from folio', 'info');
      checkHealth();
    } catch (err) {
      showToast(err.message || 'Error deleting note', 'error');
    }
  };

  // Quick change paper color
  const handleUpdateColor = async (id, newColor) => {
    try {
      const updated = await updateNote(id, { color: newColor });
      setNotes((prev) => prev.map((n) => ((n._id || n.id) === id ? updated : n)));
      showToast('Paper color updated', 'success');
    } catch (err) {
      showToast('Failed to update paper color', 'error');
    }
  };

  // Toggle pin
  const handleTogglePin = async (id, newPinned) => {
    try {
      const updated = await updateNote(id, { pinned: newPinned });
      setNotes((prev) => prev.map((n) => ((n._id || n.id) === id ? updated : n)));
      showToast(newPinned ? 'Note pinned to top' : 'Note unpinned', 'info');
    } catch (err) {
      showToast('Failed to toggle pin', 'error');
    }
  };

  // Edit action
  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  // New Note action
  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  // Filtered & sorted notes
  const displayedNotes = useMemo(() => {
    let result = [...notes];

    // Client-side search refine (if any extra filter applied)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q)
      );
    }

    // Color filter
    if (selectedColor) {
      result = result.filter(
        (n) => (n.color || '').toUpperCase() === selectedColor.toUpperCase()
      );
    }

    // Pinned filter
    if (pinnedFilter) {
      result = result.filter((n) => n.pinned);
    }

    // Sorting
    result.sort((a, b) => {
      // Pinned notes always on top unless sorting by pinned specifically
      if (a.pinned !== b.pinned) {
        return b.pinned ? 1 : -1;
      }

      if (sortBy === 'newest') {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
      }
      if (sortBy === 'az') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'za') {
        return (b.title || '').localeCompare(a.title || '');
      }
      return 0;
    });

    return result;
  }, [notes, searchQuery, selectedColor, pinnedFilter, sortBy]);

  // Separate pinned and other notes for visual distinction when there are both
  const { pinnedNotes, otherNotes } = useMemo(() => {
    const pinned = displayedNotes.filter((n) => n.pinned);
    const other = displayedNotes.filter((n) => !n.pinned);
    return { pinnedNotes: pinned, otherNotes: other };
  }, [displayedNotes]);

  const hasNotes = notes.length > 0;
  const hasSearchResults = displayedNotes.length > 0;
  const isSearching = searchQuery.trim() !== '' || selectedColor !== '' || pinnedFilter;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-stone-900">
      
      {/* Top Navbar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewNote={handleOpenCreate}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        health={health}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Quick Add Bar */}
        <QuickAdd onAddNote={handleCreate} />

        {/* Filters & Color Strip */}
        <FilterBar
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          pinnedFilter={pinnedFilter}
          onTogglePinnedFilter={setPinnedFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          notes={notes}
        />

        {/* Error notification banner if API is down */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={loadNotes}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-xs font-semibold text-red-900 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-stone-500">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
            <p className="text-xs font-mono uppercase tracking-wider">Loading folio notes...</p>
          </div>
        )}

        {/* Notes Grid / List */}
        {!loading && (
          <>
            {!hasNotes || !hasSearchResults ? (
              <EmptyState
                isSearching={isSearching}
                onResetSearch={() => {
                  setSearchQuery('');
                  setSelectedColor('');
                  setPinnedFilter(false);
                }}
                onOpenNewNote={handleOpenCreate}
              />
            ) : (
              <div className="space-y-8">
                {/* Pinned section (if any) */}
                {pinnedNotes.length > 0 && otherNotes.length > 0 && (
                  <section>
                    <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-wider text-amber-900/80 font-bold mb-4">
                      <Pin className="w-3.5 h-3.5 fill-amber-800 text-amber-800" />
                      <span>Pinned Notes ({pinnedNotes.length})</span>
                    </div>

                    <div
                      className={
                        viewMode === 'grid'
                          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                          : 'space-y-4 max-w-3xl mx-auto'
                      }
                    >
                      {pinnedNotes.map((note) => (
                        <NoteCard
                          key={note._id || note.id}
                          note={note}
                          onEdit={handleOpenEdit}
                          onDelete={handleDelete}
                          onUpdateColor={handleUpdateColor}
                          onTogglePin={handleTogglePin}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Main / Other Notes Section */}
                <section>
                  {pinnedNotes.length > 0 && otherNotes.length > 0 && (
                    <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-wider text-stone-500 font-bold mb-4">
                      <Layers className="w-3.5 h-3.5 text-stone-400" />
                      <span>Other Notes ({otherNotes.length})</span>
                    </div>
                  )}

                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                        : 'space-y-4 max-w-3xl mx-auto'
                    }
                  >
                    {(pinnedNotes.length > 0 && otherNotes.length > 0 ? otherNotes : displayedNotes).map((note) => (
                      <NoteCard
                        key={note._id || note.id}
                        note={note}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                        onUpdateColor={handleUpdateColor}
                        onTogglePin={handleTogglePin}
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-stone-200/80 bg-stone-100/50 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif italic">
            Folio Notes — Tactile paper notes with Express, MongoDB & React
          </p>
          <div className="flex items-center space-x-4 text-[11px] font-mono text-stone-500">
            <span>Press <kbd className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800 font-semibold">N</kbd> for new note</span>
            <span>•</span>
            <button
              onClick={() => setIsHealthModalOpen(true)}
              className="hover:text-stone-900 underline underline-offset-2"
            >
              API: 5000 / Proxy: 5173
            </button>
          </div>
        </div>
      </footer>

      {/* Note Creation / Editing Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={editingNote ? handleUpdate : handleCreate}
        initialData={editingNote}
      />

      {/* System Health / MongoDB Connection Modal */}
      <HealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        health={health}
        onRefresh={() => {
          checkHealth();
          loadNotes();
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-lg border text-xs font-medium flex items-center space-x-2 ${
              toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-stone-900 text-white border-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { Pin, Edit3, Trash2, Copy, Check, Palette, Clock } from 'lucide-react';
import { PAPER_COLORS } from '../constants';

export default function NoteCard({ note, onEdit, onDelete, onUpdateColor, onTogglePin }) {
  const [copied, setCopied] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const text = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3500);
      return;
    }
    onDelete(note._id || note.id);
  };

  const handleColorChange = (e, hex) => {
    e.stopPropagation();
    onUpdateColor(note._id || note.id, hex);
    setShowColorPicker(false);
  };

  // Format relative or date time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div
      onClick={() => onEdit(note)}
      style={{ backgroundColor: note.color || '#FEF9C3' }}
      className={`
        group relative rounded-2xl p-5 shadow-paper hover:shadow-paper-lifted
        border border-black/10 transition-all duration-200 cursor-pointer
        flex flex-col justify-between min-h-[190px] paper-folded-corner
        ${note.pinned ? 'ring-2 ring-amber-500/30' : ''}
      `}
    >
      {/* Note Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug line-clamp-2 break-words">
            {note.title || 'Untitled Note'}
          </h3>

          {/* Pin Button */}
          <button
            type="button"
            title={note.pinned ? 'Unpin note' : 'Pin note'}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note._id || note.id, !note.pinned);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              note.pinned
                ? 'text-amber-800 bg-amber-500/20'
                : 'text-stone-400 hover:text-stone-700 opacity-60 group-hover:opacity-100'
            }`}
          >
            <Pin className={`w-4 h-4 ${note.pinned ? 'fill-amber-800' : ''}`} />
          </button>
        </div>

        {/* Note Body */}
        <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap break-words line-clamp-6 font-sans">
          {note.content || <span className="italic text-stone-400">Empty sheet...</span>}
        </p>
      </div>

      {/* Note Footer */}
      <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
        <div className="flex items-center text-[11px] text-stone-500 font-medium">
          <Clock className="w-3 h-3 mr-1 opacity-70" />
          <span>{formatTime(note.updatedAt || note.createdAt)}</span>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          {/* Quick Color Picker */}
          <div className="relative">
            <button
              type="button"
              title="Change paper color"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-black/5 transition"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>

            {showColorPicker && (
              <div
                className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-xl shadow-xl border border-stone-200 flex gap-1.5 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {PAPER_COLORS.map((p) => (
                  <button
                    key={p.id}
                    title={p.name}
                    style={{ backgroundColor: p.hex }}
                    onClick={(e) => handleColorChange(e, p.hex)}
                    className="w-5 h-5 rounded-full border border-stone-300 hover:scale-125 transition-transform"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Copy Button */}
          <button
            type="button"
            title="Copy note text"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-black/5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Edit Button */}
          <button
            type="button"
            title="Edit note"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-black/5 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            title={confirmDelete ? 'Click again to confirm delete' : 'Delete note'}
            onClick={handleDelete}
            className={`p-1.5 rounded-lg transition ${
              confirmDelete
                ? 'bg-red-500 text-white font-bold animate-pulse text-[11px] px-2'
                : 'text-stone-500 hover:text-red-600 hover:bg-black/5'
            }`}
          >
            {confirmDelete ? 'Delete?' : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

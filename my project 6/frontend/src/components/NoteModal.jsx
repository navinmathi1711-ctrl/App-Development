import React, { useState, useEffect, useRef } from 'react';
import { X, Pin, Check, Sparkles, BookOpen, AlignLeft } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { DEFAULT_COLOR } from '../constants';

export default function NoteModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [pinned, setPinned] = useState(false);
  const [isRuled, setIsRuled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const titleInputRef = useRef(null);
  const contentInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setContent(initialData.content || '');
        setColor(initialData.color || DEFAULT_COLOR);
        setPinned(Boolean(initialData.pinned));
      } else {
        setTitle('');
        setContent('');
        setColor(DEFAULT_COLOR);
        setPinned(false);
      }
      setError('');
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialData]);

  // Handle Ctrl+Enter to save, Esc to cancel
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError('Please add a title or some content to your note.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        title: title.trim() || 'Untitled Note',
        content,
        color,
        pinned,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in"
      onKeyDown={handleKeyDown}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden transition-all duration-200 transform scale-100 flex flex-col max-h-[90vh]"
        style={{ backgroundColor: color }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 border-b border-black/10 flex items-center justify-between bg-black/[0.02]">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-serif italic text-stone-700 tracking-wide">
              {initialData ? 'Editing Folio Sheet' : 'New Folio Sheet'}
            </span>
            <button
              type="button"
              onClick={() => setIsRuled(!isRuled)}
              title={isRuled ? 'Switch to blank paper' : 'Switch to ruled paper'}
              className={`p-1.5 rounded-lg text-xs font-medium transition ${
                isRuled ? 'bg-black/10 text-stone-900' : 'text-stone-500 hover:bg-black/5'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5 inline mr-1" />
              {isRuled ? 'Ruled' : 'Blank'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Pin Toggle */}
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              title={pinned ? 'Unpin note' : 'Pin note to top'}
              className={`p-1.5 rounded-lg transition ${
                pinned
                  ? 'bg-amber-600/20 text-amber-900 font-semibold'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-black/5'
              }`}
            >
              <Pin className={`w-4 h-4 ${pinned ? 'fill-amber-800' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-black/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-100/90 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Title Input */}
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Note Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-serif font-bold text-stone-900 bg-transparent placeholder-stone-400 focus:outline-none border-b border-black/10 pb-2"
          />

          {/* Content Area */}
          <div className="flex-1 min-h-[220px] max-h-[50vh] overflow-y-auto">
            <textarea
              ref={contentInputRef}
              placeholder="Write your note thoughts, checklist, or ideas here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full h-full min-h-[220px] bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none resize-none text-base leading-relaxed ${
                isRuled ? 'paper-ruled' : ''
              }`}
            />
          </div>

          {/* Bottom Bar: Color Picker, Metadata & Actions */}
          <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col space-y-2">
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">Paper Color</span>
              <ColorPicker selectedColor={color} onSelectColor={setColor} size="md" />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
              <div className="text-[11px] text-stone-500 font-mono">
                <span>{wordCount} words</span>
                <span className="mx-1.5">•</span>
                <span>{charCount} chars</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-black/5 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-sm font-medium shadow hover:shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Note' : 'Create Note'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

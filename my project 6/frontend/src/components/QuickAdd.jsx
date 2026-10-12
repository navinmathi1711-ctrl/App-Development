import React, { useState, useRef, useEffect } from 'react';
import { Pin, Plus, Check } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { DEFAULT_COLOR } from '../constants';

export default function QuickAdd({ onAddNote }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [pinned, setPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef(null);
  const contentInputRef = useRef(null);

  // Close on outside click if fields are empty
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (!title.trim() && !content.trim()) {
          setIsExpanded(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title, content]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setIsExpanded(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddNote({
        title: title.trim() || 'Untitled Note',
        content,
        color,
        pinned,
      });

      // Reset
      setTitle('');
      setContent('');
      setColor(DEFAULT_COLOR);
      setPinned(false);
      setIsExpanded(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor: color }}
      className={`
        w-full max-w-2xl mx-auto rounded-2xl shadow-paper border border-black/10
        transition-all duration-200 overflow-hidden mb-8
      `}
    >
      {!isExpanded ? (
        <div
          onClick={() => {
            setIsExpanded(true);
            setTimeout(() => contentInputRef.current?.focus(), 50);
          }}
          className="p-4 flex items-center justify-between cursor-text text-stone-500 hover:text-stone-700"
        >
          <span className="font-sans text-sm font-medium">Write a new note or quick thought...</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-black/5 px-2 py-1 rounded-md text-stone-600 font-mono">Press to write</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
          {/* Title & Pin */}
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-serif font-bold text-stone-900 bg-transparent placeholder-stone-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`p-1.5 rounded-lg transition ${
                pinned ? 'bg-amber-600/20 text-amber-900' : 'text-stone-400 hover:text-stone-700'
              }`}
              title={pinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin className={`w-4 h-4 ${pinned ? 'fill-amber-800' : ''}`} />
            </button>
          </div>

          {/* Content Area */}
          <textarea
            ref={contentInputRef}
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-stone-800 text-sm leading-relaxed placeholder-stone-400 focus:outline-none resize-none"
          />

          {/* Color Picker & Action Toolbar */}
          <div className="pt-2 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-stone-500 font-medium">Color:</span>
              <ColorPicker selectedColor={color} onSelectColor={setColor} size="sm" />
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setContent('');
                  setIsExpanded(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-black/5"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Adding...' : 'Add Note'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

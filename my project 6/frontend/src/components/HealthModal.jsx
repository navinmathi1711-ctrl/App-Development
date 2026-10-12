import React from 'react';
import { X, Database, Server, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function HealthModal({ isOpen, onClose, health, onRefresh }) {
  if (!isOpen) return null;

  const isConnected = health?.database?.connected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">System Health</h3>
              <p className="text-xs text-stone-500">API & Database Connection Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-stone-600 font-medium">
                <Server className="w-4 h-4 mr-2 text-stone-500" /> Express API
              </span>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Port 5000 Active
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-stone-600 font-medium">
                <Database className="w-4 h-4 mr-2 text-stone-500" /> MongoDB
              </span>
              {isConnected ? (
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Fallback Mode
                </span>
              )}
            </div>

            <div className="text-xs text-stone-500 pt-2 border-t border-stone-200">
              <span className="font-medium text-stone-700">Target URI: </span>
              <code className="bg-stone-200/70 px-1.5 py-0.5 rounded text-[11px] text-stone-800 font-mono">
                {health?.database?.uri || 'mongodb://127.0.0.1:27017/folio_notes'}
              </code>
            </div>

            {health?.database?.notesCount !== undefined && (
              <div className="text-xs text-stone-500 flex justify-between">
                <span>Stored Notes Count:</span>
                <span className="font-semibold text-stone-800">{health.database.notesCount}</span>
              </div>
            )}
          </div>

          {!isConnected && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 space-y-1.5">
              <p className="font-semibold flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                MongoDB is currently not responding
              </p>
              <p className="text-amber-800 leading-relaxed">
                The app is operating in local fallback memory storage so you can create, search, and edit notes right away.
              </p>
              <p className="text-amber-700 pt-1">
                To connect to MongoDB:
              </p>
              <ol className="list-decimal list-inside space-y-0.5 text-stone-600 font-mono text-[11px]">
                <li>Start MongoDB daemon locally (<code className="text-stone-800">mongod</code>)</li>
                <li>Or update <code className="text-stone-800">backend/.env</code> with your MongoDB Atlas connection string</li>
                <li>Restart backend (<code className="text-stone-800">npm start</code>)</li>
              </ol>
            </div>
          )}

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={onRefresh}
              className="inline-flex items-center text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-check Status
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

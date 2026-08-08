import React from 'react';

interface EmptyStateProps {
  onQuickSelect: (ticketId: string) => void;
}

const FEATURES = [
  { label: 'Historical Evidence', icon: '📚', desc: 'TF-IDF similarity search over resolved tickets' },
  { label: 'Policy Checks', icon: '🛡️', desc: 'Automated safety guardrail evaluation' },
  { label: 'Decision Confidence', icon: '📊', desc: 'Weighted precedent agreement scoring' },
  { label: 'Safe Execution', icon: '⚡', desc: 'Only auto-resolves when all gates pass' },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onQuickSelect }) => {
  return (
    <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-8 sm:p-12 backdrop-blur-xl shadow-xl relative overflow-hidden my-4">

      <div className="max-w-lg mx-auto text-center space-y-5">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-900/50 to-indigo-900/50 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl shadow-purple-950/30">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Heading */}
        <div>
          <h3 className="text-xl font-bold text-white">Ready to analyze</h3>
          <p className="text-sm text-gray-400 mt-1">
            Enter a ticket ID or choose a demo scenario below.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-3 text-left">
          {FEATURES.map((f) => (
            <div key={f.label} className="bg-gray-950/60 border border-gray-800/60 rounded-xl p-3">
              <div className="text-base mb-1">{f.icon}</div>
              <div className="text-xs font-semibold text-white">{f.label}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Quick select */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onQuickSelect('N-015')}
            className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            N-015 — Auto Resolve
          </button>
          <button
            onClick={() => onQuickSelect('N-002')}
            className="px-4 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-semibold transition flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            N-002 — Human Review
          </button>
        </div>
      </div>
    </div>
  );
};

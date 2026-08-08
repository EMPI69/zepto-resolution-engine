import React from 'react';
import { Precedent } from '../types';
import { formatActionName, formatPercentage } from '../utils/formatters';

interface EvidenceTableProps {
  precedents: Precedent[];
}

export const EvidenceTable: React.FC<EvidenceTableProps> = ({ precedents }) => {
  if (!precedents || precedents.length === 0) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
        No historical evidence found for this query.
      </div>
    );
  }

  const maxSimilarity = Math.max(...precedents.map((p) => p.similarity ?? 0));

  return (
    <div className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Historical Evidence
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Retrieved precedents from resolved support tickets</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-gray-950 text-indigo-300 border border-indigo-900/60 self-start sm:self-auto">
          {precedents.length} precedent{precedents.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-3">
        {precedents.map((item, idx) => {
          const isTopMatch = item.similarity === maxSimilarity && item.similarity > 0;
          const simPct = formatPercentage(item.similarity);
          const simPctNum = item.similarity <= 1 ? item.similarity * 100 : item.similarity;

          return (
            <div
              key={idx}
              className={`rounded-xl p-4 border transition-all duration-200 group relative overflow-hidden cursor-default ${
                isTopMatch
                  ? 'bg-gradient-to-r from-purple-950/40 via-gray-950 to-gray-950 border-purple-500/50 shadow-lg ring-1 ring-purple-500/20'
                  : 'bg-gray-950/70 border-gray-800/80 hover:border-purple-800/50 hover:shadow-md hover:bg-gray-950/90'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Left */}
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-900 text-purple-300 border border-purple-900/60">
                      #{item.ticket_id}
                    </span>
                    {item.category && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800 capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    )}
                    {isTopMatch && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                        <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Top Match
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-white">"{item.description}"</p>
                  {item.resolution_note && (
                    <p className="text-xs text-gray-400 italic">Note: {item.resolution_note}</p>
                  )}

                  {/* Similarity bar */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-grow max-w-[140px] bg-gray-900 rounded-full h-1.5 overflow-hidden border border-gray-800/60">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, simPctNum)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-300">{simPct} similarity</span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center flex-wrap sm:flex-nowrap gap-4 lg:gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-800/80">

                  <div className="text-left sm:text-right min-w-[110px]">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 block">Action Taken</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {formatActionName(item.action)}
                    </span>
                  </div>

                  <div className="text-left sm:text-right min-w-[60px]">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 block">CSAT</span>
                    <div className="flex items-center gap-1 font-mono font-bold text-amber-300 text-xs mt-0.5">
                      <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{item.csat ? item.csat.toFixed(1) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

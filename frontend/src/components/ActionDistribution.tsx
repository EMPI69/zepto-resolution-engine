import React from 'react';
import { formatActionName, formatPercentage } from '../utils/formatters';

interface ActionDistributionProps {
  distribution: Record<string, number>;
}

export const ActionDistribution: React.FC<ActionDistributionProps> = ({ distribution }) => {
  if (!distribution || Object.keys(distribution).length === 0) {
    return null;
  }

  const entries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
      <div className="mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Action Distribution
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Historical precedent resolution weights
        </p>
      </div>

      <div className="space-y-3">
        {entries.map(([actionKey, weight], idx) => {
          const pct = weight <= 1 ? weight * 100 : weight;
          const formattedPct = formatPercentage(weight);

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-200">
                  {formatActionName(actionKey)}
                </span>
                <span className="font-mono text-indigo-300">
                  {formattedPct}
                </span>
              </div>

              <div className="w-full bg-gray-950 rounded-full h-2.5 overflow-hidden border border-gray-800/60 p-0.5">
                <div
                  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

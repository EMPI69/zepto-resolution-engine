import React from 'react';
import { TicketResolutionResponse } from '../types';
import { formatActionName, formatPercentage } from '../utils/formatters';

interface WhyNotOtherActionProps {
  data: TicketResolutionResponse;
}

export const WhyNotOtherAction: React.FC<WhyNotOtherActionProps> = ({ data }) => {
  const { action_distribution, decision, suggested_action } = data;

  if (!action_distribution || Object.keys(action_distribution).length < 2) {
    return null;
  }

  const isAuto = decision === 'AUTO_RESOLVE';
  const entries = Object.entries(action_distribution).sort((a, b) => b[1] - a[1]);
  const topAction = entries[0];
  const topPct = topAction[1] <= 1 ? topAction[1] * 100 : topAction[1];
  const secondPct = entries[1] ? (entries[1][1] <= 1 ? entries[1][1] * 100 : entries[1][1]) : 0;
  const margin = topPct - secondPct;

  const explanation = isAuto
    ? `${formatActionName(topAction[0])} had stronger historical support (${Math.round(topPct)}%) and all decision gates were satisfied, so the action was executed automatically.`
    : margin < 15
    ? `The evidence is too close to confidently automate the decision — ${formatActionName(topAction[0])} leads at ${Math.round(topPct)}% but ${formatActionName(entries[1][0])} is only ${Math.round(margin)}% behind. The engine escalated rather than choosing automatically.`
    : `Although ${formatActionName(topAction[0])} leads the evidence, another decision gate failed before execution could proceed.`;

  return (
    <div className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
      <div className="mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why not the other action?
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Historical action support from resolved precedents</p>
      </div>

      <div className="space-y-3 mb-4">
        {entries.map(([actionKey, weight], idx) => {
          const pct = weight <= 1 ? weight * 100 : weight;
          const isTop = idx === 0;
          const isChosen = actionKey === suggested_action;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isTop ? 'text-white' : 'text-gray-300'}`}>
                    {formatActionName(actionKey)}
                  </span>
                  {isChosen && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 uppercase tracking-wider">
                      Recommended
                    </span>
                  )}
                </div>
                <span className={`font-mono ${isTop ? 'text-purple-300' : 'text-gray-400'}`}>
                  {formatPercentage(weight)}
                </span>
              </div>
              <div className="w-full bg-gray-950 rounded-full h-2.5 overflow-hidden border border-gray-800/60">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${
                    isTop
                      ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500'
                      : 'bg-gradient-to-r from-gray-600 to-gray-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={`rounded-xl p-3.5 text-xs border ${
        isAuto
          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
          : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
      }`}>
        <p className="leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
};

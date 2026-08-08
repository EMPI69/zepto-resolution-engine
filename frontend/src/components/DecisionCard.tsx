import React from 'react';
import { TicketResolutionResponse } from '../types';
import { formatActionName } from '../utils/formatters';

interface DecisionCardProps {
  data: TicketResolutionResponse;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ data }) => {
  const isAuto = data.decision === 'AUTO_RESOLVE';
  const isHumanReview = data.decision === 'HUMAN_REVIEW';

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-7 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300 ${
        isAuto
          ? 'bg-gradient-to-br from-emerald-950/60 via-gray-900/90 to-gray-950/90 border-emerald-500/40 shadow-emerald-950/20'
          : isHumanReview
          ? 'bg-gradient-to-br from-amber-950/60 via-gray-900/90 to-gray-950/90 border-amber-500/40 shadow-amber-950/20'
          : 'bg-gray-900/90 border-gray-800'
      }`}
    >
      {isAuto && <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />}
      {isHumanReview && <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />}

      <div className="relative z-10 flex flex-col gap-6">

        {/* Header: Ticket + Decision */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-gray-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-gray-950 border border-gray-800 text-purple-300">
                Ticket #{data.ticket_id}
              </span>
              <span className="text-xs text-gray-400">Customer Complaint</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white italic">
              "{data.description}"
            </h3>
          </div>

          {/* Decision Badge */}
          {isAuto ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 shadow-lg shadow-emerald-950/30 shrink-0">
              <div className="p-1.5 rounded-full bg-emerald-500/20">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Decision</div>
                <div className="text-sm font-black text-emerald-300">AUTO-RESOLVE</div>
                <div className="text-[11px] text-emerald-400/80">Action approved</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-950/90 border border-amber-500/50 shadow-lg shadow-amber-950/30 shrink-0">
              <div className="p-1.5 rounded-full bg-amber-500/20">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Decision</div>
                <div className="text-sm font-black text-amber-300">HUMAN REVIEW</div>
                <div className="text-[11px] text-amber-400/80">Escalated to agent</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Suggested Action */}
          <div className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Suggested Action
            </span>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
              {formatActionName(data.suggested_action) || 'None'}
            </div>
          </div>

          {/* Executed Action */}
          <div className={`border rounded-xl p-4 ${
            isAuto
              ? 'bg-emerald-950/30 border-emerald-800/40'
              : 'bg-amber-950/20 border-amber-800/30'
          }`}>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Executed Action
            </span>
            {data.executed_action ? (
              <div className="text-base font-bold text-emerald-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {formatActionName(data.executed_action)}
              </div>
            ) : (
              <div className="text-sm font-medium text-amber-300/90 flex items-start gap-1.5">
                <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Not executed — human review required
              </div>
            )}
          </div>
        </div>

        {/* Status Banner */}
        <div className={`rounded-xl p-3.5 text-xs font-medium flex items-center gap-2 border ${
          isAuto
            ? 'bg-emerald-950/50 border-emerald-800/50 text-emerald-200'
            : 'bg-amber-950/50 border-amber-800/50 text-amber-200'
        }`}>
          <span className={`shrink-0 px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider ${
            isAuto ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {isAuto ? 'Automated' : 'Flagged'}
          </span>
          <span>
            {isAuto
              ? 'Action executed successfully. All confidence gates and safety checks passed.'
              : 'The engine detected insufficient confidence or a policy conflict. Ticket requires human agent review.'}
          </span>
        </div>

      </div>
    </div>
  );
};

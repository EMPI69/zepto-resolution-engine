import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketResolutionResponse, TicketSummary } from '../types';
import { formatActionName } from '../utils/formatters';

interface TicketCardProps {
  ticket: TicketSummary;
  resolution?: TicketResolutionResponse;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, resolution }) => {
  const navigate = useNavigate();

  const isAutoResolve = resolution?.decision === 'AUTO_RESOLVE';
  const isHumanReview = resolution?.decision === 'HUMAN_REVIEW';

  return (
    <button
      onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
      className="w-full text-left bg-gray-900/70 border border-gray-800/80 hover:border-purple-700/60 hover:bg-gray-900 rounded-xl p-4 transition-all duration-150 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-800 text-purple-300 border border-purple-900/50 group-hover:border-purple-700/70 transition">
              {ticket.ticket_id}
            </span>
            <span className="text-[11px] text-gray-400 font-mono">
              {ticket.order_id}
            </span>
          </div>
          <p className="text-sm text-gray-200 font-medium truncate group-hover:text-white transition">
            "{ticket.description}"
          </p>
        </div>

        {/* Right: status badge */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {!resolution && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-700/60 text-gray-500">
              Not analyzed
            </span>
          )}
          {isAutoResolve && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AUTO-RESOLVE
            </span>
          )}
          {isHumanReview && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              HUMAN REVIEW
            </span>
          )}
          {resolution && (
            <span className="text-[10px] text-gray-500">
              {formatActionName(resolution.suggested_action)}
            </span>
          )}
          <svg className="w-4 h-4 text-gray-700 group-hover:text-purple-500 transition mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

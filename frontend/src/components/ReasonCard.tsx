import React from 'react';
import { TicketResolutionResponse } from '../types';
import { formatActionName } from '../utils/formatters';

interface ReasonCardProps {
  data: TicketResolutionResponse;
}

// Converts the terse engine reason into a more natural paragraph
function buildNaturalExplanation(data: TicketResolutionResponse): string {
  const isAuto = data.decision === 'AUTO_RESOLVE';
  const action = data.suggested_action ? formatActionName(data.suggested_action) : 'the recommended action';
  const confPct = Math.round(data.resolution_confidence * 100);
  const matchPct = Math.round(data.retrieval_confidence * 100);

  if (isAuto) {
    return `Similar cases consistently support ${action} (${confPct}% evidence weight), and all policy safety checks passed. The engine found a ${matchPct}% similarity match with historical precedents and was confident enough to resolve this automatically.`;
  }

  // HUMAN_REVIEW — derive from the reason field content
  const r = data.reason || '';
  if (r.includes('sufficiently similar') || r.includes('precedent was found')) {
    return `The engine could not find a historical case similar enough to this one (confidence: ${matchPct}%). Without strong precedent support, an automated decision would be unreliable.`;
  }
  if (r.includes('policy')) {
    return `The suggested action — ${action} — violates an order safety policy. The engine blocked automatic execution to prevent a harmful outcome.`;
  }
  if (r.includes('stable') || r.includes('stability')) {
    return `Although there is some historical support for ${action}, the evidence is not stable enough (${confPct}% confidence vs. the 70% threshold). The engine escalated rather than risk an incorrect resolution.`;
  }
  // Fallback: human-friendly restatement of raw reason
  return `The engine escalated this ticket because: ${r}`;
}

export const ReasonCard: React.FC<ReasonCardProps> = ({ data }) => {
  const naturalExplanation = buildNaturalExplanation(data);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-purple-950/20 border border-purple-900/40 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400 shrink-0 mt-0.5 shadow-md">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2 mb-2">
            <span>Why this decision?</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          </h3>
          <p className="text-sm sm:text-base text-gray-100 font-medium leading-relaxed border-l-2 border-purple-500/50 pl-3">
            {naturalExplanation}
          </p>
        </div>
      </div>
    </div>
  );
};

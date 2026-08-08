import React from 'react';
import { TicketResolutionResponse } from '../types';

interface DecisionGateProps {
  data: TicketResolutionResponse;
}

interface Gate {
  label: string;
  passed: boolean;
  description: string;
}

export const DecisionGate: React.FC<DecisionGateProps> = ({ data }) => {
  const isAuto = data.decision === 'AUTO_RESOLVE';
  const allPoliciesPassed = data.policy_checks.length === 0 || data.policy_checks.every((c) => c.passed);

  const gates: Gate[] = [
    {
      label: 'Evidence threshold',
      passed: data.retrieval_confidence >= 0.75,
      description: `Similarity ≥ 75% (got ${Math.round(data.retrieval_confidence * 100)}%)`,
    },
    {
      label: 'Policy safety',
      passed: allPoliciesPassed,
      description: allPoliciesPassed ? 'All safety rules passed' : 'A safety rule was violated',
    },
    {
      label: 'Resolution stability',
      passed: data.resolution_confidence >= 0.7,
      description: `Confidence ≥ 70% (got ${Math.round(data.resolution_confidence * 100)}%)`,
    },
  ];

  const allGatesPassed = gates.every((g) => g.passed);

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl shadow-xl ${
      allGatesPassed
        ? 'bg-emerald-950/20 border-emerald-800/40'
        : 'bg-amber-950/20 border-amber-800/40'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Decision Gates
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Thresholds that determine autonomous execution</p>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
          isAuto
            ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
            : 'bg-amber-950 text-amber-300 border-amber-800/60'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isAuto ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          {isAuto ? 'All gates passed' : 'Execution blocked'}
        </span>
      </div>

      <div className="space-y-2.5">
        {gates.map((gate, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between gap-3 rounded-xl p-3 border ${
              gate.passed
                ? 'bg-gray-950/60 border-gray-800/70'
                : 'bg-amber-950/30 border-amber-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {gate.passed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-950 border border-amber-700/60 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                  </svg>
                </div>
              )}
              <div>
                <span className="text-sm font-semibold text-white">{gate.label}</span>
                <p className="text-xs text-gray-400">{gate.description}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${
              gate.passed
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800/50'
                : 'bg-amber-950 text-amber-400 border-amber-800/50'
            }`}>
              {gate.passed ? 'Pass' : 'Fail'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

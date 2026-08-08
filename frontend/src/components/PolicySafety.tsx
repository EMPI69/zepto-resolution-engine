import React from 'react';
import { PolicyCheck } from '../types';
import { formatRuleName } from '../utils/formatters';

interface PolicySafetyProps {
  checks: PolicyCheck[];
}

export const PolicySafety: React.FC<PolicySafetyProps> = ({ checks }) => {
  if (!checks || checks.length === 0) return null;

  const allPassed = checks.every((c) => c.passed);

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl shadow-xl ${
      allPassed ? 'bg-gray-900/80 border-gray-800/80' : 'bg-rose-950/30 border-rose-800/60'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Safety Guardrails
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Automated policy checks that gate execution</p>
        </div>

        {allPassed ? (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            All Passed
          </span>
        ) : (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Conflict Detected
          </span>
        )}
      </div>

      <div className="space-y-3">
        {checks.map((check, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-4 border ${
              check.passed
                ? 'bg-gray-950/70 border-gray-800/80'
                : 'bg-rose-950/60 border-rose-600/60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  {formatRuleName(check.rule)}
                </h4>
                <p className="text-xs text-gray-300">
                  {check.reason}
                </p>
              </div>

              <div className="shrink-0">
                {check.passed ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-xs font-bold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    PASSED
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-900 text-rose-100 border border-rose-500/80 text-xs font-bold flex items-center gap-1 shadow-lg shadow-rose-950">
                    <svg className="w-3.5 h-3.5 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    FAILED
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

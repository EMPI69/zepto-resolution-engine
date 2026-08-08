import React, { useEffect, useState } from 'react';
import { TicketResolutionResponse } from '../types';
import { formatActionName } from '../utils/formatters';

interface ResolutionStoryProps {
  data: TicketResolutionResponse;
}

interface StoryStep {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  status: 'success' | 'warning' | 'neutral';
}

export const ResolutionStory: React.FC<ResolutionStoryProps> = ({ data }) => {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const isAuto = data.decision === 'AUTO_RESOLVE';

  const evidenceStrength =
    data.retrieval_confidence >= 0.9
      ? 'Strong precedent match'
      : data.retrieval_confidence >= 0.75
      ? 'Good precedent match'
      : 'Weak precedent match';

  const stabilityNote =
    data.resolution_confidence >= 0.7
      ? 'No policy conflict detected'
      : 'Resolution evidence is unstable';

  const steps: StoryStep[] = [
    {
      id: 'issue',
      label: 'Customer Issue',
      value: `"${data.description}"`,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      status: 'neutral',
    },
    {
      id: 'evidence',
      label: 'Historical Evidence',
      value: evidenceStrength,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      status: data.retrieval_confidence >= 0.75 ? 'success' : 'warning',
    },
    {
      id: 'action',
      label: 'Recommended Action',
      value: data.suggested_action ? formatActionName(data.suggested_action) : 'None',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      status: 'neutral',
    },
    {
      id: 'safety',
      label: 'Safety Checks',
      value: data.policy_checks.every((c) => c.passed)
        ? stabilityNote
        : 'Policy conflict detected',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      status: data.policy_checks.every((c) => c.passed) ? 'success' : 'warning',
    },
    {
      id: 'decision',
      label: 'Final Decision',
      value: isAuto ? 'AUTO-RESOLVE' : 'HUMAN REVIEW',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isAuto ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          )}
        </svg>
      ),
      status: isAuto ? 'success' : 'warning',
    },
  ];

  useEffect(() => {
    setVisibleSteps(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleSteps(count);
      if (count >= steps.length) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, [data.ticket_id]);

  const statusColors = {
    success: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60',
    warning: 'text-amber-400 bg-amber-950/80 border-amber-700/60',
    neutral: 'text-purple-400 bg-purple-950/80 border-purple-700/60',
  };

  const connectorColors = {
    success: 'bg-emerald-600/60',
    warning: 'bg-amber-600/60',
    neutral: 'bg-purple-700/40',
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
      <div className="mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Resolution Story
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">How the engine arrived at its decision</p>
      </div>

      {/* Desktop: horizontal pipeline */}
      <div className="hidden md:flex items-start gap-0">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div
              className={`flex flex-col items-center text-center flex-1 transition-all duration-300 ${
                idx < visibleSteps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: `${idx * 60}ms` }}
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-2 shadow-md ${statusColors[step.status]}`}>
                {step.icon}
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                {step.label}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-lg border ${statusColors[step.status]} max-w-[110px] leading-tight`}>
                {step.value}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex items-center mt-4 flex-shrink-0">
                <div className={`h-0.5 w-6 ${idx < visibleSteps - 1 ? connectorColors[step.status] : 'bg-gray-800'} transition-colors duration-300`} />
                <svg className={`w-3 h-3 ${idx < visibleSteps - 1 ? 'text-gray-500' : 'text-gray-800'} transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden space-y-0">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`transition-all duration-300 ${idx < visibleSteps ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-start gap-3 py-2">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-md shrink-0 ${statusColors[step.status]}`}>
                  {step.icon}
                </div>
                {idx < steps.length - 1 && <div className={`w-0.5 h-6 mt-1 ${connectorColors[step.status]}`} />}
              </div>
              <div className="pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">{step.label}</span>
                <span className={`text-xs font-medium ${step.status === 'success' ? 'text-emerald-300' : step.status === 'warning' ? 'text-amber-300' : 'text-purple-300'}`}>
                  {step.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

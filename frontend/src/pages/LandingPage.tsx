import React from 'react';
import { useNavigate } from 'react-router-dom';

const PIPELINE_STEPS = [
  { icon: '🎫', label: 'Customer Ticket' },
  { icon: '📚', label: 'Historical Evidence' },
  { icon: '⚡', label: 'Action Recommendation' },
  { icon: '🛡️', label: 'Safety Gate' },
  { icon: '✓', label: 'Resolution' },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Evidence-driven',
    description: 'Finds similar historical cases and uses their outcomes to recommend a resolution.',
    accent: 'text-purple-400',
    border: 'border-purple-800/30',
    bg: 'bg-purple-950/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Safety-first',
    description: 'Policy checks prevent unsafe actions from being automatically executed.',
    accent: 'text-indigo-400',
    border: 'border-indigo-800/30',
    bg: 'bg-indigo-950/20',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Human-aware',
    description: 'When evidence is uncertain, the engine escalates instead of guessing.',
    accent: 'text-violet-400',
    border: 'border-violet-800/30',
    bg: 'bg-violet-950/20',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Customer Support Automation
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-5">
          Resolve smarter.<br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            {' '}Escalate safely.
          </span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          An evidence-based customer support resolution engine that learns from historical cases,
          checks safety policies, and knows when automation should stop.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5"
        >
          Open Resolution Console
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </section>

      {/* Pipeline visual */}
      <section className="my-12">
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center mb-6">
            How it works
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
            {PIPELINE_STEPS.map((step, idx) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-2 w-28">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl
                    ${idx === 4 ? 'bg-emerald-950/80 border border-emerald-700/50 text-emerald-400' : 'bg-gray-800/80 border border-gray-700/60'}`}>
                    {step.icon}
                  </div>
                  <span className="text-xs text-gray-300 font-medium text-center leading-snug">{step.label}</span>
                </div>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <div className="flex sm:flex-row flex-col items-center text-gray-700">
                    <svg className="w-4 h-4 rotate-90 sm:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            The engine fires <span className="text-gray-400 font-medium">AUTO-RESOLVE</span> or <span className="text-amber-400 font-medium">HUMAN REVIEW</span> — never guesses in between.
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={`${f.bg} border ${f.border} rounded-2xl p-5 sm:p-6`}
          >
            <div className={`${f.accent} mb-3`}>{f.icon}</div>
            <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <div className="text-center mt-14">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-purple-400 hover:text-purple-300 font-medium transition inline-flex items-center gap-1.5"
        >
          View incoming tickets
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </main>
  );
};

import React, { useEffect, useState } from 'react';

const STAGES = [
  'Retrieving historical evidence',
  'Checking precedent consistency',
  'Evaluating safety policies',
  'Determining resolution',
];

export const LoadingState: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 space-y-6">
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 text-center backdrop-blur-xl shadow-xl flex flex-col items-center justify-center">
        {/* Spinner */}
        <div className="relative w-12 h-12 mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        </div>

        <h3 className="text-base font-bold text-white tracking-wide mb-4">
          Analyzing ticket...
        </h3>

        {/* Stage steps */}
        <div className="w-full max-w-xs space-y-2 text-left">
          {STAGES.map((stage, idx) => {
            const isDone = idx < activeStage;
            const isActive = idx === activeStage;
            return (
              <div
                key={stage}
                className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                  isDone ? 'text-emerald-400' : isActive ? 'text-purple-300' : 'text-gray-600'
                }`}
              >
                {isDone ? (
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <span className="w-3.5 h-3.5 shrink-0 rounded-full border-2 border-purple-400 border-t-transparent animate-spin inline-block" />
                ) : (
                  <span className="w-3.5 h-3.5 shrink-0 rounded-full border border-gray-700 inline-block" />
                )}
                <span className={isActive ? 'font-semibold' : ''}>{stage}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4">
            <div className="h-4 w-1/2 bg-gray-800 rounded mb-3" />
            <div className="h-8 w-3/4 bg-gray-800/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

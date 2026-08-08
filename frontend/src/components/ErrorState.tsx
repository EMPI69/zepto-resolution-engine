import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-gray-900 to-gray-950 border border-rose-500/50 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl my-8 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-rose-900/80 border border-rose-600/80 text-rose-300 shrink-0 shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">
              Unable to resolve ticket
            </h3>
            <p className="text-xs sm:text-sm text-rose-200 mt-1">
              {message || 'An error occurred while communicating with the resolution engine.'}
            </p>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-900/80 hover:bg-rose-800/80 text-rose-100 font-semibold text-xs rounded-xl border border-rose-600/60 transition shrink-0 cursor-pointer shadow-md"
        >
          Try Again
        </button>

      </div>
    </div>
  );
};

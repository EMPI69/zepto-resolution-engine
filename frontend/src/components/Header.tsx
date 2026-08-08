import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface HeaderProps {
  isOnline: boolean | null;
  onRefreshHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isOnline, onRefreshHealth }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <header className="border-b border-gray-800/80 bg-gray-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">

        {/* Left: Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-800 flex items-center justify-center shadow-lg shadow-purple-900/30 ring-1 ring-white/20 group-hover:ring-purple-500/50 transition">
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent leading-tight">
                Zepto Resolution Engine
              </span>
              <span className="hidden sm:inline text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/50">
                AI Ops
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
              Evidence-based customer support automation
            </p>
          </div>
        </Link>

        {/* Right: Nav + Status */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs">

          {!isLanding && (
            <nav className="flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  location.pathname === '/dashboard'
                    ? 'bg-gray-900 text-purple-300 border border-purple-900/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/80'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden sm:inline">Console</span>
              </Link>

              <a
                href={`${API_BASE_URL}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg hover:bg-gray-800/80 text-gray-400 hover:text-white transition flex items-center gap-1"
              >
                Docs
                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </nav>
          )}

          <div className="h-4 w-px bg-gray-800 hidden sm:block" />

          {/* Engine Status */}
          <button
            onClick={onRefreshHealth}
            title="Click to re-check engine status"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition cursor-pointer"
          >
            <div className="relative flex h-2.5 w-2.5">
              {isOnline === true && (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </>
              )}
              {isOnline === false && (
                <>
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </>
              )}
              {isOnline === null && (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 animate-pulse" />
              )}
            </div>
            <span className="font-semibold text-xs hidden sm:inline">
              {isOnline === true && <span className="text-emerald-400">Engine Online</span>}
              {isOnline === false && <span className="text-rose-400">Engine Offline</span>}
              {isOnline === null && <span className="text-amber-400">Checking...</span>}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

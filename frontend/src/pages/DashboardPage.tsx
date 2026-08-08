import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketCard } from '../components/TicketCard';
import { getTickets } from '../services/api';
import { TicketSummary, TicketResolutionResponse } from '../types';

type FilterTab = 'all' | 'needs_analysis' | 'auto_resolved' | 'human_review';

interface DashboardPageProps {
  analysisCache: Map<string, TicketResolutionResponse>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ analysisCache }) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getTickets()
      .then((data) => {
        if (!cancelled) setTickets(data.tickets);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load tickets.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const analyzedCount = useMemo(() => analysisCache.size, [analysisCache]);
  const autoCount = useMemo(
    () => Array.from(analysisCache.values()).filter((r) => r.decision === 'AUTO_RESOLVE').length,
    [analysisCache]
  );
  const humanCount = useMemo(
    () => Array.from(analysisCache.values()).filter((r) => r.decision === 'HUMAN_REVIEW').length,
    [analysisCache]
  );

  const filtered = useMemo(() => {
    let result = tickets;
    // Search
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) =>
          t.ticket_id.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.order_id.toLowerCase().includes(q)
      );
    }
    // Filter tab
    if (filter === 'needs_analysis') {
      result = result.filter((t) => !analysisCache.has(t.ticket_id));
    } else if (filter === 'auto_resolved') {
      result = result.filter(
        (t) => analysisCache.get(t.ticket_id)?.decision === 'AUTO_RESOLVE'
      );
    } else if (filter === 'human_review') {
      result = result.filter(
        (t) => analysisCache.get(t.ticket_id)?.decision === 'HUMAN_REVIEW'
      );
    }
    return result;
  }, [tickets, search, filter, analysisCache]);

  const TABS: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'All Tickets', count: tickets.length },
    { key: 'needs_analysis', label: 'Needs Analysis', count: tickets.length - analyzedCount },
    { key: 'auto_resolved', label: 'Auto Resolved', count: autoCount },
    { key: 'human_review', label: 'Human Review', count: humanCount },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

      {/* Page heading */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Resolution Console</h2>
        <p className="text-sm text-gray-400 mt-1">
          Review incoming customer tickets and analyze how the resolution engine would handle them.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900/70 border border-gray-800/80 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Total Tickets</div>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">{loading ? '—' : tickets.length}</div>
        </div>
        <div className="bg-gray-900/70 border border-gray-800/80 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Analyzed</div>
          <div className="text-2xl font-extrabold font-mono text-indigo-400 mt-1">{analyzedCount}</div>
        </div>
        <div className="bg-gray-900/70 border border-gray-800/80 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Auto Resolved</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">{autoCount}</div>
        </div>
        <div className="bg-gray-900/70 border border-gray-800/80 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Human Review</div>
          <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">{humanCount}</div>
        </div>
      </div>

      {/* Note about stats */}
      {analyzedCount === 0 && !loading && (
        <p className="text-[11px] text-gray-600 mb-4">
          Resolution status is calculated when a ticket is analyzed. Open a ticket and click "Analyze &amp; Resolve".
        </p>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-700 focus:ring-1 focus:ring-purple-700/50 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              filter === tab.key
                ? 'bg-gray-800 text-white border-purple-700/60'
                : 'bg-transparent text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filter === tab.key ? 'bg-purple-900 text-purple-200' : 'bg-gray-800 text-gray-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      {loading && (
        <div className="space-y-2" role="status" aria-label="Loading tickets">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-900/60 border border-gray-800/80 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-rose-950/50 border border-rose-700/60 rounded-xl p-5 text-center">
          <p className="text-sm text-rose-300 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs text-rose-400 hover:text-rose-200 underline transition"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-gray-900/60 border border-gray-800/80 rounded-xl p-10 text-center">
          <p className="text-sm text-gray-400">
            {search ? `No tickets matching "${search}"` : 'No tickets in this category.'}
          </p>
          {search && (
            <button onClick={() => setSearch('')} className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition underline">
              Clear search
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((ticket) => (
            <TicketCard
              key={ticket.ticket_id}
              ticket={ticket}
              resolution={analysisCache.get(ticket.ticket_id)}
            />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <p className="text-[11px] text-gray-600 text-center mt-4">
          Showing {filtered.length} of {tickets.length} tickets
        </p>
      )}
    </main>
  );
};

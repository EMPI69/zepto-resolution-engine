import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DecisionCard } from '../components/DecisionCard';
import { ConfidenceMetrics } from '../components/ConfidenceMetrics';
import { ReasonCard } from '../components/ReasonCard';
import { EvidenceTable } from '../components/EvidenceTable';
import { WhyNotOtherAction } from '../components/WhyNotOtherAction';
import { OrderContext } from '../components/OrderContext';
import { PolicySafety } from '../components/PolicySafety';
import { ResolutionStory } from '../components/ResolutionStory';
import { DecisionGate } from '../components/DecisionGate';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { resolveTicket, getTickets } from '../services/api';
import { TicketResolutionResponse, TicketSummary } from '../types';

interface TicketDetailPageProps {
  analysisCache: Map<string, TicketResolutionResponse>;
  onAnalysisDone: (ticketId: string, data: TicketResolutionResponse) => void;
}

export const TicketDetailPage: React.FC<TicketDetailPageProps> = ({
  analysisCache,
  onAnalysisDone,
}) => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  const [ticketMeta, setTicketMeta] = useState<TicketSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolved data: prefer cache so re-navigating keeps results
  const resolutionData = ticketId ? analysisCache.get(ticketId) ?? null : null;

  // Load ticket metadata (description, order_id) from ticket list
  useEffect(() => {
    if (!ticketId) return;
    // If already in cache we have description from resolution data
    if (analysisCache.has(ticketId)) return;
    getTickets().then((data) => {
      const found = data.tickets.find((t) => t.ticket_id === ticketId);
      if (found) setTicketMeta(found);
    }).catch(() => {
      // Non-fatal — still show ticket ID, user can still analyze
    });
  }, [ticketId]);

  const displayedDescription =
    resolutionData?.description ??
    ticketMeta?.description ?? null;
  const displayedOrderId =
    resolutionData?.order?.order_id ??
    ticketMeta?.order_id ?? null;

  const handleAnalyze = async () => {
    if (!ticketId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await resolveTicket(ticketId);
      onAnalysisDone(ticketId, data);
      setTimeout(() => {
        document.getElementById('resolution-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError(err?.message || 'Failed to resolve ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">

      {/* Back navigation */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition mb-6 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Resolution Console
      </button>

      {/* Ticket header */}
      <div className="bg-gray-900/70 border border-gray-800/80 rounded-2xl p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Customer Ticket
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-800 text-purple-300 border border-purple-900/60">
                {ticketId}
              </span>
            </div>
            {displayedDescription ? (
              <blockquote className="text-base sm:text-lg font-semibold text-white">
                "{displayedDescription}"
              </blockquote>
            ) : (
              <p className="text-gray-600 text-sm">Loading ticket details…</p>
            )}
            {displayedOrderId && (
              <p className="text-xs text-gray-400 font-mono">
                Order: <span className="text-gray-300">{displayedOrderId}</span>
              </p>
            )}
          </div>

          {/* Analyze button (shown when not yet loading and no result, OR allow re-analyze) */}
          {!isLoading && (
            <div className="shrink-0">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition shadow-lg cursor-pointer ${
                  resolutionData
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {resolutionData ? 'Re-analyze' : 'Analyze & Resolve'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && <LoadingState />}

      {/* Error */}
      {!isLoading && error && (
        <ErrorState message={error} onRetry={handleAnalyze} />
      )}

      {/* Pre-analysis state */}
      {!isLoading && !error && !resolutionData && (
        <div className="bg-gray-900/50 border border-gray-800/80 border-dashed rounded-2xl p-10 sm:p-14 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-gray-500 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-white mb-2">Ready to analyze</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            Run the resolution engine to retrieve historical evidence, evaluate safety policies,
            and determine whether this ticket can be safely automated.
          </p>
          <button
            onClick={handleAnalyze}
            className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-purple-900/30 cursor-pointer"
          >
            Analyze &amp; Resolve
          </button>
        </div>
      )}

      {/* Resolution Workspace */}
      {!isLoading && !error && resolutionData && (
        <div id="resolution-results" className="space-y-6 animate-fadeInUp">

          {/* 1. Decision */}
          <DecisionCard data={resolutionData} />

          {/* 2. Resolution Story */}
          <ResolutionStory data={resolutionData} />

          {/* 3. Why this decision + Why not other action */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReasonCard data={resolutionData} />
            <WhyNotOtherAction data={resolutionData} />
          </div>

          {/* 4. Decision Signals */}
          <ConfidenceMetrics
            retrievalConfidence={resolutionData.retrieval_confidence}
            resolutionConfidence={resolutionData.resolution_confidence}
            top3Agreement={resolutionData.top3_agreement}
          />

          {/* 5. Historical Evidence */}
          <EvidenceTable precedents={resolutionData.precedents} />

          {/* 6. Order Context + Policy Safety */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderContext order={resolutionData.order} />
            <PolicySafety checks={resolutionData.policy_checks} />
          </div>

          {/* 7. Decision Gates */}
          <DecisionGate data={resolutionData} />

        </div>
      )}
    </main>
  );
};

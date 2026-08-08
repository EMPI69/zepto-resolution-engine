import React, { useState } from 'react';

// NOTE: TicketResolver is no longer rendered by the main app.
// Ticket analysis is now handled by TicketDetailPage.
// Kept as dead code so existing import sites compile.

interface TicketResolverProps {
  onResolve: (ticketId: string) => void;
  isLoading: boolean;
  currentTicketId: string;
  lastDescription?: string;
}

export const TicketResolver: React.FC<TicketResolverProps> = ({
  onResolve,
  isLoading,
  currentTicketId,
}) => {
  const [ticketInput, setTicketInput] = useState(currentTicketId || 'N-015');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketInput.trim() && !isLoading) onResolve(ticketInput.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={ticketInput}
        onChange={(e) => setTicketInput(e.target.value)}
        placeholder="Enter Ticket ID"
        disabled={isLoading}
        className="flex-grow px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
      />
      <button
        type="submit"
        disabled={isLoading || !ticketInput.trim()}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
      >
        {isLoading ? 'Analyzing…' : 'Analyze & Resolve'}
      </button>
    </form>
  );
};

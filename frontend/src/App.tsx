import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { checkHealth } from './services/api';
import { TicketResolutionResponse } from './types';

export const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  // Global analysis cache: ticketId → resolution result
  const [analysisCache, setAnalysisCache] = useState<Map<string, TicketResolutionResponse>>(
    new Map()
  );

  const handleCheckHealth = async () => {
    setIsOnline(null);
    const online = await checkHealth();
    setIsOnline(online);
  };

  useEffect(() => {
    handleCheckHealth();
  }, []);

  const handleAnalysisDone = (ticketId: string, data: TicketResolutionResponse) => {
    setAnalysisCache((prev) => new Map(prev).set(ticketId, data));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
      <Header isOnline={isOnline} onRefreshHealth={handleCheckHealth} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={<DashboardPage analysisCache={analysisCache} />}
        />
        <Route
          path="/tickets/:ticketId"
          element={
            <TicketDetailPage
              analysisCache={analysisCache}
              onAnalysisDone={handleAnalysisDone}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-6 border-t border-gray-900 text-center text-xs text-gray-500 pb-8">
        <p>Zepto Resolution Engine — AI-Powered Customer Support Automation</p>
      </footer>
    </div>
  );
};

export default App;

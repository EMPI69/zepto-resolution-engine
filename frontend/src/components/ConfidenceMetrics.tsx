import React, { useEffect, useRef, useState } from 'react';
import { formatPercentage } from '../utils/formatters';

interface ConfidenceMetricsProps {
  retrievalConfidence: number;
  resolutionConfidence: number;
  top3Agreement: number;
}

export const ConfidenceMetrics: React.FC<ConfidenceMetricsProps> = ({
  retrievalConfidence,
  resolutionConfidence,
  top3Agreement,
}) => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, [retrievalConfidence, resolutionConfidence, top3Agreement]);

  const metrics = [
    {
      title: 'Evidence Match',
      subtitle: 'Similarity to historical precedents',
      value: retrievalConfidence,
      formatted: formatPercentage(retrievalConfidence),
      color: 'from-purple-500 to-indigo-500',
      bgGlow: 'bg-purple-500/10',
      borderColor: 'border-purple-800/50',
      textColor: 'text-purple-300',
      ringColor: '#8B5CF6',
    },
    {
      title: 'Decision Confidence',
      subtitle: 'Weighted evidence agreement',
      value: resolutionConfidence,
      formatted: formatPercentage(resolutionConfidence),
      color: 'from-indigo-500 to-violet-500',
      bgGlow: 'bg-indigo-500/10',
      borderColor: 'border-indigo-800/50',
      textColor: 'text-indigo-300',
      ringColor: '#6366F1',
    },
    {
      title: 'Precedent Agreement',
      subtitle: 'Consensus among top precedents',
      value: top3Agreement,
      formatted: formatPercentage(top3Agreement),
      color: 'from-violet-500 to-purple-600',
      bgGlow: 'bg-violet-500/10',
      borderColor: 'border-violet-800/50',
      textColor: 'text-violet-300',
      ringColor: '#7C3AED',
    },
  ];

  return (
    <div ref={ref}>
      <div className="mb-3">
        <h3 className="text-base font-bold text-white">Decision Signals</h3>
        <p className="text-xs text-gray-400 mt-0.5">Evidence-based signals that informed the engine's confidence gates — not accuracy claims</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => {
          const pctValue = metric.value <= 1 ? metric.value * 100 : metric.value;
          const radius = 28;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = animated
            ? circumference - (pctValue / 100) * circumference
            : circumference;

          return (
            <div
              key={idx}
              className={`bg-gray-900/80 border ${metric.borderColor} rounded-2xl p-5 backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col justify-between`}
            >
              <div className={`absolute -top-12 -right-12 w-32 h-32 ${metric.bgGlow} rounded-full blur-2xl pointer-events-none`} />

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                  {metric.title}
                </span>
                <p className="text-xs text-gray-500 mt-0.5">{metric.subtitle}</p>
              </div>

              <div className="flex items-end justify-between mt-4">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${metric.textColor}`}>
                  {metric.formatted}
                </span>

                {/* Circular SVG Ring */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="6" className="text-gray-800/80" fill="transparent" />
                    <circle
                      cx="32" cy="32" r={radius}
                      stroke={metric.ringColor}
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-mono font-bold text-gray-300">
                    {Math.round(pctValue)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-950 rounded-full h-1.5 mt-3 overflow-hidden border border-gray-800/50">
                <div
                  className={`bg-gradient-to-r ${metric.color} h-1.5 rounded-full transition-all duration-1000`}
                  style={{ width: animated ? `${Math.min(100, Math.max(0, pctValue))}%` : '0%' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

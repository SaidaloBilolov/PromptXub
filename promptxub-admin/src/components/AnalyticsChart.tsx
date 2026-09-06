'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DailyAnalyticsPoint } from '@/types';
import { fetchTimeSeriesAnalytics } from '@/lib/api';
import { Calendar, TrendingUp, Eye, Flame, Users, RefreshCw } from 'lucide-react';

export function AnalyticsChart() {
  const [data, setData] = useState<DailyAnalyticsPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<'7d' | '30d' | 'month'>('30d');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [hoveredPoint, setHoveredPoint] = useState<DailyAnalyticsPoint | null>(null);

  // Helper to format date strings
  const formatDateStr = (date: Date) => date.toISOString().split('T')[0];

  // Set date ranges based on presets
  const handleSelectPreset = (preset: '7d' | '30d' | 'month') => {
    setActivePreset(preset);
    const end = new Date();
    let start = new Date();

    if (preset === '7d') {
      start.setDate(end.getDate() - 6);
    } else if (preset === '30d') {
      start.setDate(end.getDate() - 29);
    } else if (preset === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    }

    setStartDate(formatDateStr(start));
    setEndDate(formatDateStr(end));
  };

  useEffect(() => {
    handleSelectPreset('30d');
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    let isMounted = true;
    setLoading(true);

    fetchTimeSeriesAnalytics(startDate, endDate).then((points) => {
      if (isMounted) {
        setData(points);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  // Compute SVG Points & Scaling Math
  const { viewPointsStr, copyPointsStr, maxVal, coordinates } = useMemo(() => {
    if (!data || data.length === 0) {
      return { viewPointsStr: '', copyPointsStr: '', maxVal: 1, coordinates: [] };
    }

    const maxView = Math.max(...data.map((d) => d.viewsCount), 10);
    const maxCopy = Math.max(...data.map((d) => d.copiesCount), 10);
    const max = Math.ceil(Math.max(maxView, maxCopy) * 1.15);

    const width = 800;
    const height = 240;
    const padding = 20;

    const coords = data.map((d, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * (width - 2 * padding);
      const yView = height - padding - (d.viewsCount / max) * (height - 2 * padding);
      const yCopy = height - padding - (d.copiesCount / max) * (height - 2 * padding);

      return { x, yView, yCopy, item: d };
    });

    const vStr = coords.map((c) => `${c.x},${c.yView}`).join(' ');
    const cStr = coords.map((c) => `${c.x},${c.yCopy}`).join(' ');

    return { viewPointsStr: vStr, copyPointsStr: cStr, maxVal: max, coordinates: coords };
  }, [data]);

  // Aggregated totals for the selected period
  const totalViewsPeriod = data.reduce((acc, d) => acc + d.viewsCount, 0);
  const totalCopiesPeriod = data.reduce((acc, d) => acc + d.copiesCount, 0);
  const avgConvPeriod = totalViewsPeriod > 0 ? ((totalCopiesPeriod / totalViewsPeriod) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header Controls & Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Daily Views & Copies Performance Chart</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time daily time-series metrics over selected calendar dates
          </p>
        </div>

        {/* Date Filters & Custom Picker */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Preset Buttons */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => handleSelectPreset('7d')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activePreset === '7d' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => handleSelectPreset('30d')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activePreset === '30d' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => handleSelectPreset('month')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activePreset === 'month' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              This Month
            </button>
          </div>

          {/* Date Picker Inputs */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setActivePreset('30d');
              }}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            />
            <span className="text-slate-600">&rarr;</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setActivePreset('30d');
              }}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Summary Stat Badges for Selected Range */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Period Real Views</span>
            <span className="text-lg font-bold text-cyan-400">{totalViewsPeriod.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Period Real Copies</span>
            <span className="text-lg font-bold text-purple-400">{totalCopiesPeriod.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Avg Conversion Rate</span>
            <span className="text-lg font-bold text-emerald-400">{avgConvPeriod}%</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Responsive Interactive SVG Line Chart */}
      <div className="relative w-full h-[260px] bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 overflow-hidden">
        
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-400 mb-2" />
          </div>
        ) : (
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
            <defs>
              {/* Cyan Views Gradient */}
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
              {/* Purple Copies Gradient */}
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Horizontal Reference Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 220 - ratio * 200;
              return (
                <line
                  key={ratio}
                  x1="20"
                  y1={y}
                  x2="780"
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
              );
            })}

            {/* Cyan Views Gradient Area */}
            {viewPointsStr && (
              <polygon
                points={`20,220 ${viewPointsStr} 780,220`}
                fill="url(#cyanGradient)"
              />
            )}

            {/* Purple Copies Gradient Area */}
            {copyPointsStr && (
              <polygon
                points={`20,220 ${copyPointsStr} 780,220`}
                fill="url(#purpleGradient)"
              />
            )}

            {/* Cyan Views Line */}
            {viewPointsStr && (
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={viewPointsStr}
              />
            )}

            {/* Purple Copies Line */}
            {copyPointsStr && (
              <polyline
                fill="none"
                stroke="#a855f7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={copyPointsStr}
              />
            )}

            {/* Interactive Data Dots & Hover Detection */}
            {coordinates.map((c) => (
              <g key={c.item.date} className="cursor-pointer group/dot" onMouseEnter={() => setHoveredPoint(c.item)}>
                {/* Vertical Cursor Line on Hover */}
                <line
                  x1={c.x}
                  y1="20"
                  x2={c.x}
                  y2="220"
                  stroke="#475569"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="opacity-0 group-hover/dot:opacity-100 transition-opacity"
                />
                {/* Views Dot */}
                <circle
                  cx={c.x}
                  cy={c.yView}
                  r="4"
                  fill="#06b6d4"
                  className="transition-transform group-hover/dot:r-6"
                />
                {/* Copies Dot */}
                <circle
                  cx={c.x}
                  cy={c.yCopy}
                  r="4"
                  fill="#a855f7"
                  className="transition-transform group-hover/dot:r-6"
                />
              </g>
            ))}
          </svg>
        )}

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-700 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs space-y-1 z-30 animate-fadeIn pointer-events-none">
            <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
              <span>📅 {hoveredPoint.date}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {hoveredPoint.viewsCount > 0
                  ? ((hoveredPoint.copiesCount / hoveredPoint.viewsCount) * 100).toFixed(1)
                  : '0.0'}% CR
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-cyan-400 font-semibold">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Views:</span>
              <span className="font-mono">{hoveredPoint.viewsCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-purple-400 font-semibold">
              <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> Copies:</span>
              <span className="font-mono">{hoveredPoint.copiesCount.toLocaleString()}</span>
            </div>
            {hoveredPoint.visitorsCount !== undefined && (
              <div className="flex items-center justify-between gap-4 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1"><Users className="w-3 h-3 text-slate-400" /> Visitors:</span>
                <span className="font-mono">{hoveredPoint.visitorsCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
          <span>Real Daily Views</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
          <span>Real Daily Copies</span>
        </div>
      </div>

    </div>
  );
}

"use client";

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartConfig } from '@/lib/api';

interface ChartRendererProps {
  config: ChartConfig;
}

const EMERALD_COLORS = [
  '#10b981', // emerald-500
  '#34d399', // emerald-400
  '#6ee7b7', // emerald-300
  '#059669', // emerald-600
  '#047857', // emerald-700
  '#065f46', // emerald-800
];

const ChartRenderer: React.FC<ChartRendererProps> = ({ config }) => {
  const colors = config.colors || EMERALD_COLORS;

  // Custom tooltip with emerald theme
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number | string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-emerald-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-emerald-300 font-semibold mb-1">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-white text-sm">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              <span className="font-bold">
                {typeof entry.value === 'number' 
                  ? entry.value.toLocaleString() 
                  : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (config.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={config.xKey || 'name'} 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#d1d5db' }}
              />
              {Array.isArray(config.yKey) ? (
                config.yKey.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ fill: colors[index % colors.length], r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={config.yKey || 'value'}
                  stroke={colors[0]}
                  strokeWidth={2}
                  dot={{ fill: colors[0], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={config.xKey || 'name'} 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#d1d5db' }}
              />
              {Array.isArray(config.yKey) ? (
                config.yKey.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index % colors.length]}
                  />
                ))
              ) : (
                <Bar
                  dataKey={config.yKey || 'value'}
                  fill={colors[0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={config.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: { name?: string; percent?: number }) => `${props.name || ''} ${props.percent ? (props.percent * 100).toFixed(0) : '0'}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey={(Array.isArray(config.yKey) ? config.yKey[0] : config.yKey) || 'value'}
              >
                {config.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#d1d5db' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={config.data}>
              <defs>
                {Array.isArray(config.yKey) ? (
                  config.yKey.map((key, index) => (
                    <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                    </linearGradient>
                  ))
                ) : (
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={config.xKey || 'name'} 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#d1d5db' }}
              />
              {Array.isArray(config.yKey) ? (
                config.yKey.map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    fillOpacity={1}
                    fill={`url(#color${key})`}
                  />
                ))
              ) : (
                <Area
                  type="monotone"
                  dataKey={config.yKey || 'value'}
                  stroke={colors[0]}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-red-400">Unsupported chart type: {config.type}</div>;
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 border border-emerald-500/20 rounded-xl p-6 my-4">
      {config.title && (
        <h3 className="text-xl font-bold text-emerald-400 mb-2">
          {config.title}
        </h3>
      )}
      {config.description && (
        <p className="text-gray-400 text-sm mb-4">
          {config.description}
        </p>
      )}
      <div className="w-full">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartRenderer;


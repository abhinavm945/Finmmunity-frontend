'use client';

import { useState } from 'react';

interface StockChartProps {
  stockId: string;
  exchange: 'NSE' | 'BSE';
}

export default function StockChart({ stockId, exchange }: StockChartProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '3M' | '1Y'>('1D');

  const timeframes = ['1D', '5D', '1M', '3M', '1Y'];

  // Mock chart data (replace with real data fetching in production)
  const chartData = {
    '1D': { labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'], data: [100, 102, 101, 103, 104, 103.5, 105] },
    '5D': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], data: [100, 101, 102, 103, 104] },
    '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [100, 102, 103, 104] },
    '3M': { labels: ['Jan', 'Feb', 'Mar'], data: [100, 102, 104] },
    '1Y': { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [100, 101, 103, 104] },
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex space-x-2 mb-4">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf as any)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeframe === tf ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
      <div className="w-full h-64 bg-white rounded-lg flex items-center justify-center border border-gray-200">
        <p className="text-gray-500">
          Chart for {stockId} ({exchange}) - {timeframe} (Placeholder)
        </p>
      </div>
    </div>
  );
}
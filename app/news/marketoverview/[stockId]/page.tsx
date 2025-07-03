'use client';

import { useState, useEffect } from 'react';
import StockChart from '../../../../components/news/StockChart';

interface StockData {
  id: string;
  name: string;
  exchange: 'NSE' | 'BSE';
}

export default function StockDetail({ params }: { params: { stockId: string } }) {
  const [stock, setStock] = useState<StockData | null>(null);
  const [activeExchange, setActiveExchange] = useState<'NSE' | 'BSE'>('NSE');

  const demoStocks: StockData[] = [
    { id: 'nifty50', name: 'NIFTY 50', exchange: 'NSE' },
    { id: 'sensex', name: 'SENSEX', exchange: 'BSE' },
    { id: 'banknifty', name: 'BANK NIFTY', exchange: 'NSE' },
    { id: 'niftymidcap', name: 'NIFTY MIDCAP', exchange: 'NSE' },
    { id: 'niftysmallcap', name: 'NIFTY SMALLCAP', exchange: 'NSE' },
  ];

  useEffect(() => {
    const stockData = demoStocks.find((item) => item.id === params.stockId);
    setStock(stockData || null);
  }, [params.stockId]);

  if (!stock) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <h3 className="text-lg font-medium text-gray-700">Stock not found</h3>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{stock.name}</h1>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveExchange('NSE')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeExchange === 'NSE' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            NSE
          </button>
          <button
            onClick={() => setActiveExchange('BSE')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeExchange === 'BSE' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            BSE
          </button>
        </div>
        <StockChart stockId={stock.id} exchange={activeExchange} />
      </div>
    </div>
  );
}
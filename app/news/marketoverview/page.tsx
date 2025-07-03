'use client';

import { useState, useEffect } from 'react';
import { IoSearch, IoFilter } from 'react-icons/io5';
import StockCard from '../../../components/news/StockCard';

interface Stock {
  id: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  category: string;
  value: string;
  change: string;
  isUp: boolean;
  isTrending: boolean;
}

export default function AllStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExchange, setActiveExchange] = useState<'All' | 'NSE' | 'BSE'>('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const demoStocks: Stock[] = [
    { id: 'nifty50', name: 'NIFTY 50', exchange: 'NSE', category: 'Index', value: '22,510.23', change: '+1.2%', isUp: true, isTrending: true },
    { id: 'sensex', name: 'SENSEX', exchange: 'BSE', category: 'Index', value: '74,210.45', change: '+0.8%', isUp: true, isTrending: false },
    { id: 'banknifty', name: 'BANK NIFTY', exchange: 'NSE', category: 'Bank', value: '48,500.67', change: '-0.5%', isUp: false, isTrending: true },
    { id: 'reliance', name: 'Reliance Industries', exchange: 'NSE', category: 'Conglomerate', value: '2,950.30', change: '+0.9%', isUp: true, isTrending: false },
    { id: 'tcs', name: 'TCS', exchange: 'NSE', category: 'IT', value: '3,850.75', change: '+1.1%', isUp: true, isTrending: true },
    { id: 'hdfc', name: 'HDFC Bank', exchange: 'BSE', category: 'Bank', value: '1,450.20', change: '-0.3%', isUp: false, isTrending: false },
    { id: 'hal', name: 'Hindustan Aeronautics', exchange: 'NSE', category: 'Defence', value: '4,200.50', change: '+2.0%', isUp: true, isTrending: true },
    { id: 'infosys', name: 'Infosys', exchange: 'BSE', category: 'IT', value: '1,650.10', change: '-0.7%', isUp: false, isTrending: false },
  ];

  const categories = ['All', 'Index', 'Bank', 'IT', 'Defence', 'Conglomerate'];

  useEffect(() => {
    setStocks(demoStocks);
  }, []);

  const filteredStocks = stocks.filter(
    (stock) =>
      (activeExchange === 'All' || stock.exchange === activeExchange) &&
      (activeCategory === 'All' || stock.category === activeCategory) &&
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex space-x-2">
            {['All', 'NSE', 'BSE'].map((exchange) => (
              <button
                key={exchange}
                onClick={() => setActiveExchange(exchange as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeExchange === exchange ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {exchange}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="appearance-none pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 text-sm bg-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <IoFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => <StockCard key={stock.id} stock={stock} />)
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">No stocks found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
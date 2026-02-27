'use client';

import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/supabase';
import { CoffeeEntry, CoffeeData } from '@/types/coffee';

interface WeeklyData {
  counts: number[];
  max: number;
  heights: number[];
  details: Array<{ date: string; day: number; dayName: string } | { date: string; error: string }>;
}

export default function DebugPage() {
  const [username, setUsername] = useState('sofi ᰔ');
  const [data, setData] = useState<CoffeeData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getUserData(username);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateWeekly = (entries: CoffeeEntry[]): WeeklyData => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const details: Array<{ date: string; day: number; dayName: string } | { date: string; error: string }> = [];
    
    entries?.forEach((entry: CoffeeEntry) => {
      try {
        let dateStr = entry.date;
        if (!dateStr && entry.timestamp) {
          const timestamp = new Date(entry.timestamp);
          const year = timestamp.getFullYear();
          const month = String(timestamp.getMonth() + 1).padStart(2, '0');
          const day = String(timestamp.getDate()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        }
        
        if (dateStr) {
          const [year, month, dayOfMonth] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, dayOfMonth);
          const day = date.getDay();
          counts[day]++;
          details.push({ 
            date: dateStr, 
            day, 
            dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day] 
          });
        }
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : 'Unknown error';
        details.push({ date: entry.date, error: errorMsg });
      }
    });
    
    const max = Math.max(...counts, 1);
    const heights = counts.map(c => (c / max) * 100);
    
    return { counts, max, heights, details };
  };

  const weekly = data?.entries ? calculateWeekly(data.entries) : null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Debug Weekly Pattern</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
            placeholder="Username"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>

        {data && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded">
              <h2 className="font-bold mb-2">User: {username}</h2>
              <p>Total entries: {data.entries?.length || 0}</p>
            </div>

            {weekly && (
              <>
                <div className="bg-blue-50 p-4 rounded">
                  <h3 className="font-bold mb-2">Weekly Pattern Calculation</h3>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                      <div key={day} className="bg-white p-2 rounded">
                        <div className="font-bold text-lg">{weekly.counts[i]}</div>
                        <div className="text-sm text-gray-500">{day}</div>
                        <div className="text-xs text-blue-600">{weekly.heights[i].toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Max: {weekly.max}
                  </div>
                </div>

                <div className="h-40 flex items-end justify-between gap-2 bg-gray-100 p-4 rounded">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                    const height = Math.max(weekly.heights[i], weekly.counts[i] > 0 ? 4 : 0);
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex-1 flex items-end">
                          <div
                            className="w-full bg-blue-500 rounded-t transition-all duration-500"
                            style={{ height: `${height}%`, minHeight: weekly.counts[i] > 0 ? '4px' : '0' }}
                          />
                        </div>
                        <span className="text-xs font-medium">{day}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gray-50 p-4 rounded max-h-64 overflow-auto">
                  <h3 className="font-bold mb-2">Entry Details ({weekly.details.length})</h3>
                  <div className="text-sm space-y-1">
                    {weekly.details.map((d, i) => (
                      <div key={i} className="font-mono">
                        {'error' in d ? (
                          <span className="text-red-500">Error: {d.error}</span>
                        ) : (
                          <span>{d.date} → {d.dayName} (day {d.day})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
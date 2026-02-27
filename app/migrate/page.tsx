'use client';

import { useState, useEffect } from 'react';
import { saveUserData, getUserTheme, saveUserTheme } from '@/lib/supabase';
import { CoffeeData } from '@/types/coffee';

interface LocalUser {
  username: string;
  data: CoffeeData;
  theme: string | null;
}

export default function MigratePage() {
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [migrating, setMigrating] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    // Scan localStorage for Tazita data
    const foundUsers: LocalUser[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('tazita-data-')) {
        const username = key.replace('tazita-data-', '');
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          const themeKey = `tazita-theme-${username}`;
          const theme = localStorage.getItem(themeKey) || localStorage.getItem('tazita-theme');
          
          if (data && data.entries) {
            foundUsers.push({ username, data, theme });
          }
        } catch (e) {
          console.error('Error parsing data for', username);
        }
      }
    }
    
    setUsers(foundUsers);
  }, []);

  const migrateUser = async (user: LocalUser) => {
    setMigrating(user.username);
    
    try {
      console.log('Migrating user:', user.username);
      console.log('Data:', user.data);
      
      // Ensure data is valid
      if (!user.data || !user.data.entries) {
        throw new Error('Invalid data structure');
      }
      
      // Create proper CoffeeData object
      const coffeeData: CoffeeData = {
        entries: user.data.entries || [],
        username: user.username,
        createdAt: user.data.createdAt || new Date().toISOString()
      };
      
      // Migrate coffee data
      await saveUserData(user.username, coffeeData);
      
      // Migrate theme if exists
      if (user.theme) {
        await saveUserTheme(user.username, user.theme as any);
      }
      
      setResults(prev => ({
        ...prev,
        [user.username]: `Success! Migrated ${coffeeData.entries.length} entries`
      }));
    } catch (error) {
      console.error('Migration error:', error);
      setResults(prev => ({
        ...prev,
        [user.username]: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    } finally {
      setMigrating(null);
    }
  };

  const migrateAll = async () => {
    for (const user of users) {
      if (!results[user.username]?.includes('Success')) {
        await migrateUser(user);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Tazita Data Migration</h1>
        
        <p className="text-gray-600 mb-6">
          This tool migrates your local storage data to Supabase.
        </p>

        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No local data found. You may have already migrated or have no data.
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="font-medium">Found {users.length} user(s) in local storage:</p>
            </div>

            <div className="space-y-3 mb-6">
              {users.map(user => (
                <div key={user.username} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{user.username}</p>
                    <p className="text-sm text-gray-600">
                      {user.data.entries.length} entries
                      {user.theme && ` • Theme: ${user.theme}`}
                    </p>
                    {results[user.username] && (
                      <p className={`text-sm mt-1 ${results[user.username].includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
                        {results[user.username]}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => migrateUser(user)}
                    disabled={migrating === user.username || results[user.username]?.includes('Success')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {migrating === user.username ? 'Migrating...' : 
                     results[user.username]?.includes('Success') ? 'Migrated ✓' : 'Migrate'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={migrateAll}
              disabled={migrating !== null}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
            >
              Migrate All Users
            </button>
          </>
        )}

        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>After migration:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Your data will be synced to Supabase</li>
            <li>You can access it from any device</li>
            <li>Local data remains as backup (not deleted)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
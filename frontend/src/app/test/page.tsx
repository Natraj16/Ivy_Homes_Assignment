"use client";

import { useState } from 'react';
import { login, isAuthenticated } from '@/lib/auth';
import { fetchApi } from '@/lib/api';

export default function TestPhase0() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const log = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  const runTest = async () => {
    setLoading(true);
    setLogs([]);
    try {
      log('Starting Phase 0 test...');
      
      // 1. Test Login
      log('Attempting login...');
      await login('demo1@ivy.homes', 'cbed6d7335');
      
      if (isAuthenticated()) {
        log('Login successful! Token saved in localStorage.');
      } else {
        throw new Error('isAuthenticated() returned false after login');
      }

      // 2. Fetch a page of listings
      log('Fetching first page of /v1/listings...');
      const data: any = await fetchApi('/v1/listings?offset=0&limit=5');
      
      log(`Fetched ${data.results?.length} listings successfully.`);
      console.log('API Response:', data);
      log('Check browser console for the full data object.');

    } catch (e: any) {
      log(`ERROR: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Phase 0: Foundation Test Gate</h2>
      <button 
        onClick={runTest} 
        disabled={loading}
        style={{ padding: '10px', marginBottom: '20px', cursor: 'pointer' }}
      >
        {loading ? 'Running...' : 'Run Test Sequence'}
      </button>

      <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '4px' }}>
        <h3>Logs:</h3>
        {logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}

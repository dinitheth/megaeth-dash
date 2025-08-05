'use client';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SUBGRAPH_META } from '../graphql/queries';

export function NetworkStatusMonitor() {
  const { data, loading, error } = useQuery(GET_SUBGRAPH_META);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const endpoint = 'https://api.studio.thegraph.com/query/117912/mega-eth/v0.0.2';
    const ping = async () => {
      const start = Date.now();
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '{ __typename }' }),
        });
        setLatency(Date.now() - start);
      } catch {
        setLatency(null);
      }
    };
    ping();
  }, []);

  if (loading) return <div>Loading network status...</div>;
  if (error) return <div>Error loading network status</div>;

  const blockNumber = data._meta.block.number;

  return (
    <div className="p-4 bg-gray-800 rounded space-y-2">
      <div>Subgraph synced block: {blockNumber}</div>
      <div>RPC latency: {latency !== null ? `${latency}ms` : 'Error'}</div>
    </div>
  );
}
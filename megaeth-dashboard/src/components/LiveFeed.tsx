'use client';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECENT_TRANSFERS } from '../graphql/queries';
import { formatTokenAmount } from '../utils/formatters';

export function LiveFeed() {
  const { data, loading, error } = useQuery(GET_RECENT_TRANSFERS, {
    variables: { first: 10, skip: 0 },
    pollInterval: 3000,
  });

  if (loading) return <div>Loading live feed...</div>;
  if (error) return <div>Error loading live feed</div>;

  return (
    <div className="space-y-2 overflow-auto max-h-64">
      {data.transfers.map((tx: any) => (
        <div key={tx.id} className="flex justify-between py-1 border-b border-gray-700">
          <span className="font-mono text-sm">
            {tx.from.slice(0, 6)} → {tx.to.slice(0, 6)}
          </span>
          <span className="text-sm">
            {formatTokenAmount(tx.value)} TOKEN
          </span>
        </div>
      ))}
    </div>
  );
}
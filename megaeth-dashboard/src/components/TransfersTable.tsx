'use client';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECENT_TRANSFERS } from '../graphql/queries';
import { formatTokenAmount } from '../utils/formatters';

export function TransfersTable() {
  const { data, loading, error } = useQuery(GET_RECENT_TRANSFERS, {
    variables: { first: 10, skip: 0 },
    pollInterval: 5000,
  });

  if (loading) return <div>Loading transfers...</div>;
  if (error) return <div>Error loading transfers</div>;

  return (
    <div className="grid gap-2">
      {data.transfers.map((tx: any) => (
        <div key={tx.id} className="flex justify-between border-b py-2">
          <span>{tx.from.slice(0, 6)}... → {tx.to.slice(0, 6)}</span>
          <span>{formatTokenAmount(tx.value)} TOKEN</span>
        </div>
      ))}
    </div>
  );
}
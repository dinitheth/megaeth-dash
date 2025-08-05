'use client';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_WALLET_TOKEN_BALANCES } from '../graphql/queries';
import { formatTokenAmount } from '../utils/formatters';

export function WalletOverview({ walletAddress }: { walletAddress: string }) {
  const { data, loading, error } = useQuery(GET_WALLET_TOKEN_BALANCES, {
    variables: { wallet: walletAddress.toLowerCase() },
    pollInterval: 5000,
  });

  if (loading) return <div>Loading balances...</div>;
  if (error) return <div>Error loading balances</div>;

  return (
    <div className="grid gap-2">
      {data.holders.map((holder: any) => (
        <div key={holder.id} className="flex justify-between border-b py-2">
          <span>{holder.id.slice(0, 6)}...</span>
          <span>{formatTokenAmount(holder.balance)} TOKEN</span>
        </div>
      ))}
    </div>
  );
}
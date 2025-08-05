'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_WALLET_TOKEN_BALANCES, GET_WALLET_TRANSFERS } from '../../../graphql/queries';
import { formatTokenAmount } from '../../../utils/formatters';

export default function WalletPage() {
  const params = useParams();
  const address = params.address as string;

  const {
    data: balData,
    loading: balLoading,
    error: balError,
  } = useQuery(GET_WALLET_TOKEN_BALANCES, {
    variables: { wallet: address?.toLowerCase() },
    pollInterval: 5000,
  });

  const {
    data: txData,
    loading: txLoading,
    error: txError,
  } = useQuery(GET_WALLET_TRANSFERS, {
    variables: { wallet: address?.toLowerCase(), first: 10, skip: 0 },
    pollInterval: 5000,
  });

  if (!address) return <div>No wallet address provided.</div>;
  if (balLoading || txLoading) return <div>Loading wallet data...</div>;
  if (balError) return <div>Error loading balances</div>;
  if (txError) return <div>Error loading transactions</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Wallet Insights: {address}</h1>
      <section>
        <h2 className="text-xl font-semibold mb-4">Token Balances</h2>
        <div className="grid gap-2">
          {balData.holders.map((h: any) => (
            <div key={h.id} className="flex justify-between border-b py-2">
              <span>{h.id.slice(0, 6)}...</span>
              <span>{formatTokenAmount(h.balance)} TOKEN</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="grid gap-2">
          {txData.transfers.map((tx: any) => (
            <div key={tx.id} className="flex justify-between border-b py-2">
              <span>
                {tx.from.slice(0, 6)}... → {tx.to.slice(0, 6)}
              </span>
              <span>{formatTokenAmount(tx.value)} TOKEN</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
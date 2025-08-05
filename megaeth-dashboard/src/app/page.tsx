'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TOP_HOLDERS } from '../graphql/queries';
import { formatTokenAmount } from '../utils/formatters';
import { TransfersTable } from '../components/TransfersTable';
import { TopHoldersTable } from '../components/TopHoldersTable';
import { LiveFeed } from '../components/LiveFeed';
import { NetworkStatusMonitor } from '../components/NetworkStatusMonitor';

function TotalHoldingsCard() {
  const { data, loading, error } = useQuery(GET_TOP_HOLDERS, {
    variables: { first: 100 },
  });

  if (loading) return <div>Loading total holdings...</div>;
  if (error) return <div>Error loading total holdings</div>;

  const totalRaw = data.holders.reduce((sum: number, h: any) => sum + Number(h.balance), 0);
  const formatted = formatTokenAmount(totalRaw.toString());

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h3 className="text-lg font-medium mb-2">Total Token Holdings</h3>
      <p className="text-2xl">{formatted} TOKEN</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">MegaETH Portfolio Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TotalHoldingsCard />
        <NetworkStatusMonitor />
        <LiveFeed />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Transfers</h2>
        <TransfersTable />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Top Holders</h2>
        <TopHoldersTable />
      </section>
    </div>
  );
}

'use client';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TOP_HOLDERS, GET_RECENT_TRANSFERS } from '../../graphql/queries';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91', '#4A4E69'];

export default function AnalyticsPage() {
  const { data: holdersData, loading: holdersLoading, error: holdersError } = useQuery(GET_TOP_HOLDERS, {
    variables: { first: 10 },
    pollInterval: 30000,
  });
  const { data: txData, loading: txLoading, error: txError } = useQuery(GET_RECENT_TRANSFERS, {
    variables: { first: 50, skip: 0 },
    pollInterval: 30000,
  });

  if (holdersLoading || txLoading) return <div>Loading analytics...</div>;
  if (holdersError) return <div>Error loading holders data</div>;
  if (txError) return <div>Error loading transfers data</div>;

  const pieData = holdersData.holders.map((h: any) => ({
    name: h.id.slice(0, 6) + '...',
    value: Number(h.balance) / Math.pow(10, 18),
  }));

  // group transfers by date and sum values
  const transfersByDate: Record<string, number> = {};
  txData.transfers.forEach((tx: any) => {
    const date = new Date(Number(tx.timestamp) * 1000).toISOString().split('T')[0];
    transfersByDate[date] = (transfersByDate[date] || 0) + Number(tx.value) / Math.pow(10, 18);
  });
  const lineData = Object.entries(transfersByDate)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Holders Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Token Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((_: any, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(val: any) => `${Number(val).toFixed(2)} TOKEN`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Transfer Volume Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <RechartsTooltip formatter={(val: any) => `${Number(val).toFixed(2)} TOKEN`} />
              <Legend />
              <Line type="monotone" dataKey="value" name="Volume" stroke="#00C49F" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
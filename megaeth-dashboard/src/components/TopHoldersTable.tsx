'use client';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TOP_HOLDERS } from '../graphql/queries';
import { formatTokenAmount } from '../utils/formatters';

export function TopHoldersTable({ first = 10 }: { first?: number }) {
  const { data, loading, error } = useQuery(GET_TOP_HOLDERS, {
    variables: { first },
    pollInterval: 15000,
  });

  if (loading) return <div>Loading top holders...</div>;
  if (error) return <div>Error loading top holders</div>;

  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Rank</th>
          <th className="px-4 py-2 text-left">Address</th>
          <th className="px-4 py-2 text-right">Balance</th>
        </tr>
      </thead>
      <tbody>
        {data.holders.map((holder: any, idx: number) => (
          <tr key={holder.id} className="border-b border-gray-700">
            <td className="px-4 py-2">{idx + 1}</td>
            <td className="px-4 py-2">{holder.id.slice(0, 6)}...</td>
            <td className="px-4 py-2 text-right">
              {formatTokenAmount(holder.balance)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
import { gql } from '@apollo/client';

export const GET_WALLET_TOKEN_BALANCES = gql`
  query GetWalletTokenBalances($wallet: Bytes!) {
    holders(where: { id: $wallet }) {
      id
      balance
    }
  }
`;

export const GET_RECENT_TRANSFERS = gql`
  query GetRecentTransfers($first: Int!, $skip: Int) {
    transfers(first: $first, skip: $skip, orderBy: timestamp, orderDirection: desc) {
      id
      from
      to
      value
      token
      timestamp
    }
  }
`;

export const GET_WALLET_TRANSFERS = gql`
  query GetWalletTransfers($wallet: Bytes!, $first: Int!, $skip: Int) {
    transfers(
      where: { or: [{ from: $wallet }, { to: $wallet }] }
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      from
      to
      value
      token
      timestamp
    }
  }
`;

export const GET_TOP_HOLDERS = gql`
  query GetTopHolders($first: Int!) {
    holders(first: $first, orderBy: balance, orderDirection: desc) {
      id
      balance
    }
  }
`;
export const GET_SUBGRAPH_META = gql`
  query GetSubgraphMeta {
    _meta {
      block {
        number
      }
    }
  }
`;
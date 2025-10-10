export const cryptocurrencyAdapterGet = (data) => {
  const crypto = data?.data?.data;
  return {
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    algorithm: crypto.algorithm,
    market_cap_usd: crypto.market_cap_usd,
    status: crypto.status
  };
};


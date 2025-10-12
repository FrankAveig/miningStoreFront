export const cryptocurrencyAdapterGet = (data) => {
  const crypto = data?.data?.data;
  return {
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    algorithm: crypto.algorithm,
    market_cap_usd: crypto.market_cap_usd,
    image_url: crypto.image_url,
    status: crypto.status
  };
};


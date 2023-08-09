import Moralis from 'moralis';

try {
  await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjI5N2I2ZTkzLWUwNWEtNGM3MS1iMjExLTBiZGNmYTlhYTAwNCIsIm9yZ0lkIjoiMzUxODQzIiwidXNlcklkIjoiMzYxNjM1IiwidHlwZUlkIjoiZTBjZTFlNmQtMWRiYy00NTRhLWI5YTAtMDE3MjQ1M2FjODc5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTEzNDIzMTAsImV4cCI6NDg0NzEwMjMxMH0.Q5WVYDPsyUPnZfWjHL4I5Qfl2smXVpK2d-DFfA9QPAM"
  });

  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    "chain": "0x5",
    "format": "decimal",
    "mediaItems": false,
    "address": "0xBbBD66C9cebF2094806f6a4B6044876AA9494216"
  });

  console.log(response.raw);
} catch (e) {
  console.error(e);
}
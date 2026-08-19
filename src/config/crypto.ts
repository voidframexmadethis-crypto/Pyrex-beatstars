export const CRYPTO_CONFIG = {
  EVM_ADDRESS: '0xYourActualWalletAddressHere', // Replace with your ETH/USDC address
  SOLANA_ADDRESS: '11111111111111111111111111111111', // Replace with your SOL address
  BITCOIN_ADDRESS: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Replace with your BTC address
  
  EXPLORERS: {
    evm: 'https://etherscan.io/address/',
    solana: 'https://solscan.io/account/',
    bitcoin: 'https://www.blockchain.com/btc/address/',
  },

  // Dynamic QR Code Generation Utility
  generateQRCode: (address: string, amount: number, type: 'ethereum' | 'bitcoin' | 'solana' = 'ethereum') => {
    const payload = type === 'solana' ? address : `${type}:${address}?amount=${amount}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}`;
  }
};

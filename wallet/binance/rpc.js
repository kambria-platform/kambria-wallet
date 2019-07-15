const BNB_RPC = {
  MAINNET: {
    id: 'Binance-Chain-Tigris',
    rpc: 'https://dex.binance.org'
  },
  TESTNET: {
    id: 'Binance-Chain-Nile',
    rpc: 'https://testnet-dex.binance.org'
  }
}

let getBnbRPC = (net) => {
  net = net.toString();
  switch (net) {
    case 'Binance-Chain-Tigris':
      return BNB_RPC.MAINNET.rpc;
    case 'Binance-Chain-Nile':
      return BNB_RPC.TESTNET.rpc;
    case 'mainnet':
      return BNB_RPC.MAINNET.rpc;
    case '1':
      return BNB_RPC.MAINNET.rpc;
    case 'testnet':
      return BNB_RPC.TESTNET.rpc;
    default:
      return BNB_RPC.TESTNET.rpc;
  }
}

module.exports = getBnbRPC;
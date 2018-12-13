const RPC = {
  MAINNET: {
    id: 1,
    rpc: 'https://mainnet.infura.io/v3/55b8fc1234d845ffbea5da26f9ae70f5'
  },
  ROPSTEN: {
    id: 3,
    rpc: 'https://ropsten.infura.io/v3/55b8fc1234d845ffbea5da26f9ae70f5'
  },
  KOVAN: {
    id: 42,
    rpc: 'https://kovan.infura.io/v3/55b8fc1234d845ffbea5da26f9ae70f5'
  },
  RINKEBY: {
    id: 4,
    rpc: 'https://rinkeby.infura.io/v3/55b8fc1234d845ffbea5da26f9ae70f5'
  },
  DEFAULT: {
    id: '*',
    rpc: 'http://localhost:9545'
  }
}

var getRPC = function (net) {
  switch (net) {
    case 1:
      return RPC.MAINNET.rpc;
    case 3:
      return RPC.ROPSTEN.rpc;
    case 42:
      return RPC.KOVAN.rpc;
    case 4:
      return RPC.RINKEBY.rpc;
    case 'mainnet':
      return RPC.MAINNET.rpc;
    case 'ropsten':
      return RPC.ROPSTEN.rpc;
    case 'kovan':
      return RPC.KOVAN.rpc;
    case 'rinkeby':
      return RPC.RINKEBY.rpc;
    default:
      return RPC.DEFAULT.rpc;
  }
}

module.exports = getRPC;
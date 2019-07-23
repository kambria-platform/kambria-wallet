const ETHEREUM = {
  MAINNET: {
    id: 1,
    explorer: ''
  },
  ROPSTEN: {
    id: 3,
    explorer: 'ropsten.'
  },
  KOVAN: {
    id: 42,
    explorer: 'kovan.'
  },
  RINKEBY: {
    id: 4,
    explorer: 'rinkeby.'
  },
  GOERLI: {
    id: 5,
    explorer: 'goerli.'
  },
}

const BINANCE = {
  MAINNET: {
    id: 1,
    explorer: ''
  },
  TESTNET: {
    id: 2,
    explorer: 'testnet-'
  },
}

const config = {
  ethereum: ETHEREUM.RINKEBY,
  binance: BINANCE.TESTNET
}

export default config;
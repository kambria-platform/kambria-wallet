var { BnbClient, BinanceSDK, Ledger } = require('binance-core-js');
var rpc = require('binance-core-js/dist/provider/rpc');

const ERROR = 'Cannot load addresses';

class Helper {

  static getAddressByBinanceSDK(data, dpath, limit, page) {
    let binanceSDK = new BinanceSDK(window.kambriaWallet.networkId, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Mnemonic
        case 'mnemonic':
          return binanceSDK.getAccountsByMnemonic(
            data.asset.mnemonic,
            limit,
            page,
            (er, re) => {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Keystore
        case 'keystore':
          return binanceSDK.getAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            (er, re) => {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Private key
        case 'private-key':
          return binanceSDK.getAccountByPrivatekey(
            data.asset.privateKey,
            (er, re) => {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static getAddressByLedger(data, dpath, limit, page) {
    let ledger = new Ledger(window.kambriaWallet.networkId, data.type, true);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Ledger Nano S
        case 'ledger-nano-s':
          return ledger.getAccountsByLedgerNanoS(
            dpath,
            limit,
            page,
            (er, re) => {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static getBalance(address) {
    let bnbClient = new BnbClient(rpc.getRPC(window.kambriaWallet.networkId));
    bnbClient.chooseNetwork(rpc.getNetwork(window.kambriaWallet.networkId));
    return new Promise((resolve, reject) => {
      bnbClient.getBalance(address).then(re => {
        if (!re || re.length == 0) return reject('Cannot get balance');
        for (let i = 0; i < re.length; i++) {
          if (re[i].symbol == 'BNB') return resolve(re[i].free);
        }
      }).catch(er => {
        if (er) return reject(er);
      });
    });
  }
}

export default Helper;
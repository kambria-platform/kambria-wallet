var { BncClient, BinanceSDK, Ledger } = require('binance-core-js');
var rpc = require('binance-core-js/dist/provider/rpc');

const ERROR = 'Cannot load addresses';

class Helper {

  static getAddressByBinanceSDK(data, dpath, limit, page) {
    let options = {
      getApproval: window.kambriaWallet.getApproval,
      getPassphrase: window.kambriaWallet.getPassphrase
    }
    let binanceSDK = new BinanceSDK(window.kambriaWallet.networkId.binance, options);
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
    let options = {
      getApproval: window.kambriaWallet.getApproval,
      getWaiting: window.kambriaWallet.getWaiting
    }
    let ledger = new Ledger(window.kambriaWallet.networkId.binance, options);
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
    let client = new BncClient(rpc.getRPC(window.kambriaWallet.networkId.binance));
    client.chooseNetwork(rpc.getNetwork(window.kambriaWallet.networkId.binance));
    return new Promise((resolve, reject) => {
      client.getBalance(address).then(re => {
        if (!re || re.length == 0) return reject('Cannot get balance');
        for (let i = 0; i < re.length; i++) {
          if (re[i].symbol == 'BNB') return resolve(re[i].free);
        }
        return resolve(0);
      }).catch(er => {
        if (er) return reject(er);
      });
    });
  }
}

export default Helper;
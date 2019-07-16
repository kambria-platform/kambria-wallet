var BnbClient = require('@binance-chain/javascript-sdk');
var getBnbRPC = require('../../rpc');
var crypto = BnbClient.crypto;

const ERROR = 'Cannot load addresses';

class Helper {

  static getAddressByBinanceSDK(data, dpath, limit, page) {
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Mnemonic
        case 'mnemonic':
          let addressesFromMnemonic = [];
          for (let i = limit * page; i < limit * (page + 1); i++) {
            let privFromMnemonic = crypto.getPrivateKeyFromMnemonic(data.asset.mnemonic, dpath, i);
            if (!privFromMnemonic) return reject(ERROR);
            let addrFromMnemonic = crypto.getAddressFromPrivateKey(privFromMnemonic);
            if (!addrFromMnemonic) return reject(ERROR);
            addressesFromMnemonic.push(addrFromMnemonic);
          }
          return resolve(addressesFromMnemonic);
        // Keystore
        case 'keystore':
          try {
            let privFromKeystore = crypto.getPrivateKeyFromKeyStore(data.asset.keystore, data.asset.password);
            let addrFromKeystore = crypto.getAddressFromPrivateKey(privFromKeystore);
            return resolve([addrFromKeystore]);
          } catch (er) {
            if (er) return reject(ERROR);
          }
        // Private key
        case 'private-key':
          let addrFromPrivatekey = crypto.getAddressFromPrivateKey(data.asset.privateKey);
          return resolve([addrFromPrivatekey]);
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  // static getAddressByLedger(data, dpath, limit, page) {
  //   let ledger = new Ledger(window.kambriaWallet.networkId, data.type, true);
  //   return new Promise((resolve, reject) => {
  //     switch (data.model) {
  //       // Ledger Nano S
  //       case 'ledger-nano-s':
  //         return ledger.getAccountsByLedgerNanoS(
  //           dpath,
  //           limit,
  //           page,
  //           (er, re) => {
  //             if (er || re.length <= 0) return reject(ERROR);
  //             return resolve(re);
  //           });
  //       // Error
  //       default:
  //         return reject(ERROR);
  //     }
  //   });
  // }

  static getBalance(address) {
    let bnbClient = new BnbClient(getBnbRPC(window.kambriaWallet.networkId));
    bnbClient.chooseNetwork(window.kambriaWallet.networkId === 1 ? 'mainnet' : 'testnet');
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
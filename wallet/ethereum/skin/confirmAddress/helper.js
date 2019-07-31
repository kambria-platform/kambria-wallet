var { NonWallet, Isoxys, Ledger, Trezor } = require('capsule-core-js');

const ERROR = 'Cannot load addresses';

class Helper {

  static getAddressByIsoxys(data, dpath, limit, page) {
    let options = {
      getPassphrase: window.kambriaWallet.getPassphrase,
      getApproval: window.kambriaWallet.getApproval
    }
    let isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, options);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Mnemonic
        case 'mnemonic':
          return isoxys.getAccountsByMnemonic(
            data.asset.mnemonic,
            data.asset.password,
            dpath,
            limit,
            page,
            (er, re) => {
              if (er || re.length <= 0) return reject(ERROR);
              return resolve(re);
            });
        // Keystore
        case 'keystore':
          return isoxys.getAccountByKeystore(
            data.asset.keystore,
            data.asset.password,
            (er, re) => {
              if (er || !re) return reject(ERROR);
              return resolve([re]);
            });
        // Private key
        case 'private-key':
          return isoxys.getAccountByPrivatekey(
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
    let ledger = new Ledger(window.kambriaWallet.networkId.ethereum, options);
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

  static getAddressByTrezor(data, dpath, limit, page) {
    let options = {
      getApproval: window.kambriaWallet.getApproval,
      getWaiting: window.kambriaWallet.getWaiting
    }
    let trezor = new Trezor(window.kambriaWallet.networkId.ethereum, options);
    return new Promise((resolve, reject) => {
      switch (data.model) {
        // Trezor One
        case 'trezor-one':
          return trezor.getAccountsByTrezorOne(
            dpath,
            limit,
            page,
            (er, re) => {
              if (er || re.length < 0) return reject(ERROR);
              return resolve(re);
            });
        // Error
        default:
          return reject(ERROR);
      }
    });
  }

  static getBalance(address) {
    return new Promise((resolve, reject) => {
      let nonWallet = new NonWallet(window.kambriaWallet.networkId.ethereum);
      nonWallet.init((er, web3) => {
        if (er) return reject(er);

        web3.eth.getBalance(address, (er, re) => {
          if (er) return reject(er);
          return resolve(web3.fromWei(re.toString(), 'ether'));
        });
      });
    });
  }
}

export default Helper;
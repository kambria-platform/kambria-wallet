var BnbClient = require('@binance-chain/javascript-sdk');
var crypto = BnbClient.crypto;
var getBnbRPC = require('./rpc');
var StateMaintainer = require('../stateMaintainer');

const ERROR = 'Invalid state of finite state machine';

class BinanceClientFactory {
  constructor(restriedNetwork, pageRefreshing) {
    this.restriedNetwork = restriedNetwork;
    this.pageRefreshing = pageRefreshing;

    this.SM = new StateMaintainer();
    if (!this.pageRefreshing) this.SM.clearState();
  }

  isSessionMaintained = (callback) => {
    if (!this.pageRefreshing) return callback(null);
    return this.SM.getState(callback);
  }

  clearSession = () => {
    this.SM.clearState();
  }

  generate = (fmState, callback) => {
    let bnbClient = new BnbClient(getBnbRPC(window.kambriaWallet.networkId));
    bnbClient.chooseNetwork(window.kambriaWallet.networkId === 1 ? 'mainnet' : 'testnet');

    let _callback = (er, provider) => {
      if (er) return callback(er, null);
      if (this.pageRefreshing && fmState.step === 'Success') {
        // Not support Hybridwallet and Trezor yet
        if (fmState.type !== 'hybridwallet') this.SM.setState(fmState);
      }
      return callback(null, provider);
    }

    switch (fmState.wallet) {

      // Ledger
      // case 'ledger':
      //   let ledger = new Ledger(window.kambriaWallet.networkId, fmState.type, this.restriedNetwork);
      //   switch (fmState.model) {
      //     case 'ledger-nano-s':
      //       return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
      //         if (er) return _callback(er, null);
      //         return _callback(null, ledger);
      //       });
      //     default:
      //       return _callback(ERROR, null);
      //   }

      // Isoxys
      case 'binance-sdk':
        switch (fmState.model) {
          case 'mnemonic':
            let privFromMnemonic = crypto.getPrivateKeyFromMnemonic(fmState.asset.mnemonic, fmState.dpath, fmState.index);
            return bnbClient.setPrivateKey(privFromMnemonic).then(() => {
              return bnbClient.initChain();
            }).then(() => {
              return _callback(null, bnbClient);
            }).catch(er => {
              // With zero balance, BnbClient return error, that's not really an error
              return _callback(null, bnbClient);
            });
          case 'keystore':
            let privFromKeystore = crypto.getPrivateKeyFromKeyStore(fmState.asset.keystore, fmState.asset.password);
            return bnbClient.setPrivateKey(privFromKeystore).then(() => {
              return bnbClient.initChain();
            }).then(() => {
              return _callback(null, bnbClient);
            }).catch(er => {
              // With zero balance, BnbClient return error, that's not really an error
              return _callback(null, bnbClient);
            });
          case 'private-key':
            return bnbClient.setPrivateKey(fmState.asset.privateKey).then(() => {
              return bnbClient.initChain();
            }).then(() => {
              return _callback(null, bnbClient);
            }).catch(er => {
              // With zero balance, BnbClient return error, that's not really an error
              return _callback(null, bnbClient);
            });
          default:
            return _callback(ERROR, null);
        }

      // Default
      default:
        return _callback(ERROR, null);
    }
  }

  regenerate = (fmState, callback) => {
    if (fmState.blockchain !== 'ethereum') return callback('Unavailable blockchain type', null);

    switch (fmState.wallet) {

      // Ledger
      // case 'ledger':
      //   let ledger = new Ledger(window.kambriaWallet.networkId, fmState.type, this.restriedNetwork);
      //   switch (fmState.model) {
      //     case 'ledger-nano-s':
      //       return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
      //         if (er) return callback(er, null);
      //         return callback(null, ledger);
      //       });
      //     default:
      //       return callback(ERROR, null);
      //   }

      // Isoxys
      case 'isoxys':
        let isoxys = new Isoxys(window.kambriaWallet.networkId, fmState.type, this.restriedNetwork);
        let accOpts = { getPassphrase: window.kambriaWallet.getPassphrase.open };
        return isoxys.setWallet(accOpts, (er, re) => {
          if (er) return callback(er, null);
          return callback(null, isoxys);
        });

      // Default
      default:
        return callback(ERROR, null);
    }
  }
}

export default BinanceClientFactory;
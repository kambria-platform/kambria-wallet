var { Ledger, BinanceSDK } = require('binance-core-js');
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
      case 'ledger':
        let ledger = new Ledger(window.kambriaWallet.networkId, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
              if (er) return _callback(er, null);
              return _callback(null, ledger);
            });
          default:
            return _callback(ERROR, null);
        }

      // BinanceSDK
      case 'binance-sdk':
        let binanceSDK = new BinanceSDK(window.kambriaWallet.networkId, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'mnemonic':
            return binanceSDK.setAccountByMnemonic(
              fmState.asset.mnemonic,
              fmState.index,
              window.kambriaWallet.getPassphrase.open,
              (er, re) => {
                if (er) return _callback(er, null);
                return _callback(null, binanceSDK);
              });
          case 'keystore':
            return binanceSDK.setAccountByKeystore(
              fmState.asset.keystore,
              fmState.asset.password,
              window.kambriaWallet.getPassphrase.open,
              (er, re) => {
                if (er) return _callback(er, null);
                return _callback(null, binanceSDK);
              });
          case 'private-key':
            return binanceSDK.setAccountByPrivatekey(
              fmState.asset.privateKey,
              window.kambriaWallet.getPassphrase.open,
              (er, re) => {
                if (er) return _callback(er, null);
                return _callback(null, binanceSDK);
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
    if (fmState.blockchain !== 'binance') return callback('Unavailable blockchain type', null);

    switch (fmState.wallet) {
      
      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.kambriaWallet.networkId, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, ledger);
            });
          default:
            return callback(ERROR, null);
        }

      // BinanceSDK
      case 'binance-sdk':
        let binanceSDK = new BinanceSDK(window.kambriaWallet.networkId, fmState.type, this.restriedNetwork);
        let accOpts = { getPassphrase: window.kambriaWallet.getPassphrase.open };
        return binanceSDK.setWallet(accOpts, (er, re) => {
          if (er) return callback(er, null);
          return callback(null, binanceSDK);
        });

      // Default
      default:
        return callback(ERROR, null);
    }
  }
}

export default BinanceClientFactory;
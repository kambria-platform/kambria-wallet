var { Ledger, Trust, BinanceSDK } = require('binance-core-js');

const ERROR = 'Invalid state of finite state machine';

class BinanceClientFactory {
  constructor(restriedNetwork) {
    this.restriedNetwork = restriedNetwork;
  }

  generate = (fmState, callback) => {
    switch (fmState.wallet) {

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.kambriaWallet.networkId.binance, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, ledger);
            });
          default:
            return callback(ERROR, null);
        }

      // Trust Wallet
      case 'trust':
        return callback(null, fmState.provider);

      // BinanceSDK
      case 'binance-sdk':
        let binanceSDK = new BinanceSDK(window.kambriaWallet.networkId.binance, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'mnemonic':
            return binanceSDK.setAccountByMnemonic(
              fmState.asset.mnemonic,
              fmState.index,
              window.kambriaWallet.getPassphrase.open,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, binanceSDK);
              });
          case 'keystore':
            return binanceSDK.setAccountByKeystore(
              fmState.asset.keystore,
              fmState.asset.password,
              window.kambriaWallet.getPassphrase.open,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, binanceSDK);
              });
          case 'private-key':
            return binanceSDK.setAccountByPrivatekey(
              fmState.asset.privateKey,
              window.kambriaWallet.getPassphrase.open,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, binanceSDK);
              });
          default:
            return callback(ERROR, null);
        }

      // Default
      default:
        return callback(ERROR, null);
    }
  }

  regenerate = (fmState, callback) => {
    switch (fmState.wallet) {

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.kambriaWallet.networkId.binance, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, ledger);
            });
          default:
            return callback(ERROR, null);
        }

      // Trust Wallet
      case 'trust':
        let trust = new Trust(window.kambriaWallet.networkId.binance, fmState.type, this.restriedNetwork);
        return trust.setAccountByTrustWallet(window.kambriaWallet.getAuthentication, (er, re) => {
          if (er) return callback(er, null);
          return callback(null, trust);
        });

      // BinanceSDK
      case 'binance-sdk':
        let binanceSDK = new BinanceSDK(window.kambriaWallet.networkId.binance, fmState.type, this.restriedNetwork);
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
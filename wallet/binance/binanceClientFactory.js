var { Ledger, Trust, BinanceSDK } = require('binance-core-js');

const ERROR = 'Invalid state of finite state machine';

class BinanceClientFactory {
  
  generate = (fmState, callback) => {
    switch (fmState.wallet) {

      // Ledger
      case 'ledger':
        let ledgerOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        let ledger = new Ledger(window.kambriaWallet.networkId.binance, ledgerOptions);
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
        let binanceSDKOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getPassphrase: window.kambriaWallet.getPassphrase
        }
        let binanceSDK = new BinanceSDK(window.kambriaWallet.networkId.binance, binanceSDKOptions);
        switch (fmState.model) {
          case 'mnemonic':
            return binanceSDK.setAccountByMnemonic(
              fmState.asset.mnemonic,
              fmState.index,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, binanceSDK);
              });
          case 'keystore':
            return binanceSDK.setAccountByKeystore(
              fmState.asset.keystore,
              fmState.asset.password,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, binanceSDK);
              });
          case 'private-key':
            return binanceSDK.setAccountByPrivatekey(
              fmState.asset.privateKey,
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
        let ledgerOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        let ledger = new Ledger(window.kambriaWallet.networkId.binance, ledgerOptions);
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
        let trustOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getAuthentication: window.kambriaWallet.getAuthentication
        }
        let trust = new Trust(window.kambriaWallet.networkId.binance, trustOptions);
        return trust.setAccountByTrustWallet((er, re) => {
          if (er) return callback(er, null);
          return callback(null, trust);
        });

      // BinanceSDK
      case 'binance-sdk':
        let binanceSDKOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getPassphrase: window.kambriaWallet.getPassphrase
        }
        let binanceSDK = new BinanceSDK(window.kambriaWallet.networkId.binance, binanceSDKOptions);
        return binanceSDK.setWallet({}, (er, re) => {
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
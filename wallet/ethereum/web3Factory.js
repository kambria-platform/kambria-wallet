var { Metamask, Ledger, Trezor, Trust, MEW, Isoxys } = require('capsule-core-js');

const ERROR = 'Invalid state of finite state machine';

class Web3Factory {

  generate = (fmState, callback) => {
    switch (fmState.wallet) {

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.kambriaWallet.networkId.ethereum);
        return metamask.setAccountByMetamask((er, re) => {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledgerOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        let ledger = new Ledger(window.kambriaWallet.networkId.ethereum, ledgerOptions);
        switch (fmState.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, ledger);
            });
          default:
            return callback(ERROR, null);
        }

      // Trezor
      case 'trezor':
        let trezorOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        let trezor = new Trezor(window.kambriaWallet.networkId.ethereum, trezorOptions);
        switch (fmState.model) {
          case 'trezor-one':
            return trezor.setAccountByTrezorOne(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, trezor);
            });
          default:
            return callback(ERROR, null);
        }

      // MyEtherWallet
      case 'mew':
        return callback(null, fmState.provider);

      // Trust Wallet
      case 'trust':
        return callback(null, fmState.provider);

      // Isoxys
      case 'isoxys':
        let isoxysOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getPassphrase: window.kambriaWallet.getPassphrase
        }
        let isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, isoxysOptions);
        switch (fmState.model) {
          case 'mnemonic':
            return isoxys.setAccountByMnemonic(
              fmState.asset.mnemonic,
              fmState.asset.password,
              fmState.dpath,
              fmState.index,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, isoxys);
              });
          case 'keystore':
            return isoxys.setAccountByKeystore(
              fmState.asset.keystore,
              fmState.asset.password,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, isoxys);
              });
          case 'private-key':
            return isoxys.setAccountByPrivatekey(
              fmState.asset.privateKey,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, isoxys);
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

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.kambriaWallet.networkId.ethereum);
        return metamask.setAccountByMetamask((er, re) => {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledgerOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        let ledger = new Ledger(window.kambriaWallet.networkId.ethereum, ledgerOptions);
        switch (fmState.model) {
          case 'ledger-nano-s':
            return ledger.setAccountByLedgerNanoS(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, ledger);
            });
          default:
            return callback(ERROR, null);
        }

      // Trezor
      case 'trezor':
        let trezorOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        let trezor = new Trezor(window.kambriaWallet.networkId.ethereum, trezorOptions);
        switch (fmState.model) {
          case 'trezor-one':
            return trezor.setAccountByTrezorOne(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, trezor);
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
        let trust = new Trust(window.kambriaWallet.networkId.ethereum, trustOptions);
        return trust.setAccountByTrustWallet((er, re) => {
          if (er) return callback(er, null);
          return callback(null, trust);
        });

      // My Ether Wallet
      case 'mew':
        let mewOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getAuthentication: window.kambriaWallet.getAuthentication
        }
        let mew = new MEW(window.kambriaWallet.networkId.ethereum, mewOptions);
        return mew.setAccountByMEW((er, re) => {
          if (er) return callback(er, null);
          return callback(null, trust);
        });

      // Isoxys
      case 'isoxys':
        let isoxysOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getPassphrase: window.kambriaWallet.getPassphrase
        }
        let isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, isoxysOptions);
        return isoxys.setWallet({}, (er, re) => {
          if (er) return callback(er, null);
          return callback(null, isoxys);
        });

      // Default
      default:
        return callback(ERROR, null);
    }
  }
}

export default Web3Factory;
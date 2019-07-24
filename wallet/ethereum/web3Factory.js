var { Metamask, Ledger, Trezor, Trust, MEW, Isoxys } = require('capsule-core-js');

const ERROR = 'Invalid state of finite state machine';

class Web3Factory {
  constructor(restriedNetwork) {
    this.restriedNetwork = restriedNetwork;
  }

  generate = (fmState, callback) => {
    switch (fmState.wallet) {

      // Metamask
      case 'metamask':
        let metamask = new Metamask(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
        return metamask.setAccountByMetamask((er, re) => {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
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
        let trezor = new Trezor(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
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
        let isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'mnemonic':
            return isoxys.setAccountByMnemonic(
              fmState.asset.mnemonic,
              fmState.asset.password,
              fmState.dpath,
              fmState.index,
              window.kambriaWallet.getPassphrase.open,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, isoxys);
              });
          case 'keystore':
            return isoxys.setAccountByKeystore(
              fmState.asset.keystore,
              fmState.asset.password,
              window.kambriaWallet.getPassphrase.open,
              (er, re) => {
                if (er) return callback(er, null);
                return callback(null, isoxys);
              });
          case 'private-key':
            return isoxys.setAccountByPrivatekey(
              fmState.asset.privateKey,
              window.kambriaWallet.getPassphrase.open,
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
        let metamask = new Metamask(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
        return metamask.setAccountByMetamask((er, re) => {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        let ledger = new Ledger(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
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
        let trust = new Trust(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
        return trust.setAccountByTrustWallet(window.kambriaWallet.getAuthentication, (er, re) => {
          if (er) return callback(er, null);
          return callback(null, trust);
        });

      // My Ether Wallet
      case 'mew':
        let mew = new MEW(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
        return mew.setAccountByMEW(window.kambriaWallet.getAuthentication, (er, re) => {
          if (er) return callback(er, null);
          return callback(null, trust);
        });

      // Trezor
      case 'trezor':
        let trezor = new Trezor(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
        switch (fmState.model) {
          case 'trezor-one':
            return trezor.setAccountByTrezorOne(fmState.dpath, fmState.index, (er, re) => {
              if (er) return callback(er, null);
              return callback(null, trezor);
            });
          default:
            return callback(ERROR, null);
        }

      // Isoxys
      case 'isoxys':
        let isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, fmState.type, this.restriedNetwork);
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

export default Web3Factory;
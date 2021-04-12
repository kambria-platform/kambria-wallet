const { Metamask, Ledger, Trezor, Trust, MEW, Isoxys } = require('capsule-core-js');

const ERROR = 'Invalid state of finite state machine';

class Web3Factory {

  generate = (fmState, callback) => {
    switch (fmState.wallet) {

      // Metamask
      case 'metamask':
        const metamask = new Metamask(window.kambriaWallet.networkId.ethereum);
        return metamask.setAccountByMetamask((er, re) => {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        const ledgerOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        const ledger = new Ledger(window.kambriaWallet.networkId.ethereum, ledgerOptions);
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
        const trezorOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        const trezor = new Trezor(window.kambriaWallet.networkId.ethereum, trezorOptions);
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
        const isoxysOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getPassphrase: window.kambriaWallet.getPassphrase
        }
        const isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, isoxysOptions);
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
        const metamask = new Metamask(window.kambriaWallet.networkId.ethereum);
        return metamask.setAccountByMetamask((er, re) => {
          if (er) return callback(er, null);
          return callback(null, metamask);
        });

      // Ledger
      case 'ledger':
        const ledgerOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        const ledger = new Ledger(window.kambriaWallet.networkId.ethereum, ledgerOptions);
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
        const trezorOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getWaiting: window.kambriaWallet.getWaiting
        }
        const trezor = new Trezor(window.kambriaWallet.networkId.ethereum, trezorOptions);
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
        const trustOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getAuthentication: window.kambriaWallet.getAuthentication
        }
        const trust = new Trust(window.kambriaWallet.networkId.ethereum, trustOptions);
        return trust.setAccountByTrustWallet((er, re) => {
          if (er) return callback(er, null);
          return callback(null, trust);
        });

      // My Ether Wallet
      case 'mew':
        const mewOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getAuthentication: window.kambriaWallet.getAuthentication
        }
        const mew = new MEW(window.kambriaWallet.networkId.ethereum, mewOptions);
        return mew.setAccountByMEW((er, re) => {
          if (er) return callback(er, null);
          return callback(null, trust);
        });

      // Isoxys
      case 'isoxys':
        const isoxysOptions = {
          getApproval: window.kambriaWallet.getApproval,
          getPassphrase: window.kambriaWallet.getPassphrase
        }
        const isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, isoxysOptions);
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
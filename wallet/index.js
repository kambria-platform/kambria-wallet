import React, { Component, Fragment } from 'react';

import StateMaintainer from './stateMaintainer';
import Ethereum from './ethereum';
import InputPassphrase from './core/inputPassphrase';
import GetAuthentication from './core/getAuthentication';
import GetApproval from './core/getApproval';
import GetWaiting from './core/getWaiting';

// Constants
const DEFAULT_STATE = {
  // Wallet
  visible: false,
  // Passphrase  
  passphrase: false,
  // Authentication
  authetication: false,
  qrcode: null,
  // Waiting
  waiting: false,
  // Approval
  approval: false,
  txParams: null,
}
const DEFAULT_OPT = {
  networkId: {
    ethereum: 1,
  },
  pageRefreshing: true
}


class KambriaWallet extends Component {
  constructor(props) {
    super(props);

    this.options = { ...DEFAULT_OPT, ...props.options }
    this.done = props.done;
    this.SM = new StateMaintainer();

    this.state = {
      ...DEFAULT_STATE,
      visible: props.visible
    }

    /**
     * Group of global functions
     */
    window.kambriaWallet = { author: 'Tu Phan', git: 'https://github.com/kambria-platform/kambria-wallet' }
    window.kambriaWallet.networkId = this.options.networkId;
    window.kambriaWallet.getPassphrase = (callback) => {
      return this.setState({ passphrase: false, returnPassphrase: null }, () => {
        return this.setState({ passphrase: true, returnPassphrase: callback });
      });
    }
    window.kambriaWallet.getAuthentication = {
      open: (qrcode, callback) => {
        return this.setState({ authetication: false, qrcode: null }, () => {
          return this.setState({ authetication: true, qrcode: qrcode, returnAuthetication: callback });
        });
      },
      close: () => {
        return this.setState({ authetication: false, qrcode: null, returnAuthetication: null });
      },
    }
    window.kambriaWallet.getWaiting = {
      open: () => {
        return this.setState({ waiting: true });
      },
      close: () => {
        return this.setState({ waiting: false });
      }
    }
    window.kambriaWallet.getApproval = (txParams, callback) => {
      return this.setState({ approval: false, txParams: null, returnApproval: null }, () => {
        return this.setState({ approval: true, txParams: txParams, returnApproval: callback });
      });
    }
    window.kambriaWallet.logout = () => {
      this.SM.clearState();
    }
  }

  onProvider = (er, provider) => {
    if (er) return this.done(er, null);
    if (!provider) return this.done(null, null);
    return this.done(null, { provider: provider });
  }

  onClose = () => {
    return this.setState({ ...DEFAULT_STATE }, () => {
      return this.done(null, null);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ ...DEFAULT_STATE }, () => {
        return this.setState({ visible: this.props.visible });
      });
    }
  }

  render() {
    return <Fragment>
      <Ethereum visible={this.state.visible} options={this.options} done={this.onProvider} />
      <InputPassphrase visible={this.state.passphrase} done={this.state.returnPassphrase} />
      <GetAuthentication visible={this.state.authetication} qrcode={this.state.qrcode} done={this.state.returnAuthetication} />
      <GetApproval visible={this.state.approval} txParams={this.state.txParams} done={this.state.returnApproval} />
      <GetWaiting visible={this.state.waiting} />
    </Fragment>
  }
}

export default KambriaWallet;
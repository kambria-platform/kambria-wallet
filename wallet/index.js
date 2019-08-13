import React, { Component, Fragment } from 'react';

import StateMaintainer from './stateMaintainer';
import Modal from './core/modal';
import Ethereum from './ethereum';
import Binance from './binance';
import InputPassphrase from './core/inputPassphrase';
import GetAuthentication from './core/getAuthentication';
import GetApproval from './core/getApproval';
import GetWaiting from './core/getWaiting';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from './static/styles/index.module.css';
var cx = classNames.bind(styles);

// Constants
const DEFAULT_STATE = {
  // Wallet
  visible: false,
  blockchain: null,
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
    binance: 1
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
    window.kambriaWallet.github = () => {
      window.open('https://github.com/kambria-platform/kambria-wallet', '_blank');
    }
    window.kambriaWallet.term = () => {
      window.open('https://github.com/kambria-platform/kambria-wallet/blob/master/LICENSE', '_blank');
    }
    window.kambriaWallet.support = () => {
      window.open('mailto:support@kambria.io', '_blank');
    }
    window.kambriaWallet.getPassphrase = (callback) => {
      this.setState({ passphrase: false, returnPassphrase: null }, () => {
        this.setState({ passphrase: true, returnPassphrase: callback });
      });
    }
    window.kambriaWallet.getAuthentication = {
      open: (qrcode, callback) => {
        this.setState({ authetication: false, qrcode: null }, () => {
          this.setState({ authetication: true, qrcode: qrcode, returnAuthetication: callback });
        });
      },
      close: () => {
        this.setState({ authetication: false, qrcode: null, returnAuthetication: null });
      },
    }
    window.kambriaWallet.getWaiting = {
      open: () => {
        this.setState({ waiting: true });
      },
      close: () => {
        this.setState({ waiting: false });
      }
    }
    window.kambriaWallet.getApproval = (txParams, callback) => {
      this.setState({ approval: false, txParams: null, returnApproval: null }, () => {
        this.setState({ approval: true, txParams: txParams, returnApproval: callback });
      });
    }
    window.kambriaWallet.home = () => {
      this.selectBlockchain();
    }
    window.kambriaWallet.logout = () => {
      this.SM.clearState();
    }
  }

  onEthereum = (er, provider) => {
    if (er) return this.done(er, null);
    if (!provider) return this.done(null, null);
    window.kambriaWallet.blockchain = 'ethereum';
    return this.done(null, { blockchain: 'ethereum', provider: provider });
  }

  onBinance = (er, provider) => {
    if (er) return this.done(er, null);
    if (!provider) return this.done(null, null);
    window.kambriaWallet.blockchain = 'binance';
    return this.done(null, { blockchain: 'binance', provider: provider });
  }

  selectBlockchain = (blockchain) => {
    this.setState({ ...DEFAULT_STATE }, () => {
      if (!blockchain) return this.setState({ visible: true });
      return this.setState({ visible: false, blockchain: blockchain });
    });
  }

  onClose = () => {
    this.setState({ ...DEFAULT_STATE }, () => {
      this.done(null, null);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ ...DEFAULT_STATE }, () => {
        this.setState({ visible: this.props.visible });
      });
    }
  }

  render() {
    return (
      <Fragment className="kambria-wallet">
        <Modal visible={this.state.visible} className={cx("fade", "wallet-modal", "choose-blockchain")} dialogClassName={cx("modal-dialog-centered")}>
          <div className={cx("modal-body")}>
            <button type="button" className={cx("close-button")} onClick={this.onClose} />

            <span className={cx("title", "home", "d-block", "text-center", "mt-4")}>Kambria Wallet</span>
            <p className={cx("subtitle", "d-block", "text-center", "mb-4")}>Connect the Blockchain to fully access features</p>
            <div className={cx("wallets")}>

              <div className={cx("wallet", "ethereum")}>
                <div className={cx("icon")}></div>
                <button className={cx("btn", "btn-gray", "btn-sm")} onClick={() => { this.selectBlockchain('ethereum') }}>Ethereum</button>
              </div>

              <div className={cx("wallet", "binance")}>
                <div className={cx("icon")}></div>
                <button className={cx("btn", "btn-gray", "btn-sm")} onClick={() => { this.selectBlockchain('binance') }}>Binance</button>
              </div>

            </div>

            <span
              className={cx("position-absolute", "d-block", "text-left", "mt-5", "mb-1", "github")}
              style={{ cursor: "pointer" }}
              onClick={window.kambriaWallet.github}
            >GitHub Repository</span>
            <span
              className={cx("position-absolute", "d-block", "text-left", "mt-5", "mb-1", "term")}
              style={{ cursor: "pointer" }}
              onClick={window.kambriaWallet.term}
            >Terms and Conditions</span>
            <span
              className={cx("position-absolute", "d-block", "text-left", "mt-5", "mb-1", "support")}
              style={{ cursor: "pointer" }}
              onClick={window.kambriaWallet.support}
            >Support</span>
            <p
              className={cx("subtitle", "d-block", "text-right", "mt-5", "mb-1", "skip-txt")}
              style={{ cursor: "pointer" }}
            >Or skip to website with limited function</p>
            <button
              className={cx("d-block", "btn", "btn-primary-gray", "btn-sm", "skip-btn", "ml-auto", "my-2")}
              onClick={this.onClose}
            >Skip To Website</button>
          </div>
        </Modal>

        <Ethereum visible={this.state.blockchain === 'ethereum'} options={this.options} done={this.onEthereum} />
        <Binance visible={this.state.blockchain === 'binance'} options={this.options} done={this.onBinance} />

        <InputPassphrase visible={this.state.passphrase} done={this.state.returnPassphrase} />
        <GetAuthentication visible={this.state.authetication} qrcode={this.state.qrcode} done={this.state.returnAuthetication} />
        <GetApproval visible={this.state.approval} txParams={this.state.txParams} done={this.state.returnApproval} />
        <GetWaiting visible={this.state.waiting} />
      </Fragment>
    );
  }
}

export default KambriaWallet;
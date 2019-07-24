import React, { Component, Fragment } from 'react';

import StateMaintainer from './stateMaintainer';
import Modal from './core/modal';
import Ethereum from './ethereum';
import Binance from './binance';
import InputPassphrase from './core/inputPassphrase';
import GetAuthentication from './core/getAuthentication';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from './static/styles/index.module.css';
var cx = classNames.bind(styles);

// Constants
const DEFAULT_STATE = {
  visible: false,
  blockchain: null,
  background: false,
  passphrase: false,
  authetication: false,
  qrcode: null,
}
const DEFAULT_OPT = {
  networkId: {
    ethereum: 1,
    binance: 1
  },
  restrictedNetwork: true,
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
    window.kambriaWallet.getPassphrase = {
      open: (callback) => {
        this.setState({ passphrase: false, returnPassphrase: null }, () => {
          this.setState({ passphrase: true, returnPassphrase: callback });
        });
      },
      close: () => {
        this.setState({ passphrase: false, returnPassphrase: null });
      },
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
      <Fragment>
        <Modal visible={this.state.visible} className={cx("fade", "wallet-modal", "choose-blockchain")} dialogClassName={cx("modal-dialog-centered")}>
          <div className={cx("modal-body")}>
            <button type="button" className={cx("close-button")} onClick={this.onClose} />

            <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ color: "rgb(19, 205, 172)", fontSize: "24px" }}>Choose Blockchain</span>
            <p className={cx("d-block", "text-center", "mb-4")} style={{ color: "rgb(40, 47, 56)", fontSize: "16px", lineHeight: "18px" }}>Choose a wallet to fully access features</p>
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
              className={cx("d-block", "text-right", "mt-5", "mb-1", "skip-txt")}
              style={{ cursor: "pointer" }}
              style={{ color: "rgb(155, 155, 155)", fontSize: "16px", lineHeight: "18px" }}
            >Or skip to website with limited function</p>
            <button
              className={cx("d-block", "mr-0", "btn", "btn-primary-gray", "btn-sm", "skip-btn")}
              style={{ display: "block", margin: "8px auto 0px" }}
              onClick={this.onClose}
            >Skip To Website</button>
          </div>
        </Modal>

        <Ethereum visible={this.state.blockchain === 'ethereum'} options={this.options} done={this.onEthereum} />
        <Binance visible={this.state.blockchain === 'binance'} options={this.options} done={this.onBinance} />

        <InputPassphrase visible={this.state.passphrase} done={(er, re) => this.state.returnPassphrase(er, re)} />
        <GetAuthentication visible={this.state.authetication} qrcode={this.state.qrcode} done={(er, re) => this.state.returnAuthetication(er, re)} />
      </Fragment>
    );
  }
}

export default KambriaWallet;
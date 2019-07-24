import React, { Component } from 'react';

import Modal from '../../../core/modal';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);


class SelectWallet extends Component {
  constructor(props) {
    super(props);

    this.done = props.done;
    this.onClose = props.onClose;
  }

  net = () => {
    let net = parseInt(window.kambriaWallet.networkId.binance);
    let Net = net === 1 ? 'Mainnet' : 'Testnet';
    return <span className={cx("network", "binance", net)}>{Net} Network</span>
  }

  onHardwallet = () => {
    this.done(null, {
      type: 'hardwallet'
    });
  }

  onHybridwallet = () => {
    this.done(null, {
      type: 'hybridwallet'
    });
  }

  onSoftwallet = () => {
    this.done(null, {
      type: 'softwallet',
      wallet: 'binance-sdk'
    });
  }

  render() {
    return (
      <Modal visible={true} className={cx("fade", "wallet-modal", "choose-wallet")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.onClose} />

          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ color: "rgb(19, 205, 172)", fontSize: "24px" }}>Choose Your Wallet</span>
          {this.net()}
          <p className={cx("d-block", "text-center", "mb-4")} style={{ color: "rgb(40, 47, 56)", fontSize: "16px", lineHeight: "18px" }}>Choose a wallet to fully access features</p>
          <div className={cx("wallets")}>

            <div className={cx("wallet", "hardware")}>
              <div className={cx("icon")}></div>
              <button className={cx("btn", "btn-gray", "btn-sm")} onClick={this.onHardwallet}>Hardware Wallet</button>
            </div>

            <div className={cx("wallet", "hybrid")}>
              <div className={cx("icon")}></div>
              <button className={cx("btn", "btn-gray", "btn-sm")} onClick={this.onHybridwallet}>Hybrid Wallet</button>
            </div>

            <div className={cx("wallet", "software")}>
              <div className={cx("icon")}></div>
              <button className={cx("btn", "btn-gray", "btn-sm")} onClick={this.onSoftwallet}>Software Wallet</button>
            </div>

          </div>

          <p
            className={cx("d-block", "text-right", "mt-5", "mb-1", "skip-txt")}
            style={{ cursor: "pointer" }}
            style={{ color: "rgb(155, 155, 155)", fontSize: "16px", lineHeight: "18px" }}
          >Your wallet is not represented here</p>
          <button
            className={cx("d-block", "mr-0", "btn", "btn-primary-gray", "btn-sm", "skip-btn")}
            style={{ display: "block", margin: "8px auto 0px" }}
            onClick={window.kambriaWallet.back}
          >Try it on another Blockchain</button>
        </div>
      </Modal>
    );
  }
}

export default SelectWallet;
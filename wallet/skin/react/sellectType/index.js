import React, { Component } from 'react';

import Modal from '../core/modal';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../static/styles/index.module.css';
var cx = classNames.bind(styles);

var util = require('capsule-core-js/dist/util');


class SellectType extends Component {
  constructor(props) {
    super(props);

    this.done = props.done;
    this.onClose = props.onClose;
  }

  net = () => {
    let net = util.getNetworkId(window.kambriaWallet.networkId, 'string');
    let Net = net.charAt(0).toUpperCase() + net.slice(1)
    return <span className={cx("network", net)}>{Net} Network</span>
  }

  onMetamask = () => {
    this.setState({ visible: false });
    this.done(null, {
      type: 'softwallet',
      wallet: 'metamask',
      model: 'metamask'
    });
  }

  onHardwallet = () => {
    this.setState({ visible: false });
    this.done(null, {
      type: 'hardwallet'
    });
  }

  onHybridwallet = () => {
    this.setState({ visible: false });
    this.done(null, {
      type: 'hybridwallet'
    });
  }

  onSoftwallet = () => {
    this.setState({ visible: false });
    this.done(null, {
      type: 'softwallet',
      wallet: 'isoxys'
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
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

            <div className={cx("wallet", "metamask")}>
              <div className={cx("icon")}></div>
              <button className={cx("btn", "btn-gray", "btn-sm")} onClick={this.onMetamask}>Metamask</button>
            </div>

            <div className={cx("vl")} style={{ left: "202px" }}></div>
            <div className={cx("wallet", "hardware")}>
              <div className={cx("icon")}></div>
              <button className={cx("btn", "btn-gray", "btn-sm")} onClick={this.onHardwallet}>Hardware Wallet</button>
            </div>

            <div className={cx("vl")} style={{ left: "394px" }}></div>
            <div className={cx("wallet", "hybrid")}>
              <div className={cx("icon")}></div>
              <button className={cx("btn", "btn-gray", "btn-sm")} onClick={this.onHybridwallet}>Hybrid Wallet</button>
            </div>

            <div className={cx("vl")} style={{ left: "586px" }}></div>
            <div className={cx("wallet", "software")}>
              <div className={cx("icon")}></div>
              <button className={cx("btn", "btn-gray", "btn-sm")} onClick={this.onSoftwallet}>Software Wallet</button>
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
    );
  }
}

export default SellectType;
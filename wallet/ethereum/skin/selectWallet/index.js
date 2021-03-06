import React, { Component } from 'react';

import Modal from '../../../core/modal';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
const cx = classNames.bind(styles);

const util = require('capsule-core-js/dist/util');


class SelectWallet extends Component {
  constructor(props) {
    super(props);

    this.done = props.done;
    this.onClose = props.onClose;
  }

  net = () => {
    let net = util.getNetworkId(window.kambriaWallet.networkId.ethereum, 'string');
    let Net = net.charAt(0).toUpperCase() + net.slice(1)
    return <span className={cx("network", "ethereum")}>{Net} Network</span>
  }

  onMetamask = () => {
    this.done(null, {
      type: 'softwallet',
      wallet: 'metamask',
      model: 'metamask'
    });
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
      wallet: 'isoxys'
    });
  }

  render() {
    return <Modal visible={true} className={cx("fade", "wallet-modal", "choose-wallet")} dialogClassName={cx("modal-dialog-centered")}>
      <div className={cx("modal-body")}>
        <button type="button" className={cx("close-button")} onClick={this.onClose} />

        <span className={cx("title", "d-block", "text-center", "my-4")}>Choose Your Wallet</span>
        {this.net()}
        <div className={cx("wallets")}>

          <div className={cx("wallet", "metamask")}>
            <div className={cx("icon")}></div>
            <button className={cx("btn", "btn-gray", "btn-sm")} onClick={this.onMetamask}>Metamask</button>
          </div>

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
      </div>
    </Modal>
  }
}

export default SelectWallet;
import React, { Component } from 'react';

import Modal from '../../../core/modal';
import LedgerNanoSAsset from './ledgerNanoS';
import TrezorOneAsset from './trezorOne';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const MENU = [
  { key: 'ledger-nano-s', label: 'Ledger' },
  { key: 'trezor-one', label: 'Trezor' },
];


class ConnectDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      model: 'ledger-nano-s'
    }

    this.done = props.done;
    this.onClose = props.onClose;
  }

  onSelect = (key) => {
    if (key === 'back') return window.kambriaWallet.back();
    return this.setState({ model: key });
  }

  onConnect = (data) => {
    this.done(null, data);
  }

  menu = () => {
    return <ul className={cx("nav", "nav-tabs")}>
      {
        MENU.map(item => {
          return <li key={item.key} className={cx("nav-item")}>
            <span
              className={cx("nav-link", { "active": this.state.model === item.key })}
              style={{ cursor: "pointer", padding: "0.5rem" }}
              onClick={() => { this.onSelect(item.key) }}
            >{item.label}</span>
          </li>
        })
      }
    </ul>
  }

  device = () => {
    if (this.state.model === 'ledger-nano-s') return <LedgerNanoSAsset done={this.onConnect} />
    if (this.state.model === 'trezor-one') return <TrezorOneAsset done={this.onConnect} />
  }

  render() {
    return (
      <Modal visible={true} className={cx("fade", "wallet-modal", "hardware-wallet")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.onClose}></button>

          <span className={cx("title", "d-block", "text-center", "mt-4")}>Hardware Wallet</span>
          <span
            className={cx("position-absolute")}
            style={{ cursor: "pointer", color: "black", top: "12px", left: "12px" }}
            onClick={window.kambriaWallet.back}><i className={cx("fas", "fa-arrow-left")}></i> Back</span>
          <p className={cx("subtitle", "d-block", "text-center", "mb-4", "success")}>This is a recommended way to access your wallet.</p>
          {this.menu()}
          <div className={cx("tab-content")}>
            {this.device()}
          </div>

        </div>
      </Modal >
    );
  }
}

export default ConnectDevice;
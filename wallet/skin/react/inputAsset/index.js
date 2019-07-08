import React, { Component } from 'react';

import Modal from '../core/modal';
import MnemonicAsset from './mnemonic';
import KeystoreAsset from './keystore';
import PrivateKeyAsset from './privateKey';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const MENU = [
  { key: 'mnemonic', label: 'Seed' },
  { key: 'keystore', label: 'Keystore' },
  { key: 'private-key', label: 'Private Key' },
];


class InputAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      model: 'mnemonic'
    }

    this.done = props.done;
    this.onClose = props.onClose;
  }

  onSelect = (key) => {
    return this.setState({ model: key });
  }

  onReceive = (data) => {
    this.done(null, data);
  }

  menu = () => {
    return <ul className={cx("nav", "nav-tabs")}>
      {
        MENU.map(item => {
          return <li key={item.key} className={cx("nav-item")}>
            <span
              className={cx("nav-link", { "active": this.state.model === item.key })}
              style={{ cursor: "pointer" }}
              onClick={() => { this.onSelect(item.key) }}
            >{item.label}</span>
          </li>
        })
      }
    </ul>
  }

  asset = () => {
    if (this.state.model === 'mnemonic') return <MnemonicAsset done={this.onReceive} />
    if (this.state.model === 'keystore') return <KeystoreAsset done={this.onReceive} />
    if (this.state.model === 'private-key') return <PrivateKeyAsset done={this.onReceive} />
  }

  render() {
    return (
      <Modal visible={true} className={cx("fade", "wallet-modal", "software-wallet")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.onClose}></button>

          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ color: "black", fontSize: "24px" }}>Software Wallet</span>
          <span
            className={cx("position-absolute")}
            style={{ cursor: "pointer", color: "black", top: "12px", left: "12px" }}
            onClick={window.kambriaWallet.back}><i className={cx("fas", "fa-arrow-left")}></i> Back</span>
          <p className={cx("d-block", "text-center", "mb-4", "text-danger")} style={{ fontSize: "16px", lineHeight: "18px" }}>This is not recommended way to access your wallet.</p>
          {this.menu()}
          <div className={cx("tab-content")}>
            {this.asset()}
          </div>

        </div>
      </Modal >
    );
  }
}

export default InputAsset;
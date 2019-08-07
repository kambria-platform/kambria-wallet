import React, { Component } from 'react';
var { Ledger } = require('binance-core-js');

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const STATUS = {
  INIT: 'Please connect your wallet and click the button!',
  TEST: 'Waiting for the connection...',
  FAIL: 'Cannot connect your wallet!'
}


class LedgerNanoSAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT,
      loading: false
    }

    this.done = props.done;
  }

  checkTheConnection = () => {
    this.setState({ message: STATUS.TEST, loading: true }, () => {
      // Fetch the first address to know whether devide connectedoptions
      let options = {
        getApproval: window.kambriaWallet.getApproval,
        getWaiting: window.kambriaWallet.getWaiting
      }
      let ledger = new Ledger(window.kambriaWallet.networkId.binance, options);
      ledger.getAccountsByLedgerNanoS("m/44'/714'/0'/0", 1, 0, (er, re) => {
        if (er || re.lenght <= 0) return this.setState({ message: STATUS.FAIL, loading: false });
        return this.done({ wallet: 'ledger', model: 'ledger-nano-s' });
      });
    });
  }

  render() {
    return (
      <div className={cx("tab-pane", "fade", "show", "active")}>
        <p
          className={cx("d-block", "text-center", "mt-5", "mb-3", { "text-danger": this.state.message === STATUS.FAIL })}
          style={{ fontSize: "16px", lineHeight: "18px" }}
        >{this.state.message}</p>
        <button
          className={cx("btn", "btn-sm", "btn-primary", "d-block", "text-center", "mx-auto", "mb-5")}
          onClick={this.checkTheConnection}>Connect</button>
      </div>
    )
  }
}

export default LedgerNanoSAsset;
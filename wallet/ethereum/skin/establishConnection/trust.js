import React, { Component } from 'react';

var { Trust } = require('capsule-core-js');

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const STATUS = {
  INIT: 'Please using Trust Wallet application on your phone to scan and establish the connection!',
  TEST: 'Waiting for the connection...',
  FAIL: 'Cannot connect the devide!'
}


class TrustAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT,
    }

    this.done = props.done;
  }

  establishTheConnection = () => {
    let options = {
      getApproval: window.kambriaWallet.getApproval,
      getAuthentication: window.kambriaWallet.getAuthentication
    }
    this.trust = new Trust(window.kambriaWallet.networkId.ethereum, options);
    this.trust.setAccountByTrustWallet((er, re) => {
      if (er) return this.setState({ message: STATUS.FAIL });
      return this.done({ wallet: 'trust', model: 'trust-wallet', provider: this.trust });
    });
  }

  render() {
    return (
      <div className={cx("tab-pane", "fade", "show", "active")}>
        <p
          className={cx("d-block", "text-center", "mt-5", "mb-3")}
          style={{ fontSize: "16px", lineHeight: "18px" }}
        >{this.state.message}</p>
        <button
          className={cx("btn", "btn-sm", "btn-primary", "d-block", "text-center", "mx-auto", "mb-5")}
          onClick={this.establishTheConnection}>Connect</button>
      </div>
    );
  }
}

export default TrustAsset;
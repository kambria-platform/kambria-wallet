import React, { Component } from 'react';
import Helper from './helper';

import Modal from '../../../core/modal';
import PageLoader from '../../../core/PageLoader';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const ERROR = 'Cannot load addresses';
const LIMIT = 5, PAGE = 0;
const DEFAULT_HD_PATH = "m/44'/714'/0'/0";

const DEFAULT_STATE = {
  addressList: [],
  i: 0,
  dpath: DEFAULT_HD_PATH,
  limit: LIMIT,
  page: PAGE,
  loading: false,
  error: null,
}


class ConfirmAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.done = props.done;
    this.onClose = props.onClose;
  }

  getAddress = (data, limit, page, callback) => {
    let _callback = (er, addresses) => {
      if (er) return callback(er, null);
      let re = [];
      for (let i = 0; i < addresses.length; i++) {
        let address = addresses[i];
        re[i] = { address: address };
        Helper.getBalance(address).then(balance => {
          re[i].balance = balance;
          return callback(null, re);
        }).catch(er => {
          re[i].balance = 0;
          return callback(null, re);
        });
      }
    }

    if (data.wallet === 'binance-sdk') {
      Helper.getAddressByBinanceSDK(data, this.state.dpath, limit, page).then(re => {
        return _callback(null, re);
      }).catch(er => {
        if (er) return _callback(ERROR, null);
      });
    }
    else if (data.wallet === 'ledger') {
      Helper.getAddressByLedger(data, this.state.dpath, limit, page).then(re => {
        return _callback(null, re);
      }).catch(er => {
        if (er) return _callback(ERROR, null);
      });
    }
    else {
      return _callback(ERROR, null);
    }
  }

  /**
   * UI controllers
   */

  onConfirm = () => {
    let index = this.state.i + this.state.limit * this.state.page;
    this.done(null, { dpath: this.state.dpath, index: index });
    this.setState({ ...DEFAULT_STATE });
  }

  onSelect = (index) => {
    this.setState({ i: index });
  }

  onDpath = (e) => {
    this.setState({ dpath: e.target.value }, () => {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({ loading: true }, () => {
          this.getAddress(this.props.data, this.state.limit, this.state.page, (er, re) => {
            if (er) return this.setState({ loading: false, error: er });
            return this.setState({ loading: false, addressList: re, error: null });
          });
        });
      }, 1000);
    });
  }

  onPage = (step) => {
    let page = this.state.page + step;
    if (page < 0) page = 0;
    if (page == this.state.page) return;

    this.setState({ loading: true }, () => {
      this.getAddress(this.props.data, this.state.limit, page, (er, re) => {
        if (er) return this.setState({ loading: false, error: er });
        return this.setState({ loading: false, page: page, addressList: re, error: null });
      });
    });
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      this.getAddress(this.props.data, this.state.limit, this.state.page, (er, re) => {
        if (er) return this.setState({ loading: false, error: er });
        return this.setState({ loading: false, addressList: re, error: null });
      });
    });
  }

  // UI conventions
  showAddresses = (defaultIndex, addressList) => {
    return addressList.map((item, index) => {
      return (
        <label
          key={item.address}
          className={cx("radio-wrapper")}
          onChange={() => this.onSelect(index)}>
          {item.address} <br /> {item.balance} BNB
          <input type="radio" name="address" value={item.address} checked={index === defaultIndex} readOnly />
          <span className={cx("checkmark")}></span>
        </label>
      );
    });
  }

  render() {
    return (
      <Modal visible={true} className={cx("fade", "wallet-modal", "choose-wallet-address")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.onClose} />

          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ color: "rgb(19, 205, 172)", fontSize: "24px" }}>Choose Your Wallet Address</span>
          <span
            className={cx("position-absolute")}
            style={{ cursor: "pointer", color: "black", top: "12px", left: "12px" }}
            onClick={window.kambriaWallet.back}><i className={cx("fas", "fa-arrow-left")}></i> Back</span>
          <input
            className={cx("form-control", "mb-4")}
            type="text"
            value={this.state.dpath}
            onChange={this.onDpath} />
          {this.state.loading ? <PageLoader type="bar" /> : null}
          <div className={cx("addresses")}>
            {this.showAddresses(this.state.i, this.state.addressList)}
          </div>
          <button
            className={cx("d-inline", "text-left", "mr-1", "btn", "btn-primary-gray", "btn-sm")}
            onClick={() => { this.onPage(-1) }}>{"<"}</button>
          <button
            className={cx("d-inline", "text-left", "mr-1", "btn", "btn-primary-gray", "btn-sm")}
          >{this.state.page + 1}</button>
          <button
            className={cx("d-inline", "text-left", "mr-1", "btn", "btn-primary-gray", "btn-sm")}
            onClick={() => { this.onPage(1) }}>{">"}</button>
          <button
            className={cx("d-inline", "text-left", "float-right", "btn", "btn-primary", "btn-sm")}
            onClick={this.onConfirm}
          >OK</button>
        </div>
      </Modal>
    );
  }
}

export default ConfirmAddress;
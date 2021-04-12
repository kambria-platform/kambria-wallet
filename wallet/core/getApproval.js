import React, { Component } from 'react';
import Modal from './modal';
import { unit, net } from '@kambria/kambria-util';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../static/styles/index.module.css';
var cx = classNames.bind(styles);

const DEFAULT_STATE = {
  data: []
}


class GetApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      txParams: props.txParams
    }
  }

  formalizeTxParams = (txParams) => {
    if (!txParams) return this.setState({ ...DEFAULT_STATE });

    let data = [];
    let from = txParams.from;
    let to = '';
    let coin = 'ETH';
    let amount = txParams.value ? unit.wei2ETH(txParams.value) : 0;
    let tokens = [];
    if (!txParams.data) to = txParams.to;
    else {
      let raw = net.parseKambriaTransaction(txParams);
      if (raw) {
        to = raw.to;
        tokens = [{ token: 'KAT', amount: unit.wkat2KAT(raw.amount) }]
      }
    }
    data.push({ from, to, coin, amount, tokens });
    return this.setState({ data: data });
  }

  onClose = () => {
    this.setState({ visible: false, txParams: null }, () => {
      this.props.done(null, false);
    });
  }

  onApprove = () => {
    this.setState({ visible: false, txParams: null }, () => {
      this.props.done(null, true);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
    if (this.props.txParams !== prevProps.txParams) {
      this.formalizeTxParams(this.props.txParams);
    }
  }

  renderSingleTx = (tx) => {
    return <div key={Math.random().toString()} className={cx("tab-content", "mb-4")}>
      <div className={cx("form-group")}>
        <label htmlFor="from">Source Address</label>
        <input className={cx("form-control")} type="text" value={tx.from} disabled />
      </div>
      <div className={cx("form-group")}>
        <label htmlFor="from">Destination Address</label>
        <input className={cx("form-control")} type="text" value={tx.to} disabled />
      </div>
      <div className={cx("form-group")}>
        <label htmlFor="from">Amount of {tx.coin}</label>
        <input className={cx("form-control")} type="text" value={tx.amount} disabled />
      </div>
      {tx.tokens.map(item => <div key={item.token} className={cx("form-group")}>
        <label htmlFor="from">Amount of {item.token}</label>
        <input className={cx("form-control")} type="text" value={item.amount} disabled />
      </div>)}
    </div>
  }

  renderMultiTxs = () => {
    let { data } = this.state;
    if (!data || data.length <= 0) return null;
    let visual = [];
    for (let tx of data) {
      visual.push(this.renderSingleTx(tx))
    }
    return visual;
  }

  render() {
    return (
      <Modal visible={this.state.visible} className={cx("fade", "wallet-modal", "software-wallet")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.onClose}></button>

          <span className={cx("title", "d-block", "text-center", "mt-4")}>Transaction Approval</span>
          {this.renderMultiTxs()}
          <div className={cx("form-inline")}>
            <div className={cx("form-group", "ml-auto")}>
              <button
                className={cx("btn", "btn-sm", "btn-primary-gray", "ml-1", "text-center")}
                onClick={this.onClose}>Cancel</button>
              <button
                className={cx("btn", "btn-sm", "btn-primary", "ml-1", "text-center")}
                onClick={this.onApprove}>OK</button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default GetApproval;
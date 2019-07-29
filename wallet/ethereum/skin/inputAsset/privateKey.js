import React, { Component } from 'react';
var { Isoxys } = require('capsule-core-js');

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const DEFAULT_STATE = {
  privateKey: '',
  error: null,
  loading: false
}


class PrivateKeyAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.done = props.done;
  }

  handleChange = (e) => {
    this.setState({ privateKey: e.target.value, error: null });
  }

  handleSubmit = () => {
    this.checkPrivatekey(ok => {
      if (!ok) return this.setState({ error: 'Invalid private key!' });

      this.returnDataToParent();
    });
  }

  checkPrivatekey = (callback) => {
    this.setState({ loading: true }, () => {
      // Fetch the first address to know whether good file
      let isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, 'softwallet', true);
      isoxys.getAccountByPrivatekey(this.state.privateKey, (er, re) => {
        this.setState({ loading: false });
        if (er || re.lenght <= 0) return callback(false);
        return callback(true);
      });
    });
  }

  returnDataToParent = () => {
    return this.done({
      model: 'private-key',
      asset: {
        privateKey: this.state.privateKey
      }
    });
  }

  componentWillUnmount() {
    // Clear history
    this.setState({ ...DEFAULT_STATE });
  }

  render() {
    return (
      <div className={cx("tab-pane", "fade", "show", "active")}>
        <div className={cx("form-group")}>
          <label htmlFor="enter-private-key">Enter Private Key</label>
          <input
            className={cx("form-control")}
            type="text"
            autoComplete="off"
            id="enter-private-key"
            placeholder="Private Key"
            value={this.state.privateKey}
            onChange={this.handleChange} />
        </div>
        <div className={cx("form-group")}>
          <p className={cx("text-danger")}>{this.state.error}</p>
        </div>
        <div className={cx("form-group")}>
          <button className={cx("btn", "btn-sm", "btn-primary", "d-block", "text-left")} onClick={this.handleSubmit}>OK</button>
        </div>
      </div>
    );
  }
}

export default PrivateKeyAsset;

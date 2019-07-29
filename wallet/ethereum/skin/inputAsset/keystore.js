import React, { Component } from 'react';
var { Isoxys } = require('capsule-core-js');

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const DEFAULT_STATE = {
  filename: '',
  keystore: null,
  password: '',
  error: null,
  loading: false
}


class KeystoreAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.done = props.done;
  }

  onBrowseFile = (e) => {
    document.getElementById('keystore-file').click();
  }

  handleChangeFile = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      this.setState({ filename: file.name, keystore: JSON.parse(reader.result), error: null });
    }
  }

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value, error: null });
  }

  handleSubmit = () => {
    this.checkKeystore(ok => {
      if (!ok) return this.setState({ error: 'Invalid password!' });

      this.returnDataToParent();
    });
  }

  checkKeystore = (callback) => {
    this.setState({ loading: true }, () => {
      // Fetch the first address to know whether good file
      let isoxys = new Isoxys(window.kambriaWallet.networkId.ethereum, 'softwallet', true);
      isoxys.getAccountByKeystore(this.state.keystore, this.state.password, (er, re) => {
        this.setState({ loading: false });
        if (er || re.lenght <= 0) return callback(false);
        return callback(true);
      });
    });
  }

  returnDataToParent = () => {
    this.done({
      model: 'keystore',
      asset: {
        keystore: this.state.keystore,
        password: this.state.password
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
          <label htmlFor="upload-keystore">Upload Keystore</label>
          <div className={cx("form-inline")}>
            <input id="keystore-file" type="file" accept="application/json" onChange={this.handleChangeFile} style={{ "display": "none" }} />
            <input className={cx("form-control", "col-8", "mr-4")} type="text" id="upload-keystore" value={this.state.filename} disabled />
            <button
              className={cx("btn", "btn-sm", "btn-primary-gray", "text-right", "col-3")}
              onClick={this.onBrowseFile}>Browse</button>
          </div>
        </div>
        <div className={cx("form-group")}>
          <label htmlFor="enter-password-key">Enter Password</label>
          <input
            className={cx("form-control")}
            type="password"
            id="enter-password-key"
            placeholder="Password"
            onChange={this.handleChangePassword} />
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

export default KeystoreAsset;
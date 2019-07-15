import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const DEFAULT_STATE = {
  mnemonic: '',
  password: ''
}


class MnemonicAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.done = props.done;
  }

  handleChangeMnemonic = (e) => {
    this.setState({ mnemonic: e.target.value });
  }

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  handleSubmit = () => {
    this.returnData2Parent();
  }

  returnData2Parent = () => {
    return this.done({
      model: 'mnemonic',
      asset: {
        mnemonic: this.state.mnemonic,
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
          <label htmlFor="enter-seed">Enter seed</label>
          <input
            className={cx("form-control")}
            type="text"
            autoComplete="off"
            id="enter-seed"
            placeholder="Seed"
            value={this.state.mnemonic}
            onChange={this.handleChangeMnemonic} />
        </div>
        <div className={cx("form-group")}>
          <label htmlFor="enter-password">Enter password (Optional)</label>
          <input
            className={cx("form-control")}
            type="password"
            id="enter-password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChangePassword} />
        </div>
        <div className={cx("form-group")}>
          <button
            className={cx("btn", "btn-sm", "btn-primary", "d-block", "text-left")}
            onClick={this.handleSubmit}>OK</button>
        </div>
      </div>
    );
  }
}

export default MnemonicAsset;
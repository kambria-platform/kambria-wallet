import React, { Component } from 'react';
import Modal from './modal';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../static/styles/index.module.css';
var cx = classNames.bind(styles);

const DEFAULT_STATE = {
  passphrase: ''
}
const ERROR = 'Used denied to enter passpharse';


class InputPassphrase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      ...DEFAULT_STATE
    }
  }

  onClose = () => {
    this.setState({ visible: false }, () => {
      this.props.done(ERROR, null);
    });
  }

  handleSubmit = () => {
    this.setState({ visible: false }, () => {
      if (!this.state.passphrase) return this.props.done(ERROR, null);
      return this.props.done(null, this.state.passphrase);
    });
  }

  onChange = (e) => {
    this.setState({ passphrase: e.target.value });
  }

  componentWillUnmount() {
    // Clear history
    this.setState({ ...DEFAULT_STATE });
  }

  componentDidMount() {
    // Listen Enter button
    let input = document.getElementById('inputPassphrase');
    if (input) input.addEventListener('keyup', e => {
      if (e.keyCode === 13) this.handleSubmit();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({
        visible: this.props.visible,
        ...DEFAULT_STATE
      }, () => {
        // Autofocus
        setTimeout(() => {
          if (this.passpharseName) this.passpharseName.focus();
        }, 1);
      });
    }
  }

  render() {
    return (
      <Modal visible={this.state.visible} className={cx("fade", "wallet-modal", "enter-passphrase")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={() => { this.onClose() }}></button>

          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ color: "black", fontSize: "24px" }}>Input Your Passphrase</span>
          <div className={cx("form-inline")}>
            <label htmlFor="passphrase">Passphrase</label>
            <div className={cx("form-group")}>
              <input
                type="password"
                id="passphrase"
                className={cx("form-control", "col-12", "col-xl-8", "col-lg-8", "col-md-8", "col-sm-12", "mr-4", "ml-0")}
                value={this.state.passphrase}
                onChange={this.onChange}
                ref={(name) => { this.passpharseName = name; }}
              />
              <button
                className={cx("btn", "btn-primary", "btn-sm", "col-3")}
                onClick={this.handleSubmit}
              >OK</button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default InputPassphrase;
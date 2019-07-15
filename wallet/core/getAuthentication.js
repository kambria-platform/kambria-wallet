import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import Modal from './modal';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../static/styles/index.module.css';
var cx = classNames.bind(styles);

const ERROR = 'User denied to autheticate';


class getAuthentication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      qrcode: this.props.qrcode
    }

    this.done = props.done;
  }

  onClose = () => {
    this.setState({ visible: false, qrcode: null }, () => {
      this.done(ERROR, null);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      this.setState({
        visible: this.props.visible,
        qrcode: this.props.qrcode,
      });
    }
  }

  render() {
    return (
      <Modal visible={this.state.visible} className={cx("fade", "wallet-modal", "enter-passphrase")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={() => { this.onClose() }}></button>

          <span className={cx("title", "d-block", "text-center", "mt-4")} style={{ color: "black", fontSize: "24px" }}>Authentication</span>
          <p className={cx("d-block", "text-center", "mb-4")} style={{ color: "#97a4ad", fontSize: "16px", lineHeight: "18px" }}>Please using MyEtherWallet application on your phone to scan and establish the connection!</p>
          <div className={cx("qr-code", "mx-auto", "my-5")}>
            {this.state.qrcode ? <QRCode size={200} value={this.state.qrcode} /> : null}
          </div>
        </div>
      </Modal >
    );
  }
}

export default getAuthentication;
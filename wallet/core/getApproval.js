import React, { Component } from 'react';
import Modal from './modal';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../static/styles/index.module.css';
var cx = classNames.bind(styles);


class GetApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      txParams: props.txParams
    }
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
      this.setState({
        visible: this.props.visible,
        txParams: this.props.txParams,
      });
    }
  }

  render() {
    return (
      <Modal visible={this.state.visible} className={cx("fade", "wallet-modal", "enter-passphrase")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.onClose}></button>

          <span className={cx("title", "d-block", "text-center", "mt-4")}>Transaction Approval</span>
          <p className={cx("d-block", "text-center", "mb-4")}>{JSON.stringify(this.state.txParams)}</p>
          <button
            className={cx("d-inline", "btn", "btn-sm", "btn-primary", "ml-1", "float-right", "text-center")}
            onClick={this.onApprove}>OK</button>
          <button
            className={cx("d-inline", "btn", "btn-sm", "btn-primary-gray", "ml-1", "float-right", "text-center")}
            onClick={this.onClose}>Cancel</button>
        </div>
      </Modal>
    );
  }
}

export default GetApproval;
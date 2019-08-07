import React, { Component } from 'react';
import PageLoader from './PageLoader';
import Modal from './modal';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../static/styles/index.module.css';
var cx = classNames.bind(styles);


class GetWaiting extends Component {

  render() {
    return (
      <Modal visible={this.props.visible} className={cx("fade", "wallet-modal", "enter-passphrase")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <span className={cx("title", "d-block", "text-center", "mt-4")}>Waiting for transaction</span>
          <p className={cx("subtitle", "d-block", "text-center", "mb-4")}>Please follow the instructions on your devide!</p>
          <PageLoader type="bar" />
        </div>
      </Modal>
    );
  }
}

export default GetWaiting;
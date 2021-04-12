import React, { Component } from 'react';
import Modal from './modal';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../static/styles/index.module.css';
var cx = classNames.bind(styles);


class ErrorForm extends Component {

  render() {
    return (
      <Modal visible={true} className={cx("fade", "wallet-modal", "enter-passphrase")} dialogClassName={cx("modal-dialog-centered")}>
        <div className={cx("modal-body")}>
          <button type="button" className={cx("close-button")} onClick={this.props.done}></button>

          <span className={cx("title", "d-block", "text-center", "mt-4")}>An error has occurred</span>
          <p className={cx("subtitle", "d-block", "text-center", "mb-4")}>{String(this.props.error)}</p>
          <button
            className={cx("btn", "btn-sm", "btn-primary", "d-block", "text-center", "mx-auto")}
            onClick={this.props.done}>OK</button>
        </div>
      </Modal>
    );
  }
}

export default ErrorForm;
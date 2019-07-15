import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import styles from '../../../static/styles/index.module.css';
var cx = classNames.bind(styles);

const STATUS = {
  INIT: 'Please using MyEtherWallet application on your phone to scan and establish the connection!',
  TEST: 'Waiting for the connection...',
  FAIL: 'Cannot connect the devide!'
}


class MarrellaAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT,
    }
  }

  establishTheConnection = () => {
    // Do nothing
  }

  render() {
    return (
      <div className={cx("tab-pane", "fade", "show", "active")}>
        <p
          className={cx("d-block", "text-center", "mt-5", "mb-3")}
          style={{ fontSize: "16px", lineHeight: "18px" }}
        >
          Woohoo! You found out the 🎁. This is Marrella wallet.<br />
          Marrella is powered by Kambria and we are bringing it to you, very soon.
        </p>
        {/* <p
          className={cx("d-block", "text-center", "mt-5", "mb-3")}
          style={{ fontSize: "16px", lineHeight: "18px" }}
        >{this.state.message}</p> */}
        <button
          className={cx("btn", "btn-sm", "btn-primary", "d-block", "text-center", "mx-auto", "mb-5")}
          onClick={this.establishTheConnection}>Connect</button>
      </div>
    );
  }
}

export default MarrellaAsset;
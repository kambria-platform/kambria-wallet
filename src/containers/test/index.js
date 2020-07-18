import React, { Component } from 'react';
import Wallet from '@kambria/kambria-wallet';

import config from '../config';
import Ethereum from './ethereum';
import Binance from './binance';

const DEFAULT_STATE = {
  visible: false,
  blockchain: null
}

class Test extends Component {
  constructor() {
    super();

    this.state = { ...DEFAULT_STATE };

    // Test params here
    this.options = {
      networkId: {
        ethereum: config.ethereum.id,
        binance: config.binance.id
      },
      pageRefreshing: true
    };
  }

  register = () => {
    return this.setState({ visible: false }, () => {
      return this.setState({ visible: true });
    });
  }

  logout = () => {
    return this.setState({ ...DEFAULT_STATE }, () => {
      return window.kambriaWallet.logout();
    });
  }

  done = (er, re) => {
    if (er) return console.error(er);
    if (!re) return console.error('Use skip the registration');
    return this.setState({ blockchain: re.blockchain });
  }

  componentWillUnmount() {
    if (this.watcher) return this.watcher.stopWatching();
  }

  render() {
    return <div>
      <h1>Wallet testing</h1>
      <h2>Blockchain: {this.state.blockchain}</h2>
      {this.state.blockchain ? <button onClick={this.logout}>Logout</button> : <button onClick={this.register}>Register</button>}
      {this.state.blockchain === 'ethereum' ? <Ethereum /> : null}
      {this.state.blockchain === 'binance' ? <Binance /> : null}
      <Wallet visible={this.state.visible} options={this.options} done={this.done} />
    </div>
  }
}

export default Test;
import React, { Component } from 'react';
import Wallet from '@kambria/kambria-wallet';


const NET = {
  MAINNET: {
    id: 1,
    explorer: ''
  },
  TESTNET: {
    id: 2,
    explorer: 'testnet-'
  },
}

const DEFAULT_STATE = {
  visible: false,
  network: null,
  account: null,
  balance: null,
  txId: null
}

class TestBinance extends Component {
  constructor() {
    super();

    this.state = { ...DEFAULT_STATE };

    // Test params here
    this.net = 'TESTNET';
    this.options = {
      networkId: NET[this.net].id,
      restrictedNetwork: true,
      pageRefreshing: true
    };
  }

  register = () => {
    this.setState({ visible: false }, () => {
      this.setState({ visible: true });
    });
  }

  logout = () => {
    window.kambriaWallet.logout();
  }

  done = (er, provider) => {
    if (er) return console.error(er);
    if (!provider) return console.error('Use skip the registration');

    this.watcher = window.kambriaWallet.provider.watch((er, re) => {
      if (er) return console.error(er);
      return this.setState(re);
    });
  }

  sendTx = () => {
    window.kambriaWallet.provider.client.transfer(
      this.state.account,
      this.state.account,
      1, 'BNB'
    ).then(re => {
      return this.setState({ txId: re.result[0].hash.toString(), error: null });
    }).catch(er => {
      console.error(er);
    });
  }

  componentWillUnmount() {
    if (this.watcher) this.watcher.stopWatching();
  }

  render() {
    return (
      <div>
        <h1>Binance wallet testing</h1>
        <button onClick={this.register}>Register</button>

        <div>
          <p>Network: {this.state.network}</p>
          <p>Account: {this.state.account}</p>
          <p>Balance: {this.state.balance}</p>
          <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={`https://${NET[this.net].explorer}explorer.binance.org/tx/${this.state.txId}`}>{this.state.txId}</a></p>
          <button onClick={this.sendTx}>Send Tx</button>
          <button onClick={this.logout}>Logout</button>
          {this.state.error ? <p>{this.state.error}</p> : null}
        </div>
        <Wallet
          visible={this.state.visible}
          options={this.options}
          done={this.done} />
      </div>
    );
  }
}

export default TestBinance;
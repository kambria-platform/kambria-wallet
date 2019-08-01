import React, { Component } from 'react';

import config from '../config';

const DEFAULT_STATE = {
  network: null,
  account: null,
  balance: null,
  txId: null
}

class Binance extends Component {
  constructor() {
    super();

    this.state = { ...DEFAULT_STATE };
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

  sendMultiTx = () => {
    window.kambriaWallet.provider.client.multiSend(
      this.state.account,
      [
        {
          to: this.state.account,
          coins: [{ denom: 'BNB', amount: 1 }, { denom: 'KATT1-C26', amount: 2 }]
        },
        {
          to: this.state.account,
          coins: [{ denom: 'BNB', amount: 3 }, { denom: 'KATT1-C26', amount: 4 }]
        }
      ]
    ).then(re => {
      return this.setState({ txId: re.result[0].hash.toString(), error: null });
    }).catch(er => {
      console.error(er);
    });
  }

  componentDidMount() {
    this.watcher = window.kambriaWallet.provider.watch((er, re) => {
      if (er) return console.error(er);
      return this.setState(re);
    });
  }

  componentWillUnmount() {
    if (this.watcher) this.watcher.stopWatching();
  }

  render() {
    return (
      <div>
        <p>Network: {this.state.network}</p>
        <p>Account: {this.state.account}</p>
        <p>Balance: {this.state.balance} BNB</p>
        <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={`https://${config.binance.explorer}explorer.binance.org/tx/${this.state.txId}`}>{this.state.txId}</a></p>
        <button onClick={this.sendTx}>Send Tx</button>
        <button onClick={this.sendMultiTx}>Send Multi Tx</button>
        {this.state.error ? <p>{this.state.error}</p> : null}
      </div>
    );
  }
}

export default Binance;
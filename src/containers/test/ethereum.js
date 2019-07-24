import React, { Component } from 'react';

import config from '../config';

const DEFAULT_STATE = {
  network: null,
  account: null,
  balance: null,
  txId: null
}

class Ethereum extends Component {
  constructor() {
    super();

    this.state = { ...DEFAULT_STATE };
  }

  sendTx = () => {
    window.kambriaWallet.provider.web3.eth.sendTransaction({
      from: this.state.account,
      to: this.state.account,
      value: '1000000000000000',
    }, (er, txId) => {
      if (er) return console.error(er);
      return this.setState({ txId: txId.toString(), error: null });
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
        <p>Balance: {this.state.balance}</p>
        <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={`https://${config.ethereum.explorer}etherscan.io/tx/${this.state.txId}`}>{this.state.txId}</a></p>
        <button onClick={this.sendTx}>Send Tx</button>
        {this.state.error ? <p>{this.state.error}</p> : null}
      </div>
    );
  }
}

export default Ethereum;
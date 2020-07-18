import React, { Component } from 'react';
import { Token } from '@kambria/kambria-contract';
import { unit } from '@kambria/kambria-util';

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
    if (window.kambriaWallet.provider)
      return window.kambriaWallet.provider.web3.eth.sendTransaction({
        from: this.state.account,
        to: this.state.account,
        value: '1000000000000000',
      }, (er, txId) => {
        if (er) return console.error(er);
        return this.setState({ txId: txId.toString(), error: null });
      });
  }

  senErc20Tx = () => {
    if (window.kambriaWallet.provider) {
      const token = new Token('0x9dddff7752e1714c99edf940ae834f0d57d68546', window.kambriaWallet.provider.web3);
      return token.transfer(this.state.account, '1000000000000000000').then(txId => {
        return this.setState({ txId: txId.toString(), error: null });
      }).catch(er => {
        if (er) return console.error(er);
      });
    }
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
        <p>Balance: {unit.wei2ETH(this.state.balance)} ETH</p>
        <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={`https://${config.ethereum.explorer}etherscan.io/tx/${this.state.txId}`}>{this.state.txId}</a></p>
        <button onClick={this.sendTx}>Send Tx</button>
        <button onClick={this.senErc20Tx}>Send ERC20 Tx</button>
        {this.state.error ? <p>{this.state.error}</p> : null}
      </div>
    );
  }
}

export default Ethereum;
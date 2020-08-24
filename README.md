# Introduction

This module is a build-in zero client node as Metamask. It's supporting most of basic functions 
such as account management, transacion, contract, ...  With some restrictions of browser, the module will serve fully functions in Chrome and partly in the other browsers.

* In **VERSION 2.x.x**, the package starts to support React beside build-in zero clients.
* In **VERSION 3.x.x**, the package starts to support mobile devides.
* In **VERSION 4.x.x**, the package starts to support Binance chain.

## Install

```
npm install --save @kambria/kambria-wallet
```

# For browsers

## Prequisitions (In case you would like to install web3 by yourself)

* Install web3: ***Must be 1.x verison.***

```
npm install web3@1.x
```

## Utility

### Basic use:

```
import Wallet from '@kambria/kambria-wallet';

// ... Something React here

render() {
  <Wallet visible={visible} options={options} done={callback} />
}
```

### The component has 3 props:


1. `visible`: `<boolean>` - toogle the register modal.

2. `options`: `<object>` - wallet configurations. [Click here](#cheatsheet) to see the `networkId` detail.
   ```
   {
     pageRefreshing: <boolean> (true at default) - support browser to maintain the session when refreshing
     networkId: {
       ethereum: <number> - Ethereum network ID
       binance: <number> - Binance network ID
     }
   }
   ```

3. `done`: `<function>` - callback function returns `provider` instance when register has been done.

## Examples

```
import React, { Component } from 'react';
import Wallet from '@kambria/kambria-wallet';


class TestWallet extends Component {
  constructor() {
    super();

    this.state = {
      visible: false,
      provider: null,
      ACCOUNT: null,
      BALANCE: null,
      TXID: null,
      ERROR: null
    }

    this.options = {
      pageRefreshing: true,
      networkId: {
        ethereum: 4,
        binance: 2
      }
    }
  }

  register = () => {
    this.setState({ visible: false }, () => {
      this.setState({ visible: true });
    });
  }

  done = (er, re) => {
    if (er) return console.error(er)
    if (!re) return console.error('Use skip the registration');
    let {blockchain, provider} = re;

    console.log('Blockchain name:', blockchain);
    provider.web3.eth.getCoinbase((er, account) => {
      if (er) return console.error(er);
      provider.web3.eth.getBalance(account, (er, balance) => {
        if (er) return console.error(er);
        this.setState({ ACCOUNT: account, BALANCE: Number(balance) });
      })
    });

    return this.setState({ provider: provider });
  }

  sendTx = () => {
    let provider = this.state.provider;
    provider.web3.eth.sendTransaction({
      from: this.state.ACCOUNT,
      to: '0x5a926b235e992d6ba52d98415e66afe5078a1690',
      value: '1000000000000000'
    }, (er, txId) => {
      if (er) return this.setState({ ERROR: JSON.stringify(er) });
      return this.setState({ TXID: txId.toString() });
    });
  }

  render() {
    return (
      <div>
        <h1>Wallet testing</h1>
        <button onClick={this.register}>Register</button>

        <div>
          <p>Account: {this.state.ACCOUNT}</p>
          <p>Balance: {this.state.BALANCE}</p>
          <p>Previous tx id: <a target="_blank" rel="noopener noreferrer" href={"https://rinkeby.etherscan.io/tx/" + this.state.TXID}>{this.state.TXID}</a></p>
          <button onClick={this.sendTx}>Send Tx</button>
          {this.state.ERROR ? <a >{this.state.ERROR}</a> : null}
        </div>
        <Wallet visible={this.state.visible} options={this.options} done={this.done} />
      </div>
    );
  }
}

export default TestWallet;
```

# For contributors

## The structure

The `wallet` folder contains the main source code. It has 2 sub-folders - `ethereum` and `binance` - which are Ethereum source and Binance source respectively. Furthermore, `core` contains source code of re-used components, `static` contains static resouces and `stateMaintainer` is a hero helping to share state between multi browser windows.

The `src` folder contains test files. However, it can be viewed as an example, so
to know how to use them, you can refer to `src/*` for details.

## How to build library?

```
npm run build
```

The `index.js` file would be the destination of compiling (only one file).

## How to test?

### Unit test

```
Not yet
```

### Tool test

```
npm start
```

The app will be run on port 5000 with https and support hot-loading. (If the browser asks something, please trust it and process straight forward)


## Cheatsheet

### Network ID

| Chain | Network | ID |
| :-: | - | - |
| Ethereum | Mainnet | 1 |
| Ethereum | Ropsten | 3 |
| Ethereum | Rinkeby | 4 |
| Ethereum | Goerli  | 5 |
| Ethereum | Kovan   | 42 |
||
| Binance | Mainnet  | 1 |
| Binance | Testnet  | 2 |

### Commands

| # | Commands | Descriptions |
| :-: | - | - |
| 1 | `npm install` | Install module packages |
| 2 | `npm run build` | Build libraries in production|
| 3 | `npm start` | Run tool test |
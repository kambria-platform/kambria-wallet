import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import TestEthereum from './testEthereum';
import TestBinance from './testBinance';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <header style={{display: "flex"}}>
            <Link style={{ margin: "10px" }} to='/test-eth'>Test Ethereum Wallet</Link>
            <Link style={{ margin: "10px" }} to='/test-bnb'>Test Binance Wallet</Link>
          </header>
          <main style={{ margin: "10px" }}>
            <Switch>
              <Redirect exact from='/' to='/test-eth' />
              <Route exact path='/test-eth' component={TestEthereum} />
              <Route exact path='/test-bnb' component={TestBinance} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

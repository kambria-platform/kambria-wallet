import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import Test from './test';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <header style={{ display: "flex" }}>
            <Link style={{ margin: "10px" }} to='/test'>Test Wallet</Link>
          </header>
          <main style={{ margin: "10px" }}>
            <Switch>
              <Redirect exact from='/' to='/test' />
              <Route exact path='/test' component={Test} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

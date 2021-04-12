import React, { Component, Fragment } from 'react';

// Heros to operate and protect Kambria Bridge
import StateMaintainer from '../stateMaintainer';
import BrowserRefreshing from './browserRefreshing';
import FiniteStateMachine from './finiteStateMachine';
import Web3Factory from './web3Factory';

// Global/Inherit components
import ErrorForm from '../core/error';

// Workflow components
import SelectWallet from './skin/selectWallet';
import InputAsset from './skin/inputAsset';
import EstablishConnection from './skin/establishConnection';
import ConnectDevice from './skin/connectDevice';
import ConfirmAddress from './skin/confirmAddress';

// Constants
const ERROR = 'Wallet was broken';
const DEFAULT_STATE = {
  visible: false,
  step: 'Idle',
  error: ''
}
const DEFAULT_OPT = {
  networkId: 1,
  pageRefreshing: true
}


class Ethereum extends Component {

  /**
   * @props net - Network id
   * @props visible - Boolean
   * @props done - Callback function
   */
  constructor(props) {
    super(props);

    this.done = props.done;
    this.options = { ...DEFAULT_OPT, ...props.options }
    this.SM = new StateMaintainer();
    this.FSM = new FiniteStateMachine();
    this.W3F = new Web3Factory();

    this.state = {
      ...DEFAULT_STATE,
      step: props.visible ? this.FSM.next().step : 'Idle'
    };
  }

  componentDidMount() {
    if (!this.options.pageRefreshing) return;
    // Regenerate state
    this.SM.isStateMaintained(state => {
      if (state) return this.W3F.regenerate(state, (er, provider) => {
        if (er) return window.kambriaWallet.logout();
        window.kambriaWallet.provider = provider;
        return this.done(null, provider);
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        window.kambriaWallet.back = () => {
          let state = this.FSM.back();
          if (state.step === 'Idle') return window.kambriaWallet.home();
          return this.setState({ step: state.step });
        }
        this.setState({ visible: true, step: this.FSM.next().step });
      }
      else {
        window.kambriaWallet.back = null;
        this.setState({ ...DEFAULT_STATE });
      }
    }
  }

  /**
   * Flow management
   */

  onData = (er, re) => {
    // User meets error in processing
    if (er) return this.onError(er);
    // Heros are working :)
    // Move to next step
    const state = this.FSM.next(re);
    // Run to next step
    // Error case
    if (state.step === 'Error') return this.onError(ERROR);
    // Success case
    if (state.step === 'Success') return this.onClose(() => {
      // Store state
      if (this.options.pageRefreshing && BrowserRefreshing.isSupported(state.model)) this.SM.setState(state);
      this.W3F.generate(state, (er, provider) => {
        if (er) return this.onError(er);
        window.kambriaWallet.provider = provider;
        return this.done(null, provider);
      });
    });
    // Still in processing
    return this.setState({ step: state.step });
  }

  onError = (er) => {
    return this.setState({ visible: true, error: er, step: 'Error' }, () => {
      return this.FSM.reset();
    });
  }

  onClose = (callback) => {
    return this.setState({ visible: true }, () => {
      return this.setState({ visible: false }, () => {
        this.setState({ ...DEFAULT_STATE }, () => {
          return this.FSM.reset();
        });
        if (callback) callback();
      });
    });
  }

  render() {
    const { step, error } = this.state;
    return <Fragment>
      {step === 'SelectWallet' ? <SelectWallet data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
      {step === 'InputAsset' ? <InputAsset data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
      {step === 'EstablishConnection' ? <EstablishConnection data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
      {step === 'ConnectDevice' ? <ConnectDevice data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
      {step === 'ConfirmAddress' ? <ConfirmAddress data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
      {step === 'Error' ? <ErrorForm error={error} done={() => this.onClose(() => this.done(error, null))} /> : null}
    </Fragment>
  }

}

export default Ethereum;

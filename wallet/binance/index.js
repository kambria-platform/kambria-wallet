import React, { Component, Fragment } from 'react';

// Heros to operate and protect Kambria Bridge
import StateMaintainer from '../stateMaintainer';
import BrowserRereshing from './browserRefreshing';
import FiniteStateMachine from './finiteStateMachine';
import BinanceClientFactory from './binanceClientFactory';

// Global/Inherit components
import ErrorForm from '../core/error';

// Workflow components
import SelectWallet from './skin/selectWallet';
import InputAsset from './skin/inputAsset';
import EstablishConnection from './skin/establishConnection';
import ConfirmAddress from './skin/confirmAddress';
import ConnectDevice from './skin/connectDevice';

// Constants
const ERROR = 'Wallet was broken';
const DEFAULT_STATE = {
  visible: false,
  step: 'Idle',
  error: '',
  passphrase: false,
  authetication: false,
  qrcode: null,
}
const DEFAULT_OPT = {
  networkId: 1,
  restrictedNetwork: true,
  pageRefreshing: true
}


class Binance extends Component {

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
    this.BCF = new BinanceClientFactory(this.options.restrictedNetwork);

    this.state = {
      ...DEFAULT_STATE,
      step: props.visible ? this.FSM.next().step : 'Idle'
    };

    /**
     * Group of global functions
     */
    window.kambriaWallet.back = () => {
      let state = this.FSM.back();
      if (state.step === 'Idle') return this.props.selectBlockchain();
      return this.setState({ step: state.step });
    }
    window.kambriaWallet.logout = () => {
      this.SM.clearState();
    }
  }

  componentDidMount() {
    if (!this.options.pageRefreshing) return;
    // Regenerate state
    this.SM.isStateMaintained(state => {
      if (state) this.BCF.regenerate(state, (er, provider) => {
        if (er) return;
        window.kambriaWallet.provider = provider;
        return this.done(null, provider);
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) return this.setState({ visible: true, step: this.FSM.next().step });
      return this.setState({ ...DEFAULT_STATE });
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
    let state = this.FSM.next(re);

    // Run to next step
    // Error case
    if (state.step === 'Error') return this.onError(ERROR);
    // Success case
    if (state.step === 'Success') return this.onClose(() => {
      // Store state
      if (this.options.pageRefreshing && BrowserRereshing.isSupported(state.model)) this.SM.setState(state);
      this.BCF.generate(state, (er, provider) => {
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
      this.FSM.reset();
    });
  }

  onClose = (callback) => {
    this.setState({ visible: true }, () => {
      this.setState({ visible: false }, () => {
        this.setState({ ...DEFAULT_STATE }, () => {
          this.FSM.reset();
        });
        if (callback) callback();
      });
    });
  }

  render() {
    return (
      <Fragment>
        {this.state.step === 'SelectWallet' ? <SelectWallet data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
        {this.state.step === 'InputAsset' ? <InputAsset data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
        {this.state.step === 'EstablishConnection' ? <EstablishConnection data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
        {this.state.step === 'ConnectDevice' ? <ConnectDevice data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
        {this.state.step === 'ConfirmAddress' ? <ConfirmAddress data={this.FSM.data} done={this.onData} onClose={() => this.onClose(this.done)} /> : null}
        {this.state.step === 'Error' ? <ErrorForm error={this.state.error} done={() => this.onClose(() => { this.done(this.state.error, null) })} /> : null}
      </Fragment>
    );
  }

}

export default Binance; 

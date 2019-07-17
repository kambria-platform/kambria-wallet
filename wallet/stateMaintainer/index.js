var capsuleCoreMemmory = require('capsule-core-js/dist/storage').sessionStorage;
var capsuleCoreCache = require('capsule-core-js/dist/storage').cache;
var binanceCoreMemmory = require('binance-core-js/dist/storage').sessionStorage;
var binanceCoreCache = require('binance-core-js/dist/storage').cache;

const ADDRESS = require('./address');
const EVENT = require('./event');
const MAINTAINER = window.sessionStorage;
const PORTER = window.localStorage;


class StateMaintainer {
  constructor() {
    // Setup listener
    window.addEventListener('storage', this._handleEvent, false);
  }

  /**
   * Static functions
   */

  static setBeacon = (blockchain) => {
    window.localStorage.setItem(ADDRESS.BEACON, blockchain);
  }

  static getBeacon = () => {
    return window.localStorage.getItem(ADDRESS.BEACON);
  }

  static clearBeacon = () => {
    window.localStorage.removeItem(ADDRESS.BEACON);
  }

  /**
   * Public functions
   */

  getState = (callback) => {
    let data = JSON.parse(MAINTAINER.getItem(ADDRESS.MAINTAINER));
    if (data) return callback(data);
    this._emitEvent(EVENT.GET_DATA);
    setTimeout(() => {
      data = JSON.parse(MAINTAINER.getItem(ADDRESS.MAINTAINER));
      return callback(data);
    }, 1000);
  }

  setState = (value) => {
    let state = JSON.parse(JSON.stringify(value));
    delete state.step;
    delete state.asset;
    MAINTAINER.setItem(ADDRESS.MAINTAINER, JSON.stringify(state));
    this._emitEvent(EVENT.SET_DATA);
  }

  clearState = () => {
    this._clearState();
    this._emitEvent(EVENT.CLEAR_DATA);
  }

  /**
   * Internal functions
   */

  _clearState = () => {
    MAINTAINER.removeItem(ADDRESS.MAINTAINER);
    try { window.kambriaWallet.provider.logout(); }
    catch (er) { console.error('User already logged out'); }
    finally { window.kambriaWallet.provider = null; }
  }

  _shareState = () => {
    let data = {};
    // Maintainer
    let maintainerData = MAINTAINER.getItem(ADDRESS.MAINTAINER);
    if (maintainerData) data[ADDRESS.MAINTAINER] = maintainerData;
    // Capsule
    let capsuleMemoryData = capsuleCoreMemmory.get();
    let capsuleCacheData = capsuleCoreCache.getAll();
    if (capsuleMemoryData) data[ADDRESS.CAPSULE_JS_MEMORY] = capsuleMemoryData;
    if (capsuleCacheData) data[ADDRESS.CAPSULE_JS_CACHE] = capsuleCacheData;
    // Binance
    let binanceMemoryData = binanceCoreMemmory.get();
    let binanceCacheData = binanceCoreCache.getAll();
    if (binanceMemoryData) data[ADDRESS.BINANCE_JS_MEMORY] = binanceMemoryData;
    if (binanceCacheData) data[ADDRESS.BINANCE_JS_CACHE] = binanceCacheData;
    // Share
    PORTER.setItem(ADDRESS.PORTER, JSON.stringify(data));
    PORTER.removeItem(ADDRESS.PORTER);
  }

  _handleEvent = (event) => {
    // Some tags need data, we must share
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.GET_DATA)
      this._shareState();
    // We clear data
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.CLEAR_DATA)
      this._clearState();
    // I will send you data
    if (event.key == ADDRESS.PORTER) {
      let data = JSON.parse(event.newValue);
      for (let key in data) {
        if (key == ADDRESS.CAPSULE_JS_MEMORY) {
          capsuleCoreMemmory.set(data[key]);
        }
        else if (key == ADDRESS.CAPSULE_JS_CACHE) {
          capsuleCoreCache.setAll(data[key]);
        }
        else if (key == ADDRESS.BINANCE_JS_MEMORY) {
          binanceCoreMemmory.set(data[key]);
        }
        else if (key == ADDRESS.BINANCE_JS_CACHE) {
          binanceCoreCache.setAll(data[key]);
        }
        else {
          MAINTAINER.setItem(key, data[key]);
        }
      }
    }
  }

  _emitEvent = (event) => {
    PORTER.setItem(ADDRESS.EVENT, event);
    PORTER.removeItem(ADDRESS.EVENT);
  }
}

module.exports = StateMaintainer;

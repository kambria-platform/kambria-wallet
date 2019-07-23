var capsuleCoreMemmory = require('capsule-core-js/dist/storage').sessionStorage;
var capsuleCoreCache = require('capsule-core-js/dist/storage').cache;
var binanceCoreMemmory = require('binance-core-js/dist/storage').sessionStorage;
var binanceCoreCache = require('binance-core-js/dist/storage').cache;
var beacon = require('./beacon');

const ADDRESS = require('./address');
const EVENT = require('./event');
const STORAGE = window.localStorage;

class StateMaintainer {
  constructor() {
    // Setup listener
    window.addEventListener('storage', this._handleEvent, false);
  }

  /**
   * Public functions
   */
  isStateMaintained(callback) {
    return this.getState(callback);
  }

  getState = (callback) => {
    let data = STORAGE.getItem(ADDRESS.MAINTAINER);
    let maintainerData = JSON.parse(data);
    // Have no maintainer
    if (!maintainerData || !maintainerData.blockchain) return callback(null);
    this._emitEvent(EVENT.SHARE_DATA);
    // Timeout to wait for sharing data
    setTimeout(() => {
      if (!beacon.get()) return callback(null);
      return callback(maintainerData);
    }, 1000);
  }

  setState = (value) => {
    let state = { ...value } // Trick to copy object
    delete state.step;
    delete state.asset;
    delete state.provider;
    STORAGE.setItem(ADDRESS.MAINTAINER, JSON.stringify(state));
    beacon.set();
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
    beacon.remove();
    STORAGE.removeItem(ADDRESS.MAINTAINER);
    try { window.kambriaWallet.provider.logout(); }
    catch (er) { console.error('User already logged out'); }
    finally { window.kambriaWallet.provider = null; }
  }

  _shareState = () => {
    let data = {};
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
    // Beacon
    let beaconData = beacon.get();
    if (beaconData) data[ADDRESS.BEACON] = beaconData;
    // Share
    STORAGE.setItem(ADDRESS.PORTER, JSON.stringify(data));
    STORAGE.removeItem(ADDRESS.PORTER);
  }

  _handleEvent = (event) => {
    // Some tags need data, we must share
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.SHARE_DATA)
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
        else if (key == ADDRESS.BEACON) {
          beacon.set();
        }
      }
    }
  }

  _emitEvent = (event) => {
    STORAGE.setItem(ADDRESS.EVENT, event);
    STORAGE.removeItem(ADDRESS.EVENT);
  }
}

module.exports = StateMaintainer;

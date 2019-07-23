var capsuleCoreMemmory = require('capsule-core-js/dist/storage').sessionStorage;
var capsuleCoreCache = require('capsule-core-js/dist/storage').cache;
var binanceCoreMemmory = require('binance-core-js/dist/storage').sessionStorage;
var binanceCoreCache = require('binance-core-js/dist/storage').cache;

var Porter = require('./porter');
var beacon = require('./beacon');

const ADDRESS = require('./address');
const STORAGE = window.localStorage;

class StateMaintainer {
  constructor() {
    // Setup listener
    this.porter = new Porter();
    this.porter.onNewData(this._newState);
    this.porter.onShareData(this._shareState);
    this.porter.onClearData(this._clearState)
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
    // Emit SHARE-DATA event
    this.porter.emitShareData();
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
  }

  clearState = () => {
    this._clearState();
    this.porter.emitClearData();
  }

  /**
   * Internal functions
   */

  _newState = (data) => {
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
    this.porter.emitNewData(data);
  }

  _clearState = () => {
    beacon.remove();
    STORAGE.removeItem(ADDRESS.MAINTAINER);
    try { window.kambriaWallet.provider.logout(); }
    catch (er) { console.error('User already logged out'); }
    finally { window.kambriaWallet.provider = null; }
  }
}

module.exports = StateMaintainer;

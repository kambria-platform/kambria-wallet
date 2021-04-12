const capsuleCoreMemmory = require('capsule-core-js/dist/storage').sessionStorage;
const capsuleCoreCache = require('capsule-core-js/dist/storage').cache;

const Porter = require('./porter');
const beacon = require('./beacon');

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
    const data = STORAGE.getItem(ADDRESS.MAINTAINER);
    const maintainerData = JSON.parse(data);
    // Have no maintainer
    if (!maintainerData) return callback(null);
    // Emit SHARE-DATA event
    this.porter.emitShareData();
    // Timeout to wait for sharing data
    return setTimeout(() => {
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
    return beacon.set();
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
      if (key == ADDRESS.CAPSULE_JS_MEMORY) return capsuleCoreMemmory.set(data[key]);
      if (key == ADDRESS.CAPSULE_JS_CACHE) return capsuleCoreCache.setAll(data[key]);
      if (key == ADDRESS.BEACON) return beacon.set();
    }
  }

  _shareState = () => {
    let data = {};
    // Capsule
    const capsuleMemoryData = capsuleCoreMemmory.get();
    const capsuleCacheData = capsuleCoreCache.getAll();
    if (capsuleMemoryData) data[ADDRESS.CAPSULE_JS_MEMORY] = capsuleMemoryData;
    if (capsuleCacheData) data[ADDRESS.CAPSULE_JS_CACHE] = capsuleCacheData;
    // Beacon
    const beaconData = beacon.get();
    if (beaconData) data[ADDRESS.BEACON] = beaconData;
    // Share
    return this.porter.emitNewData(data);
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

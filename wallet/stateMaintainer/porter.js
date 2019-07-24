const ADDRESS = require('./address');

const EVENT = {
  NEW_DATA: 'NEW-DATA',
  SHARE_DATA: 'SHARE-DATA',
  CLEAR_DATA: 'CLEAR-DATA',
}
const DEFAULT = {
  _newData: () => { console.log('Receive event NEW-DATA but empty function.') },
  _clearData: () => { console.log('Receive event CLEAR-DATA but empty function.') },
  _shareData: () => { console.log('Receive event SHARE-DATA but empty function.') }
}
const STORAGE = window.localStorage;


class Porter {
  constructor() {
    window.addEventListener('storage', this._handleEvent, false);
  }

  _emitData = (data) => {
    STORAGE.setItem(ADDRESS.PORTER, data);
    STORAGE.removeItem(ADDRESS.PORTER);
  }

  _emitEvent = (event) => {
    STORAGE.setItem(ADDRESS.EVENT, event);
    STORAGE.removeItem(ADDRESS.EVENT);
  }

  _handleEvent = (event) => {
    // Some tags need data, we must share
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.SHARE_DATA)
      this._shareData();
    // We clear data
    if (event.key == ADDRESS.EVENT && event.newValue == EVENT.CLEAR_DATA)
      this._clearData();
    // I will send you data
    if (event.key == ADDRESS.PORTER)
      this._newData(JSON.parse(event.newValue));
  }

  emitNewData = (data) => {
    this._emitData(JSON.stringify(data));
  }

  emitShareData = () => {
    this._emitEvent(EVENT.SHARE_DATA);
  }

  emitClearData = () => {
    this._emitEvent(EVENT.CLEAR_DATA);
  }

  onNewData = (callback) => {
    if (!callback || typeof callback != 'function') return this._newData = DEFAULT._newData;
    return this._newData = callback;
  }

  onShareData = (callback) => {
    if (!callback || typeof callback != 'function') return this._shareData = DEFAULT._shareData;
    return this._shareData = callback;
  }

  onClearData = (callback) => {
    if (!callback || typeof callback != 'function') return this._clearData = DEFAULT._clearData;
    return this._clearData = callback;
  }
}

module.exports = Porter;
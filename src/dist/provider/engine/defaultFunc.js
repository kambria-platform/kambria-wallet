'use strict';

module.exports = {
  dataHandler: function dataHandler(block) {
    console.log('=========== NEW BLOCK ===========');
    console.log('BLOCK NUMBER:', parseInt('0x' + block.number.toString('hex')));
    console.log('HASH:', '0x' + block.hash.toString('hex'));
    console.log('=================================');
  },

  errorHandler: function errorHandler(error) {
    console.log('============= ERROR =============');
    console.error(error.stack);
    console.log('=================================');
  },

  getAccounts: function getAccounts(callback) {
    var er = 'getAccounts() is not set yet';
    console.error(er);
    return callback(er, null);
  },

  approveTransaction: function approveTransaction(txParams, callback) {
    var er = 'approveTransaction() is not set yet';
    console.error(er);
    return callback(er, null);
  },

  signTransaction: function signTransaction(callback) {
    var er = 'signTransaction() is not set yet';
    console.error(er);
    return callback(er, null);
  }
};
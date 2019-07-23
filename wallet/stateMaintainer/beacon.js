const ADDRESS = require('./address');
const MEMORY = window.sessionStorage;

module.exports = {
  set: () => {
    MEMORY.setItem(ADDRESS.BEACON, 'The session is maintaining.');
  },
  get: () => {
    return MEMORY.getItem(ADDRESS.BEACON);
  },
  remove: () => {
    MEMORY.removeItem(ADDRESS.BEACON)
  }
}
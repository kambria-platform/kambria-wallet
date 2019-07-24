/**
 * This configuration describes which types of wallet model that are supported
 * to browser refreshing
 */

const config = {
  // Hardwallet
  'ledger-nano-s': true,
  // Hybridwallet
  'trust-wallet': true,
  // Softwallet
  'mnemonic': true,
  'keystore': true,
  'private-key': true,
}

const isSupported = (model) => {
  return config[model];
}

export default { isSupported };
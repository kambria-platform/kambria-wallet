/**
 * This configuration describes which types of wallet model that are supported
 * to browser refreshing
 */

const config = {
  // Metamask
  'metamask': true,
  // Hardwallet
  'ledger-nano-s': true,
  'trezor-one': true,
  // Hybridwallet
  'my-ether-wallet': false,
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
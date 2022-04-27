import {connect, keyStores, WalletConnection, Contract, utils} from 'near-api-js';

export const DEFAULT_GAS = 300000000000000;

export const Service = {
  stackOverflow: 'Stackoverflow',
}

const contractAddress = process.env.REACT_APP_NEAR_CONTRACT_ADDRESS;

const viewMethods = ["get_deposit_account_id", "get_service_id_tips", "get_account_id_tips", "get_linked_accounts"];
const changeMethods = ["deposit_account", "send_tips", "withdraw_deposit", "withdraw_tips", "authentification_commitment", "link_account"];

const config = {
  networkId: process.env.REACT_APP_NEAR_NETWORK_ID,
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: process.env.REACT_APP_NEAR_NODE_URL,
  walletUrl: process.env.REACT_APP_NEAR_WALLET_URL,
  helperUrl: process.env.REACT_APP_NEAR_HELPER_URL,
  explorerUrl: process.env.REACT_APP_NEAR_EXPLORER_URL,
};

export const connectWallet = async () => {
  const near = await connect(config);

  return new WalletConnection(near);
}

export const signIn = (wallet) => {
  wallet.requestSignIn({
    successUrl: `${window.location.toString()}?signedNear=true`,
    failureUrl: `${window.location.toString()}?signedNear=false`,
    contractId: contractAddress,
    methodNames: [
      ...viewMethods,
      ...changeMethods,
    ],
  })
};

export const getContract = (wallet) => {
  if (wallet.isSignedIn()) {
    return new Contract(
      wallet.account(),
      contractAddress,
      {
        viewMethods,
        changeMethods,
        sender: wallet.account(),
      }
    );
  }

  return null;
}

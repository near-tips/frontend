import { connect, keyStores, WalletConnection, Contract } from 'near-api-js';

export const DEFAULT_GAS = 300000000000000;

const contractAddress = 'near-tips.testnet';

const viewMethods = ["get_deposit_account_id", "get_service_id_tips", "get_account_id_tips", "get_linked_accounts"];
const changeMethods = ["deposit_account", "send_tips", "withdraw_deposit", "withdraw_tips", "authentification_commitment", "link_account"];

const config = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
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

import { connect, keyStores, WalletConnection, Contract } from 'near-api-js';

const config = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

const contractAddress = 'norfolks.testnet';

export const connectWallet = async () => {
  const near = await connect(config);

  return new WalletConnection(near);
}

export const signIn = (wallet) => {
  wallet.requestSignIn(
    contractAddress,
    "Near Tips",
    `${window.location.toString()}?signedNear=true`,
    `${window.location.toString()}?signedNear=false`,
  );
};

export const getContract = (wallet) => {
  if (wallet.isSignedIn()) {
    return new Contract(
      wallet.account(),
      contractAddress,
      {
        viewMethods: ["get_user_tips"],
        changeMethods: ["make_tip", "withdraw_tip", "withdraw_tip_validators", "commit_access_token"],
        sender: wallet.account(),
      }
    );
  }

  return null;
}

import { createContext, useEffect, useState } from "react";
import { getWeb3, isConnected } from "../ethereum/web3";

import MerkleProof from "../ethereum/contracts/MerkleProof.json";
import MintedToken from "../ethereum/contracts/MintedToken.json";
import { initContract } from "../constants/helpers";
import { LOGIN_WALLET } from "../api/wallet";

export const WalletContext = createContext();
export default function WalletProvider(props) {
  const [token, setToken] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const [contracts, setContracts] = useState(null);

  const DATA_CONTRACTS = {
    MerkleProof: {
      abi: MerkleProof.abi,
      address: "0x38A304e32F55e3BCF65561231bedC5fa10364158",
    },
    MintedToken: {
      abi: MintedToken.abi,
      address: "0x5aa6EEd3c6372021E81Be015eC1981f7bfd5B87F",
    },
  };

  useEffect(() => {
    setToken(localStorage.getItem("Authorization") || null);
  }, []);

  const fetchContracts = async () => {
    const merkle = await initContract({
      address: DATA_CONTRACTS.MerkleProof.address,
      abi: DATA_CONTRACTS.MerkleProof.abi,
      provider: wallet.provider,
    });
    const token = await initContract({
      address: DATA_CONTRACTS.MintedToken.address,
      abi: DATA_CONTRACTS.MintedToken.abi,
      provider: wallet.provider,
    });
    setContracts({ merkle, token });
  };

  useEffect(() => {
    if (wallet) fetchContracts();
  }, [wallet]);

  useEffect(() => {
    if (contracts) console.log("contracts => ", contracts);
  }, [contracts]);

  const connectWallet = async () => {
    setWalletLoading(true);
    setWallet(null);
    const { wallet } = await getWeb3();
    if (wallet !== null) {
      try {
        const { authorization } = await LOGIN_WALLET(wallet?.walletAddress);
        localStorage.setItem('Authorization', authorization);
        setToken(authorization);
      } catch {
        setToken(null);
        localStorage.clear();
      }
      setWallet(wallet);
      setWalletLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletLoading(true);
    setWallet(null);
    localStorage.clear();
    setWalletLoading(false);
  };

  useEffect(() => {
    if (isConnected() === true) connectWallet();
  }, []);

  useEffect(() => {
    if (wallet) {
      wallet.provider.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) connectWallet();
        else disconnectWallet();
      });
      wallet.provider.on("networkChanged", () => {
        connectWallet();
      });
    }
  }, [wallet]);

  let initialState = {
    wallet,
    setWallet,
    walletLoading,
    setWalletLoading,
    contracts,
    token,
    actions: {
      connectWallet,
      disconnectWallet,
    },
  };

  return (
    <WalletContext.Provider value={initialState}>
      {props.children}
    </WalletContext.Provider>
  );
}

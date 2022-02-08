import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { shortenWalletAddress } from "../../constants/helpers";
import { WalletContext } from "../../store/wallet.provider";

export default function AccountAddress() {
  const router = useRouter();
  const { actions,wallet } = useContext(WalletContext);
  // you can use paramWalletAddress everywhere
  const [paramWalletAddress, setParamWalletAddress] = useState("");
  const PARAM_WALLET_ADDRESS = router.query.accountAddress;

  // set param wallet address when came address from params
  useEffect(() => {
    if (PARAM_WALLET_ADDRESS) setParamWalletAddress(PARAM_WALLET_ADDRESS);
  }, [PARAM_WALLET_ADDRESS]);

  return (
    <Layout
      title={`${
        paramWalletAddress
          ? `Account - ${shortenWalletAddress(paramWalletAddress)}`
          : "Loading.."
      }`}
    >
      <div className="account-page py-5">
        <div className="container text-center account-page-row">
          <h2 className="text-color-dark-light mb-3">My Account</h2>

          <div className="pb-4">
            <div className="d-flex justify-content-center align-items-center w-auto pb-3">
              <h6 className="me-2">{shortenWalletAddress(paramWalletAddress)}</h6>
              <i className="fas fa-external-link-square-alt"></i>
            </div>
            {wallet ? (
              String(wallet.walletAddress).toLowerCase() ===
              String(paramWalletAddress).toLowerCase() ? (
                <button onClick={actions.disconnectWallet} className="danger">Disconnect Wallet</button>
              ) : null
            ) : null}
          </div>

          <h2 className="text-center pb-4">
            You're currently holding 🤔 which is worth 🤔 right now. You also
            have 🤔 in rewards.
          </h2>
          <div
            className="d-flex align-items-center justify-content-center w-100"
            style={{ gap: 15 }}
          >
            <button className="primary">Trade WTF</button>
            <button className="success">Add Liquidity</button>
            <button className="danger">Remove Liquidity</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

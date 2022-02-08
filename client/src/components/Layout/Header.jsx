import { useRouter } from "next/router";
import Link from "next/link";
import { useContext } from "react";
import { WalletContext } from "../../store/wallet.provider";

export default function Header({ sidebarData, links }) {
  const { actions, wallet } = useContext(WalletContext);

  const router = useRouter();

  return (
    <header className="header">
      <div className="container header-row">
        <div className="logo">
          <img src="/images/oct-logo.png" alt="" />
        </div>
        <div className="right-actions">
          <ul className="actions">
            {links.map((link, idx) => (
              <Link href={link.to}>
                <a>
                  <li
                    className={`actions-item ${
                      router.asPath === link.to ? "active" : ""
                    }`}
                  >
                    {link.title}
                  </li>
                </a>
              </Link>
            ))}
          </ul>
          <button
            onClick={() =>
              wallet
                ? router.push(`/account/${wallet.walletAddress}`)
                : actions.connectWallet()
            }
            className="wallet-button"
          >
            {wallet ? "Account" : "Connect Wallet"}
          </button>
          <button className="gas-button">
            <i className="fas fa-gas-pump"></i>
            <span> 5</span>
          </button>
        </div>
        <button
          onClick={() => sidebarData.setIsSidebar(true)}
          className="mobile-btn"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
}

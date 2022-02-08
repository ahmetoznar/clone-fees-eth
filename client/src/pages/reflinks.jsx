import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { loadingAndRender } from "../constants/helpers";
import { WalletContext } from "../store/wallet.provider";

import Link from "next/link";

export default function ReflinksMy() {
  const router = useRouter();
  const { wallet } = useContext(WalletContext);
  const [refLink, setRefLink] = useState("");

  const [copied, setCopied] = useState(false);

  useEffect(() => {}, []);

  const copyLink = async () => {
    setCopied(true);
    await navigator.clipboard.writeText(
      `http://localhost:3000/claim?ref=${wallet?.walletAddress}`
    );
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Layout title="Reflinks">
      <div className="reflinks-page py-5">
        <div className="container text-center reflinks-page-row">
          <h2 className="text-color-dark-light mb-3">Reflinks</h2>
          <Link
            href={`http://localhost:3000/claim?ref=${wallet?.walletAddress}`}
          >
            <a>
              <h4 className="cursor-pointer text-color-primary mb-3">
                <i className="fas fa-external-link-square-alt me-2"></i>
                http://localhost:3000/claim?ref=
                {loadingAndRender({
                  wait: wallet,
                  renderer: () => wallet.walletAddress,
                })}
              </h4>
            </a>
          </Link>
          <a onClick={copyLink} className="cursor-pointer">
            {copied ? (
              <>
                <i className="fas fa-check text-color-success me-2"></i>
                <span className="text-color-success">Copied..</span>
              </>
            ) : (
              <>
                <i className="fas fa-clone me-2"></i>
                <span>Click to copy</span>
              </>
            )}
          </a>
          <br />
          <br />
          <h2 className="text-center">
            Right now you'll get 10% of any service fees that you refer,
            delivered straight to your wallet, paid in ETH.
          </h2>
        </div>
      </div>
    </Layout>
  );
}

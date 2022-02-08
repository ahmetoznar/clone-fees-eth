import { useContext, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { loadingAndRender } from "../constants/helpers";
import { getTxs } from "../ethereum/web3";
import { WalletContext } from "../store/wallet.provider";
import { soliditySha3 } from "web3-utils";
import { useRouter } from "next/router";
import { CREATE_WALLET, GET_WALLET, GET_WALLET_COUNT } from "../api/wallet";
import Countdown, { zeroPad } from "react-countdown";
import Web3 from "web3";

const ethers = require("ethers");

export default function Home() {
  const { wallet, contracts } = useContext(WalletContext);
  const [data, setData] = useState(null);
  const [empty, setEmpty] = useState(0n);
  const [hashArray, setHashArray] = useState([]);
  const [_timeLeftStamp, setTimeLeftStamp] = useState(0);
  const [unlocking, setUnlocking] = useState(false);

  const [totalUnlockedAccount, setTotalUnlockedAccount] = useState(null);

  const [isWalletService, setIsWalletService] = useState({
    data: null,
    loading: true,
    error: false,
  });

  const router = useRouter();
  const QUERY = router.query.ref;

  useEffect(() => {
    async function getData() {
      if (wallet) {
        setData(await getTxs(wallet?.walletAddress));
      }
    }
    getData();
  }, [wallet]);

  useEffect(() => {
    async function getContract() {
      if (contracts) {
        const claimPeriodStartDate = await contracts?.merkle.methods
          .unlockCloseTime()
          .call();
        console.log(claimPeriodStartDate);

        // setTimeLeftStamp(claimPeriodStartDate);
      }
    }
    getContract();
  }, [contracts]);

  useEffect(() => {
    async function s() {
      const { count } = await GET_WALLET_COUNT();
      setTotalUnlockedAccount(count);

      if (contracts) {
        const claimPeriodStartDate = await contracts.merkle.methods
          .unlockCloseTime()
          .call();
        const timeLeftSStamp = claimPeriodStartDate * 1000;
        setTimeLeftStamp(timeLeftSStamp);
        const isUserUnlocked = await contracts.merkle.methods
          .isUserUnlocked(wallet?.walletAddress)
          .call();
        setIsWalletService({
          data: isUserUnlocked,
          loading: false,
          error: false,
        });
      }
    }
    s();
  }, [contracts]);

  const onUnlock = async () => {
    setUnlocking(true);
    const amount =
      ((Number(data.normal.normalGasFeeTotal) + 0.95) ** 0.6 - 0.95 ** 0.6) *
      1000;
    console.log(data, "data");
    console.log("amount => ", amount);
    const randomInt =
      Math.floor(Math.random() * (999999999 - 1000000)) + 1000000;
    let _wallet = {
      index: randomInt,
      address: wallet && wallet.walletAddress,
      amount: Math.floor(amount),
      totalFees: data.normal.normalGasFeeTotal,
      failFees: data.normal.normalGasFeeTotalFail,
      totalGas: data.normal.normalGasUsedTotal,
      avgGwei: 0,
      totalDonated: 0,
      totalTxs: data.normal.normalTxsOut,
      failTxs: data.normal.normalTxsOutFail,
      leaf: "",
    };

    const userData = [
      randomInt,
      Math.floor(amount),
      _wallet && _wallet.totalFees,
      _wallet && _wallet.failFees,
      _wallet && _wallet.totalGas,
      _wallet && _wallet.avgGwei,
      _wallet && _wallet.totalDonated,
      _wallet && _wallet.totalTxs,
      _wallet && _wallet.failTxs,
    ];

    _wallet.leaf = await soliditySha3(
      String(_wallet.walletAddress),
      userData[0],
      userData[1],
      userData[2],
      userData[3],
      userData[4],
      userData[5],
      userData[6],
      userData[7],
      userData[8]
    );
    await setHashArray(userData);
    try {
      const res = await createWallet(_wallet);
      if (res.created) {
        setUnlocking(false);
      }
    } catch (error) {
      setUnlocking(false);
      console.log("error => ", error);
    }
    try {
      const response = await contracts.merkle.methods
        .unlock(QUERY ? QUERY : "0x0000000000000000000000000000000000000000")
        .send({
          from: wallet?.walletAddress,
          value: Web3.utils.toWei("0.1", "ether"),
        });
      if (response.transactionHash) {
      }
    } catch (error) {
      setUnlocking(false);
      console.log("error => ", error);
    }
  };

  const createWallet = async (payload) => {
    try {
      const response = await CREATE_WALLET({
        wallet: payload,
        proofs: [],
      });
      console.log("created => ", response.created);
    } catch (error) {
      console.log("error => ", error);
    }
  };

  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return "Finished";
    } else {
      return (
        <>
          <b>
            {zeroPad(hours)}:{zeroPad(hours)}:{zeroPad(minutes)}:
            {zeroPad(seconds)}
          </b>
        </>
      );
    }
  };

  return (
    <Layout title="Home">
      <div className="home-page py-5">
        <div className="container text-center home-page-row">
          <h6 className="text-color-dark-light">
            {wallet ? (
              <>You Connected with: {wallet?.walletAddress}</>
            ) : (
              <>No account connected!</>
            )}
          </h6>
          <br />
          <br />
          <h2 className="text-color-dark-light">
            They've spent{" "}
            <span className="text-color-primary">
              {loadingAndRender({
                wait: data,
                renderer: () => (
                  <>
                    {data?.chain.token}
                    {data?.gasFeeTotal}
                  </>
                ),
              })}
            </span>{" "}
            on gas. Right now, that's{" "}
            <span className="text-color-primary">
              {loadingAndRender({
                wait: data,
                renderer: () => <>${data?.tokenusd}</>,
              })}
            </span>
            .
          </h2>
          <br />
          <br />
          <h2 className="text-color-dark-light">
            They used{" "}
            <span className="text-color-primary">
              {loadingAndRender({
                wait: data,
                renderer: () => <>{data?.gasUsedTotal}</>,
              })}
            </span>{" "}
            gas to send{" "}
            <span className="text-color-primary">
              {loadingAndRender({
                wait: data,
                renderer: () => <>{data?.nOut}</>,
              })}
            </span>{" "}
            transactions, with an average price of{" "}
            <span className="text-color-primary">
              {loadingAndRender({
                wait: data,
                renderer: () => <>{data?.gasPricePerTx}</>,
              })}
            </span>{" "}
            Gwei.
          </h2>
          <br />
          <br />
          <h2 className="text-color-dark-light">
            <span className="text-color-primary">
              {loadingAndRender({
                wait: data,
                renderer: () => <>{data?.nOutFail}</>,
              })}
            </span>{" "}
            of them failed, costing them{" "}
            <span className="text-color-primary">
              {loadingAndRender({
                wait: data,
                renderer: () => <>{data?.gasFeeTotalFail}</>,
              })}
            </span>
            .
          </h2>
          <div className="button-actions my-5 d-flex align-items-center flex-direction-column">
            {isWalletService.data === false && !isWalletService.loading && (
              <button
                onClick={() => onUnlock()}
                className={`success ${unlocking ? "disabled" : ""}`}
              >
                <i className="fas fa-lock me-2"></i>
                {unlocking ? "Unlocking.." : "Unlock"}
              </button>
            )}
            {isWalletService.data !== false && !isWalletService.loading && (
              <button className="success disabled">
                <i className="fas fa-unlock me-2"></i>
                Unlocked
              </button>
            )}
            {isWalletService.data === null && isWalletService.loading && (
              <h2>Loading...</h2>
            )}
            <span>Total Registered Account: {totalUnlockedAccount}</span>

            <br />

            <h4>
              Time Left to End Unlock Period{": "}
              {_timeLeftStamp ? (
                <Countdown date={_timeLeftStamp} renderer={renderCountdown} />
              ) : null}
            </h4>
          </div>
          <div className="social-actions mb-5">
            <button className="outline dark">
              <i className="fab fa-twitter"></i>
            </button>
            <button className="outline dark">
              <i className="fab fa-discord"></i>
            </button>
            <button className="outline dark">
              <i className="fab fa-ethereum"></i>
            </button>
            <button className="outline dark">
              <i className="fas fa-sticky-note"></i>
            </button>
          </div>
          <i class="fas fa-angle-double-down" style={{ fontSize: 45 }}></i>
          <br />
          <br />
        </div>
      </div>
    </Layout>
  );
}

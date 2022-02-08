import React from "react";
import { NextPage } from "next";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useContext } from "react";
import { WalletContext } from "../store/wallet.provider";
import { useEffect } from "react";
import { GET_WALLET } from "../api/wallet";
import { useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
const Claim = () => {
  const router = useRouter();
  const { wallet, contracts } = useContext(WalletContext);
  const [reference, setReference] = React.useState("");
  const [_isUserClaimed, setUserClaimStatus] = React.useState(false);
  const [_isUserUnlocked, setUserUnlock] = React.useState(false);
  const [_timeLeftStamp, setTimeLeftStamp] = React.useState(0);
  const [_claimAmount, setClaimAmount] = React.useState(0);

  const REF_QUERY = String(router.query.ref);

  const [user, setUser] = useState(null);

  React.useEffect(() => {
    if (REF_QUERY) {
      setReference(REF_QUERY);
    }
  }, [REF_QUERY]);

  const fetchOwnData = async () => {
    const response = await GET_WALLET({
      walletAddress: wallet?.walletAddress,
    });
    const claimAmount = response.wallet.amount;
    setClaimAmount(
      await wallet.instance.utils.fromWei(claimAmount.toString(), "ether")
    );
    if (contracts) {
      const isUserClaimed = await contracts.merkle.methods
        .isUserClaimed(wallet?.walletAddress)
        .call();
      const isUserUnlocked = await contracts.merkle.methods
        .isUserUnlocked(wallet?.walletAddress)
        .call();
      const claimPeriodStartDate = await contracts.merkle.methods
        .unlockCloseTime()
        .call();
      const timeLeftSStamp = claimPeriodStartDate * 1000;
      setUserClaimStatus(isUserClaimed);
      setTimeLeftStamp(timeLeftSStamp);
      setUserUnlock(isUserUnlocked);
    }
    setUser(response.wallet);
  };

  useEffect(() => {
    if (wallet && contracts) fetchOwnData();
  }, [wallet, contracts]);

  const onClaim = async () => {
    const merkle = contracts.merkle.methods;
    let payload = [
      wallet?.walletAddress,
      user?.index,
      BigInt(user?.amount),
      BigInt(user?.totalFees),
      user?.failFees,
      user?.totalGas,
      user?.avgGwei,
      user?.totalDonated,
      user?.totalTxs,
    ];

    let p = [];
    console.log(user, "user");
    user?.proofs.forEach((item) => {
      p.push(item.proofAddress);
    });

    try {
      await merkle.claimTokens(payload, p).send({
        from: wallet?.walletAddress,
      });
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
    <Layout title="Claim Your Tokens">
      <div className="home-page py-5">
        <div className="container text-center home-page-row">
          <h2 className="text-color-dark-light">Claim your $OCT</h2>
          <div className="button-actions my-3 d-flex align-items-center flex-direction-column">
            <h2>
              Time Left to Starting of Claim Period:{" "}
              {_timeLeftStamp ? (
                <Countdown date={_timeLeftStamp} renderer={renderCountdown} />
              ) : null}
            </h2>
            <br />
            <h3 style={{ color: "#02b875" }}>
              {!_isUserClaimed
                ? `You will claim ${_claimAmount} $OCT tokens`
                : `You Already Claimed ${_claimAmount} $OCT`}
            </h3>
            {_isUserUnlocked ? (
              <h5 style={{ color: "#02b875" }}>
                "Your Account Succesfully Unlocked"{" "}
              </h5>
            ) : (
              <h5 style={{ color: "#d9534f" }}>
                First you must unlock your account
              </h5>
            )}

            <button onClick={() => onClaim()} className="success">
              <i className="fas fa-money-bill me-2"></i>
              Claim
            </button>
            <br />
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
        </div>
      </div>
    </Layout>
  );
};

export default Claim;

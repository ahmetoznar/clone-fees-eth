import { ethers } from "ethers";
import { useContext } from "react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { CREATE_PROOFS, GET_WALLETS } from "../../api/wallet";
import { copyText, shortenWalletAddress } from "../../constants/helpers";
import { WalletContext } from "../../store/wallet.provider";

import * as bigintConversion from "bigint-conversion";

import { decToHex } from "hex2dec";
import axios from "../../services/axios";

export default function Admin() {
  const { contracts } = useContext(WalletContext);

  const [walletService, setWalletService] = useState({
    data: [],
    loading: false,
    error: false,
    count: null,
    options: {
      skip: 0,
      take: 100,
    },
  });
  const [query, setQuery] = useState("");

  const [leafs, setLeafs] = useState([]);
  const [merkleRootResult, setMerkleRootResult] = useState([]);

  var empty = 0n;

  const fetchData = async () => {
    setWalletService({
      ...walletService,
      data: [],
      loading: true,
      error: false,
    });
    try {
      const response = await GET_WALLETS({
        query,
        ...walletService.options,
      });
      if (response) {
        setWalletService({
          ...walletService,
          data: response.wallets,
          loading: false,
          error: false,
          count: response.count,
        });
      }
    } catch (error) {
      setWalletService({
        ...walletService,
        data: [],
        loading: false,
        error: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [walletService.options, query]);

  useEffect(() => {
    if (walletService.data) {
      let leafs = [];
      for (let index = 0; index < walletService.data.length; index++) {
        var strLeaf = String(walletService.data[index].leaf).substring(
          0,
          String(walletService.data[index].leaf).length - 1
        );
        var leaf = {
          walletAddress: walletService.data[index].address,
          leafAddress: BigInt(strLeaf.toString(16)),
        };
        leafs.push(leaf);
      }
      setLeafs(leafs);
    }
  }, [walletService.data]);

  const pairHash = (a, b) =>
    BigInt(ethers.utils.keccak256("0x" + (a ^ b).toString(16).padStart(64, 0)));

  const oneLevelUp = (inputArray) => {
    var result = [];
    var inp = [...inputArray];
    if (inp.length % 2 === 1) inp.push(empty);
    for (var i = 0; i < inp.length; i += 2)
      result.push(pairHash(inp[i], inp[i + 1]));
    return result;
  };

  const convertLeaf = (leafs) => {
    let blobLeafs = [];

    for (let index = 0; index < leafs.length; index++) {
      const leaf = leafs[index].leafAddress;
      blobLeafs.push(leaf);
    }
    return blobLeafs;
  };

  const merkleRoot = () => {
    var result;
    result = [...leafs];
    while (result.length > 1) result = oneLevelUp(result);
    setMerkleRootResult(result);
    alert("Initialized");
  };

  const getMerkleProof = (inputArray, n) => {
    var result = [],
      currentLayer = [...inputArray],
      currentN = n;
    while (currentLayer.length > 1) {
      if (currentLayer.length % 2) currentLayer.push(empty);
      result.push(
        currentN % 2 ? currentLayer[currentN - 1] : currentLayer[currentN + 1]
      );
      currentN = Math.floor(currentN / 2);
      currentLayer = oneLevelUp(currentLayer);
    }

    return result;
  };

  const processProof = async () => {
    function oneLevelUp(inputArray) {
      var result = [];
      var inp = [...inputArray];
      if (inp.length % 2 === 1) inp.push(empty);
      for (var i = 0; i < inp.length; i += 2)
        result.push(pairHash(inp[i], inp[i + 1]));
      return result;
    }

    function getMerkleProof(inputArray, n) {
      var result = [],
        currentLayer = [...inputArray],
        currentN = n;
      while (currentLayer.length > 1) {
        if (currentLayer.length % 2) currentLayer.push(empty);
        result.push(
          currentN % 2 ? currentLayer[currentN - 1] : currentLayer[currentN + 1]
        );
        currentN = Math.floor(currentN / 2);
        currentLayer = oneLevelUp(currentLayer);
      }

      return result;
    }

    function pairHash(a, b) {
      return BigInt(
        ethers.utils.keccak256("0x" + (a ^ b).toString(16).padStart(64, 0))
      );
    }

    const newLeafs = convertLeaf(leafs);

    if (newLeafs.length > 0) {
      let willPush = [];
      for (let index = 0; index < newLeafs.length; index++) {
        let proofs = await getMerkleProof(newLeafs, index);
        willPush.push({
          walletAddress: leafs[index].walletAddress,
          proofs,
        });
      }
      let newWillPush = [];

      for (let index = 0; index < willPush.length; index++) {
        var willItem = willPush[index];
        var newProofs = [];
        for (
          let proofIndex = 0;
          proofIndex < willItem.proofs.length;
          proofIndex++
        ) {
          var proof = String(willItem.proofs[proofIndex]);
          newProofs.push(proof);
        }
        willItem.proofs = newProofs;
        newWillPush.push(willItem);
      }
      await CREATE_PROOFS(newWillPush);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="">
          <h1 className="display-3 text-center mb-5">
            WALLETS {walletService.count ? ": " + walletService.count : null}
          </h1>
          {walletService.error ? (
            <h3>Error!</h3>
          ) : (
            <>
              {walletService.loading && <h2>Loading...</h2>}

              <div
                className="d-flex align-items-center justify-content-center mb-5"
                style={{ gap: 12 }}
              >
                <button
                  onClick={() => {
                    setWalletService({
                      ...walletService,
                      options: {
                        ...walletService.options,
                        skip: Number(walletService.options.skip) - 100,
                      },
                    });
                  }}
                  className={`btn btn-dark ${
                    walletService.options.skip <= 0 ? "disabled" : ""
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    setWalletService({
                      ...walletService,
                      options: {
                        ...walletService.options,
                        skip: Number(walletService.options.skip) + 100,
                      },
                    });
                  }}
                  className={`btn btn-dark ${
                    walletService.data.length < 100 ? "disabled" : ""
                  }`}
                >
                  Next
                </button>
                <button className={`btn btn-dark`} onClick={merkleRoot}>
                  Merkle Root
                </button>
                <button className={`btn btn-dark`} onClick={processProof}>
                  Process Proof
                </button>
              </div>
              <form className="mb-5">
                <div className="form-group">
                  <input
                    className="form-control"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Type some text"
                  />
                </div>
              </form>
              <table class="table">
                <thead class="thead-dark bg-dark text-white">
                  <tr className="text-center">
                    <th
                      scope="col text-center"
                      style={{
                        paddingTop: "1.2rem",
                        paddingBottom: "1.2rem",
                      }}
                    >
                      #
                    </th>
                    <th
                      scope="col text-center"
                      style={{
                        paddingTop: "1.2rem",
                        paddingBottom: "1.2rem",
                      }}
                    >
                      Address
                    </th>
                    <th
                      scope="col text-center"
                      style={{
                        paddingTop: "1.2rem",
                        paddingBottom: "1.2rem",
                      }}
                    >
                      Total Gas Fee
                    </th>
                    <th
                      scope="col text-center"
                      style={{
                        paddingTop: "1.2rem",
                        paddingBottom: "1.2rem",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {walletService.data.length > 0 &&
                    !walletService.loading &&
                    walletService.data.map((data, idx) => (
                      <tr key={idx} className="text-center">
                        <th
                          className="border"
                          style={{
                            paddingTop: "1.2rem",
                            paddingBottom: "1.2rem",
                          }}
                          scope="row"
                        >
                          {idx + 1}
                        </th>
                        <td
                          className="border"
                          style={{
                            paddingTop: "1.2rem",
                            paddingBottom: "1.2rem",
                          }}
                        >
                          <i
                            onClick={() => copyText(data.address)}
                            className="fas fa-clone me-2 cursor-pointer"
                          ></i>
                          {shortenWalletAddress(data.address)}
                        </td>
                        <td
                          className="border"
                          style={{
                            paddingTop: "1.2rem",
                            paddingBottom: "1.2rem",
                          }}
                        >
                          {data.totalGas}
                        </td>
                        <td
                          className="border"
                          style={{
                            paddingTop: "1.2rem",
                            paddingBottom: "1.2rem",
                          }}
                        >
                          {data.amount}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

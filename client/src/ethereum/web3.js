import $ from "jquery";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3";
function multiply(x, y) {
  var prod = [];
  var i;
  for (i = 0; i < x.length; i++) {
    prod[i] = x[i] * y[i];
  }

  return prod;
}

function formatter(num) {
  return num > 999999 ? (num / 1e6).toFixed(3) + " million" : num;
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );

  return vars;
}

function comma(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
}

export async function getTxs(address) {
  const chainConfig = [];

  chainConfig["0x1"] = {
    id: "0x1",
    shortname: "eth",
    name: "Ethereum",
    symbol: "eth",
    coingecko_name: "ethereum",
    token: "Ξ",
    color: "#03a9f4",
    explorer_uri: "https://api.etherscan.io",
    key: "KKEHS5KMBY8KJSTBKUXRT9X33NZUNDPSHD",
  };
  chainConfig["0x38"] = {
    id: "0x38",
    shortname: "bsc",
    name: "Binance Smart Chain",
    symbol: "bnb",
    coingecko_name: "binancecoin",
    token: "Ḇ",
    color: "#f4ce03",
    explorer_uri: "https://api.bscscan.com",
    key: "UWB7YUCVQXT7TGFK41TNJSJBIHDQ1JGU9D",
  };
  chainConfig["0x64"] = {
    id: "0x64",
    shortname: "xdai",
    name: "xDai",
    symbol: "xdai",
    coingecko_name: "xdai",
    token: "Ẍ",
    color: "#48a9a6",
    explorer_uri: "https://blockscout.com/xdai/mainnet",
    key: "",
  };
  chainConfig["0x89"] = {
    id: "0x89",
    shortname: "matic",
    name: "Polygon",
    symbol: "matic",
    coingecko_name: "matic-network",
    token: "M̃",
    color: "#9d03f4",
    explorer_uri: "https://api.polygonscan.com",
    key: "QDPWKASEUSSYTKX9ZVMSSQGX4PTCZGHNC8",
  };
  chainConfig["0xfa"] = {
    id: "0xfa",
    shortname: "ftm",
    name: "Fantom",
    symbol: "ftm",
    coingecko_name: "fantom",
    token: "ƒ",
    color: "#00dbff",
    explorer_uri: "https://api.ftmscan.com",
    key: "B5UU3GDR3VJYVXFYT6RPK5RA6I8J5CV6B3",
  };

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (!chainId in chainConfig) {
    let authorizedNetworks = "";
    for (const [key, network] of Object.entries(chainConfig)) {
      authorizedNetworks += network.name + ", ";
    }
    authorizedNetworks += "[...]";

    console.log(
      "ChainId " +
        chainId +
        " is not supported. Select a valid network (Like " +
        authorizedNetworks +
        ")."
    );
    console.log("please select a valid network => ", authorizedNetworks);
    return;
  }

  let coingeckoSymbol = chainConfig[chainId].coingecko_name;
  let tokenusd = {
    binancecoin: {
      usd: 451.79,
    },
  };

  /*
  await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
      coingeckoSymbol +
      "&vs_currencies=usd"
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("(â•¯Â°â–¡Â°)â•¯ï¸µ â”»â”â”»", err);
    });
  */

  tokenusd = tokenusd[coingeckoSymbol].usd;
  let key = chainConfig[chainId].key;
  let u =
    chainConfig[chainId].explorer_uri +
    `/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc`;
  if (chainConfig[chainId].key) {
    u += `&apikey=${key}`;
  }
  let response = await fetch(u);

  if (response.ok) {
    // if HTTP-status is 200-299
    var json = await response.json();
  } else {
    console.error("HTTP-Error: " + response.status);
  }

  let txs = json["result"];
  let n = txs.length;
  let from, txs2;

  while (n === 10000) {
    from = txs[txs.length - 1].blockNumber;
    u =
      chainConfig[chainId].explorer_uri +
      `/api?module=account&action=txlist&address=${address}&startblock=${from}&endblock=99999999&sort=asc&apikey=${key}`;
    response = await fetch(u);

    if (response.ok) {
      // if HTTP-status is 200-299
      json = await response.json();
    } else {
      console.log("Â¯_(ãƒ„)_/Â¯ : " + response.status);
      break;
    }

    txs2 = json["result"];
    n = txs2.length;
    txs.push.apply(txs, txs2);
  }

  let txsOut = $.grep(txs, function (v) {
    return v.from === address.toLowerCase();
  });

  txsOut = txsOut.map(({ confirmations, ...item }) => item);
  txsOut = new Set(txsOut.map(JSON.stringify));
  txsOut = Array.from(txsOut).map(JSON.parse);
  // remove duplicates
  //localStorage.setItem('txsOut', JSON.stringify(txsOut));
  console.log("All outgoing txs:", txsOut);

  var nOut = txsOut.length;
  console.log("comma(nOut) =>", comma(nOut));
  var txsOutFail = $.grep(txsOut, function (v) {
    return v.isError === "1";
  });
  var nOutFail = txsOutFail.length;
  console.log("comma(nOutFail) => ", comma(nOutFail));
  console.log("Failed outgoing txs:", txsOutFail);

  if (nOut > 0) {
    var gasUsed = txsOut.map((value) => parseInt(value.gasUsed));
    var normalGasUsedTotal = gasUsed.reduce(
      (partial_sum, a) => partial_sum + a,
      0
    );
    var gasUsedTotal = gasUsed.reduce((partial_sum, a) => partial_sum + a, 0);
    var gasPrice = txsOut.map((value) => parseInt(value.gasPrice));
    var gasPriceMin = Math.min(...gasPrice);
    var gasPriceMax = Math.max(...gasPrice);
    var gasFee = multiply(gasPrice, gasUsed);

    var normalGasFeeTotal = gasFee.reduce(
      (partial_sum, a) => partial_sum + a,
      0
    );
    var gasFeeTotal = gasFee.reduce((partial_sum, a) => partial_sum + a, 0);

    var gasPriceTotal = gasPrice.reduce((partial_sum, a) => partial_sum + a, 0);
    var gasUsedFail = txsOutFail.map((value) => parseInt(value.gasUsed));
    var gasPriceFail = txsOutFail.map((value) => parseInt(value.gasPrice));

    var gasFeeFail = multiply(gasPriceFail, gasUsedFail);

    var normalGasFeeTotalFail = gasFeeFail.reduce(
      (partial_sum, a) => partial_sum + a,
      0
    );

    var gasFeeTotalFail = gasFeeFail.reduce(
      (partial_sum, a) => partial_sum + a,
      0
    );

    console.log("gasUsedTotal => ", comma(formatter(gasUsedTotal)));
    gasUsedTotal = comma(formatter(gasUsedTotal));
    var gasPricePerTx = comma((gasPriceTotal / nOut / 1e9).toFixed(1));

    gasFeeTotal = comma((gasFeeTotal / 1e18).toFixed(3));

    console.log(
      "gasFeeTotal => ",
      chainConfig[chainId].token + comma((gasFeeTotal / 1e18).toFixed(10))
    );

    if (nOutFail > 0) {
      gasFeeTotalFail = (gasFeeTotalFail / 1e18).toFixed(10);
      console.log(
        "gasFeeTotalFail => ",
        chainConfig[chainId].token + (gasFeeTotalFail / 1e18).toFixed(10)
      );
      var oof = Math.max(...gasFeeFail) / 1e18;

      if (oof > 0.1) {
        var i = gasFeeFail.reduce(
          (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
          0
        );
        var tx = txsOutFail[i];
        $(
          '<p><a id="oof" href="https://bscscan.com/tx/' +
            tx.hash +
            '">This one</a> cost <span id="oofCost">' +
            chainConfig[chainId].token +
            (gasFeeFail[i] / 1e18).toFixed(10) +
            "</span>.</p>"
        ).insertBefore($("#tipsy"));
      }
    } else {
      console.log("gasFeeTotalFail > ", "nothing");
      gasFeeTotalFail = "nothing";
    }

    if (tokenusd !== null) {
      tokenusd = comma(formatter((tokenusd * gasFeeTotal).toFixed(5)));

      console.log(
        "oofCost few => ",
        comma(formatter((tokenusd * gasFeeFail[i]).toFixed(2)))
      );
    }
  } else {
    gasUsedTotal = 0;
    gasFeeTotal = 0;
  }

  return {
    chain: chainConfig[chainId],
    nOut,
    nOutFail,
    gasUsedTotal,
    gasFeeTotal,
    tokenusd,
    gasPricePerTx,
    gasFeeTotalFail,
    txsOut,
    txsOutFail,
    normal: {
      normalGasFeeTotal: isNaN(normalGasFeeTotal) ? 0 : normalGasFeeTotal,
      normalGasFeeTotalFail: isNaN(normalGasFeeTotalFail)
        ? 0
        : normalGasFeeTotalFail,
      normalGasUsedTotal: isNaN(normalGasUsedTotal) ? 0 : normalGasUsedTotal,
      normalTxsOut: txsOut.length,
      normalTxsOutFail: txsOutFail.length,
    },
  };
}
export const isConnected = () => {
  if (
    localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") == '"walletconnect"' &&
    localStorage.getItem("walletconnect")
  ) {
    return true;
  } else if (
    localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") == '"injected"'
  ) {
    return true;
  } else {
    return false;
  }
};
export const getWeb3 = async () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: "https://bsc-dataseed.binance.org/",
        },
        qrcodeModalOptions: {
          mobileLinks: ["metamask", "trust"],
        },
      },
    },
  };
  let web3Modal = new Web3Modal({
    network: "binance",
    cacheProvider: true,
    providerOptions,
    theme: {
      background: "rgb(39, 49, 56)",
      main: "rgb(199, 199, 199)",
      secondary: "rgb(136, 136, 136)",
      border: "rgba(195, 195, 195, 0.14)",
      hover: "rgb(16, 26, 32)",
    },
  });

  try {
    let provider = await web3Modal.connect();
    return {
      wallet: {
        provider: provider,
        instance: new Web3(provider),
        walletAddress: provider.selectedAddress,
        ethereumNetwork: provider.chainId,
      },
    };
  } catch (error) {
    return { wallet: null };
  }
};

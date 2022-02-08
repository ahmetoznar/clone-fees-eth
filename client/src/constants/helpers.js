import Web3 from "web3";
const ethers = require("ethers");
export const loadingAndRender = ({ wait, renderer }) => {
  if (wait) return renderer();
  else return <span>🤔</span>;
};

export const shortenWalletAddress = (walletAddress) => {
  return (
    walletAddress &&
    walletAddress.slice(0, 8) + "..." + walletAddress.slice(38, 42)
  );
};

export const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
};

export const initContract = async ({
  address,
  abi,
  provider,
  _interface = false,
}) => {
  let rpc = "https://bsc-dataseed.binance.org/";
  var provider = null;
  if (window.ethereum) {
    provider = window.ethereum;
  } else {
    const stateProvider = provider;
    if (stateProvider) {
      provider = stateProvider;
    } else {
      provider = await new Web3.providers.HttpProvider(rpc);
    }
  }

  if (provider) {
    var web3 = new Web3(provider);
    if (_interface) {
      const response = new web3.eth.Contract(JSON.parse(abi), address);
      return response;
    } else {
      const response = new web3.eth.Contract(abi, address);
      return response;
    }
  }
};

var empty = 1;
export const pairHash = (a, b) => {
  return BigInt(
    ethers.utils.keccak256("0x" + (a ^ b).toString(16).padStart(64, 0))
  );
};

const oneLevelUp = (inputArray) => {
  var result = [];
  var inp = [...inputArray]; // To avoid over writing the input

  // Add an empty value if necessary (we need all the leaves to be
  // paired)
  if (inp.length % 2 === 1) inp.push(empty);

  for (var i = 0; i < inp.length; i += 2)
    result.push(pairHash(inp[i], inp[i + 1]));

  return result;
}; // oneLevelUp

const getMerkleProof = (inputArray, n) => {
  var result = [],
    currentLayer = [...inputArray],
    currentN = n;

  // Until we reach the top
  while (currentLayer.length > 1) {
    // No odd length layers
    if (currentLayer.length % 2) currentLayer.push(empty);

    result.push(
      currentN % 2
        ? // If currentN is odd, add the value before it
          currentLayer[currentN - 1]
        : // If it is even, add the value after it
          currentLayer[currentN + 1]
    );

    // Move to the next layer up
    currentN = Math.floor(currentN / 2);
    currentLayer = oneLevelUp(currentLayer);
  } // while currentLayer.length > 1

  return result;
}; // getMerkleProof

import axios from "../services/axios";

export const GET_WALLETS = async (options) => {
  var url = "";
  if (options.query !== "")
    url = `wallet?q=${options.query}&skip=${options.skip}&take=${options.take}`;
  else url = `wallet?skip=${options.skip}&take=${options.take}`;
  const { data } = await axios.get(url, {
    headers: {
      Authorization: localStorage.getItem("Authorization") || null,
    },
  });
  return data;
};

export const GET_WALLET = async ({ walletAddress }) => {
  const { data } = await axios.get(`wallet/${walletAddress}`, {
    headers: {
      Authorization: localStorage.getItem("Authorization") || null,
    },
  });
  return data;
};

export const CREATE_PROOFS = async (willPush) => {
  const { data } = await axios.post(
    `wallet/create/proofs`,
    {
      data: willPush,
    },
    {
      headers: {
        Authorization: localStorage.getItem("Authorization") || null,
      },
    }
  );
  return data;
};
export const GET_WALLET_COUNT = async () => {
  const { data } = await axios.get(`wallet/count`, {
    headers: {
      Authorization: localStorage.getItem("Authorization") || null,
    },
  });
  return data;
};

export const LOGIN_WALLET = async (walletAddress) => {
  const { data } = await axios.post(
    `wallet/login`,
    {
      walletAddress,
    },
    {
      headers: {
        Authorization: localStorage.getItem("Authorization") || null,
      },
    }
  );
  return data;
};

export const CREATE_WALLET = async ({ wallet, proofs }) => {
  console.log(localStorage.getItem("Authorization"), "token")
  const { data } = await axios.post(
    `wallet`,
    {
      wallet,
      proofs,
    },
    {
      headers: {
        Authorization: localStorage.getItem("Authorization") || null,
      },
    }
  );
  return data;
};

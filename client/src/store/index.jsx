import WalletProvider from "./wallet.provider";

export default function Store(props) {
  return (
    <>
      <WalletProvider>{props.children}</WalletProvider>
    </>
  );
}

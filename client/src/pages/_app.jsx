import "../assets/styles/app.scss";
import Store from "../store";
export default function App({ Component, ...pageProps }) {
  return (
    <Store>
      <Component {...pageProps} />
    </Store>
  );
}

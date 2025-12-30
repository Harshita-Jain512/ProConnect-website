import { Provider } from "react-redux";   // ✅ MISSING IMPORT
import store from "@/config/redux/store"; // ✅ make sure path is correct

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

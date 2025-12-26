import "@/styles/globals.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/config/redux/store";
import { useEffect } from "react";
import { getAboutUser } from "@/config/redux/action/authAction";

function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getAboutUser({ token }));
    }
  }, [dispatch]);

  return children;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AppInitializer>
        <Component {...pageProps} />
      </AppInitializer>
    </Provider>
  );
}

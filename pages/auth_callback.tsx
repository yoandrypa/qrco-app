import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";
import Context from "../components/context/Context";
import { useContext } from "react";

const Auth_Callback = () => {
  // @ts-ignore
  const { setLoading } = useContext(Context);
  setLoading(true);
  const router = useRouter();
  // @ts-ignore
  const route = JSON.parse(getCookie("final_callback_path")) || { pathname: "/", query: {} };
  router.push(route, route.pathname).then(() => {
    //deleteCookie("final_callback_path");
    setLoading(false);
  });
};

export default Auth_Callback;

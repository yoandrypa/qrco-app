import {useRouter} from "next/router";
import {deleteCookie, getCookie} from "cookies-next";
import Context from "../components/context/Context";
import {useContext, useEffect} from "react";

const Auth_Callback = () => {
  // @ts-ignore
  const { setLoading } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    // @ts-ignore
    const route = JSON.parse(getCookie("final_callback_path")) || '/';

    router.push(route, route.pathname || '/').then(() => {
      deleteCookie("final_callback_path");
      setLoading(false);
    });
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return <div />;
};

export default Auth_Callback;

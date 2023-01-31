import {useRouter} from "next/router";
import session from "@ebanux/ebanux-utils/sessionStorage";
import Context from "../components/context/Context";
import {useContext, useEffect} from "react";

const AuthCallback = () => {
  // @ts-ignore
  const {setLoading} = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    // @ts-ignore
    const route = session.get('CALLBACK_ROUTER', '/');

    if (route.query?.address?.length === 0) {
      delete route.query.address;
    }

    router.push(route, route.pathname || '/').then(() => {
      session.del('CALLBACK_ROUTER');
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div />;
};

export default AuthCallback;

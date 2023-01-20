import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Context from "./Context";
import { initialBackground, initialData, initialFrame } from "../../helpers/qr/data";
import { BackgroundType, CornersAndDotsType, DataType, FramesType, OptionsType } from "../qr/types/types";
import { DEFAULT_DYNAMIC_SELECTED, DEFAULT_STATIC_SELECTED, PARAM_QR_TEXT, QR_CONTENT_ROUTE, QR_DESIGN_ROUTE,
  QR_DETAILS_ROUTE, QR_TYPE_ROUTE } from "../qr/constants";
import AppWrapper from "../AppWrapper";
import { dataCleaner, getBackgroundObject, getCornersAndDotsObject, getFrameObject, handleInitialData } from "../../helpers/qr/helpers";
import { create, get } from "../../handlers/users";

// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";
// @ts-ignore
import cookies from "@ebanux/ebanux-utils/cookiesStorage";

const Loading = dynamic(() => import("../Loading"));
const PleaseWait = dynamic(() => import("../PleaseWait"));
const Generator = dynamic(() => import("../qr/Generator"));

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<OptionsType>(handleInitialData("Ebanux"));
  const [cornersData, setCornersData] = useState<CornersAndDotsType>(null);
  const [dotsData, setDotsData] = useState<CornersAndDotsType>(null);
  const [background, setBackground] = useState<BackgroundType>(initialBackground);
  const [frame, setFrame] = useState<FramesType>(initialFrame);
  const [data, setData] = useState<DataType>(initialData);
  const [isTrialMode, setIsTrialMode] = useState<boolean>(false);

  const [selected, setSelected] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState(null);
  const [verifying, setVerifying] = useState<boolean>(true);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);

  const doneInitialRender = useRef<boolean>(false);
  const forbidClear = useRef<boolean>(false);

  const router = useRouter();

  const isUserInfo = useMemo(() => userInfo !== null, [userInfo]);

  const doNotClear = useCallback(() => {
    forbidClear.current = true;
  }, []);

  const resetSelected = useCallback(() => {
    setSelected(data?.isDynamic ? DEFAULT_DYNAMIC_SELECTED : DEFAULT_STATIC_SELECTED);
  }, [data?.isDynamic]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearData = useCallback((keepType?: boolean, doNot?: boolean, takeAwaySelection?: boolean, claim?: string) => {
    if (!keepType || doNot || takeAwaySelection) {
      resetSelected();
    }
    setBackground(initialBackground);
    setFrame(initialFrame);
    setDotsData(null);
    setCornersData(null);
    setIsWrong(false);
    setLoading(false);
    setOptions(handleInitialData("Ebanux"));

    let newData: DataType;
    if (!keepType || data?.isDynamic) {
      newData = initialData;
    } else {
      newData = {};
    }

    if (claim) {
      newData.claim = claim;
    }

    setData(newData);
  }, [data?.isDynamic, data?.mode, data?.claim]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (doneInitialRender.current && options.mode === undefined) {
      if (!forbidClear.current) {
        clearData(true, false,  false, data.claim);
      } else {
        forbidClear.current = false;
      }
    }
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (doneInitialRender.current && options?.mode !== "edit") {
      resetSelected();
    }
  }, [data?.isDynamic]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading) { setLoading(false); }
    if (redirecting) { setRedirecting(false); }
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isUserInfo && verifying) {
      setVerifying(false);
    }
  }, [isUserInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (options.mode === "edit") {
      setCornersData(getCornersAndDotsObject(options, "corners"));
      setDotsData(getCornersAndDotsObject(options, "cornersDot"));
      setBackground(getBackgroundObject(options) || initialBackground);
      setFrame(getFrameObject(options) || initialFrame);
      setData(dataCleaner(options));
      setOptions(dataCleaner(options, true)); // @ts-ignore
      setSelected(options.qrType);
    }
  }, [options.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const userCreation = async (id: string) => {
      try {
        const user = await get(id);
        if (!user) {
          await create({ id });
        }
      } catch {
        console.log("Error accessing user.");
      }
    };

    try {
      const userData = session.currentAccount;
      setUserInfo(userData);

      if (userData) {
        userCreation(userData.cognito_user_id);
      }
    } catch {
      setUserInfo(null);
      setVerifying(false);
    }
    doneInitialRender.current = true;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    const params = { logout_uri: session.appBaseUrl, client_id: session.appClientId };
    const queryString = Object.keys(params).map((key) => { // @ts-ignore
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join("&");
    session.del("credentials");
    session.del("account");
    cookies.del("account");
    window.location.href = `${process.env.REACT_APP_OAUTH_LOGOUT_URL || ""}?${queryString}`;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (router.pathname.startsWith("/qr") && ![QR_TYPE_ROUTE, QR_CONTENT_ROUTE, QR_DESIGN_ROUTE, QR_DETAILS_ROUTE]
    .includes(router.pathname)) {
    return <>{children}</>;
  }

  const renderContent = () => {
    if (router.pathname === "/" && router.query[PARAM_QR_TEXT] !== undefined) {
      const qrText = router.query[PARAM_QR_TEXT] as string;
      if (qrText !== undefined && qrText.length) {
        return (
          <AppWrapper>
            <Generator forceOverride={qrText} />
          </AppWrapper>
        );
      }
    } else {
      return (
        <AppWrapper setIsFreeMode={setIsTrialMode} handleLogout={logout} clearData={clearData} setLoading={setLoading}
          mode={data.mode} setRedirecting={setRedirecting} isTrialMode={isTrialMode} userInfo={userInfo}>
          {loading && <Loading />}
          {!redirecting ? children : <PleaseWait redirecting hidePleaseWait />}
        </AppWrapper>
      );
    }
  };

  if (verifying) {
    return <PleaseWait />
  }

  return (
    <Context.Provider value={{
      cornersData, setCornersData, dotsData, setDotsData, frame, setFrame, background, setBackground,
      options, setOptions, selected, setSelected, data, setData, isTrialMode, userInfo,
      clearData, loading, setLoading, setRedirecting, isWrong, setIsWrong, doNotClear
    }}>
      {renderContent()}
    </Context.Provider>
  );
};

export default AppContextProvider;

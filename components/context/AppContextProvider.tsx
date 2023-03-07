import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Context from "./Context";
import { initialBackground, initialData, initialFrame } from "../../helpers/qr/data";
import { BackgroundType, CornersAndDotsType, DataType, FramesType, OptionsType } from "../qr/types/types";
import {
  DEFAULT_DYNAMIC_SELECTED, DEFAULT_STATIC_SELECTED, PARAM_QR_TEXT, QR_CONTENT_ROUTE, QR_DESIGN_ROUTE,
  QR_DETAILS_ROUTE, QR_TYPE_ROUTE
} from "../qr/constants";
import AppWrapper from "../AppWrapper";
import { dataCleaner, getBackgroundObject, getCornersAndDotsObject, getFrameObject, handleInitialData } from "../../helpers/qr/helpers";

import session from "@ebanux/ebanux-utils/sessionStorage";
import { logout } from '@ebanux/ebanux-utils/auth';

import { startWaiting, releaseWaiting } from "../Waiting";
import { isBrowser } from "@ebanux/ebanux-utils/utils";

const Claimer = dynamic(() => import("../claimer/Claimer"));
const Generator = dynamic(() => import("../qr/Generator"));
const PleaseWait = dynamic(() => import("../PleaseWait"));
const UpdateBrowser = dynamic(() => import("../UpdateBrowser"));

const contextCache: any = isBrowser() ? session.get('CONTEXT', {}, true) : {};

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<OptionsType>(handleInitialData("Ebanux"));
  const [cornersData, setCornersData] = useState<CornersAndDotsType>(null);
  const [dotsData, setDotsData] = useState<CornersAndDotsType>(null);
  const [background, setBackground] = useState<BackgroundType>(initialBackground);
  const [frame, setFrame] = useState<FramesType>(initialFrame);
  const [data, setData] = useState<DataType>(contextCache.data || initialData);
  const [isTrialMode, setIsTrialMode] = useState<boolean>(false);
  const [updateBrowser, setUpdateBrowser] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(contextCache.selected || null);
  const [userInfo, setUserInfo] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [verifying, setVerifying] = useState<boolean>(true);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const [loading, setHandleLoading] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);

  const doneInitialRender = useRef<boolean>(false);
  const forbidClear = useRef<boolean>(false);

  const router = useRouter();

  const isUserInfo = useMemo(() => userInfo !== null, [userInfo]);

  function setLoading(value: boolean) {
    value ? startWaiting() : releaseWaiting();
    setHandleLoading(value);
  }

  const doNotClear = useCallback(() => {
    forbidClear.current = true;
  }, []);

  const resetSelected = useCallback(() => {
    setSelected(data?.isDynamic ? DEFAULT_DYNAMIC_SELECTED : DEFAULT_STATIC_SELECTED);
  }, [data?.isDynamic]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearData = useCallback((keepType?: boolean, doNot?: boolean, takeAwaySelection?: boolean, claim?: string, claimable?: boolean, preGenerated?: boolean) => {
    if (!keepType || doNot || takeAwaySelection) {
      resetSelected();
    }
    setBackground(structuredClone(initialBackground));
    setFrame(structuredClone(initialFrame));
    setDotsData(null);
    setCornersData(null);
    setIsWrong(false);
    setOptions(handleInitialData("Ebanux"));

    setData(() => {
      let newData: DataType;

      if (!keepType || data?.isDynamic) {
        newData = structuredClone(initialData);
      } else {
        newData = {};
      }

      if (claim !== undefined) {
        newData.claim = claim;
      }

      if (claimable !== undefined) {
        newData.claimable = claimable;
      }

      if (preGenerated !== undefined) {
        newData.preGenerated = preGenerated;
      }

      return newData;
    });
  }, [data?.isDynamic, data?.mode, data?.claim, data?.claimable, data?.preGenerated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (doneInitialRender.current && options.mode === undefined && router.pathname === QR_TYPE_ROUTE) {
      if (!forbidClear.current) {
        clearData(true, false, false, data.claim, data.claimable, data.preGenerated);
      } else {
        forbidClear.current = false;
      }
    }
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (doneInitialRender.current && !["edit", "clone"].includes(options?.mode || '')) {
      resetSelected();
    }
  }, [data?.isDynamic]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (redirecting) {
      setRedirecting(false);
    }
    if (router.pathname === '/') {
      clearData(true);
    }
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isUserInfo && verifying) {
      setVerifying(false);
    }
  }, [isUserInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (["edit", "clone"].includes(options?.mode || '')) {
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
    setUserInfo(session.currentUser);

    doneInitialRender.current = true;

    if (!structuredClone) {
      setUpdateBrowser(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (updateBrowser) {
    return <UpdateBrowser/>;
  }

  if (verifying || !data) {
    return <PleaseWait/>;
  }

  if (router.pathname.startsWith("/qr") && ![QR_TYPE_ROUTE, QR_CONTENT_ROUTE, QR_DESIGN_ROUTE, QR_DETAILS_ROUTE]
    .includes(router.pathname)) {
    return <>{children}</>;
  }

  const renderContent = () => {
    if (router.pathname.startsWith('/claim')) {
      return <Claimer code={(router.query.code || '') as string}/>;
    }
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
        <AppWrapper setIsFreeMode={setIsTrialMode} handleLogout={logout} clearData={clearData}
                    mode={data.mode} setRedirecting={setRedirecting} isTrialMode={isTrialMode} userInfo={userInfo}>
          {!redirecting ? children : <PleaseWait redirecting hidePleaseWait />}
        </AppWrapper>
      );
    }
  };

  return (
    <Context.Provider value={{
      cornersData, setCornersData, dotsData, setDotsData, frame, setFrame, background, setBackground,
      options, setOptions, selected, setSelected, data, setData, isTrialMode, userInfo,
      clearData, loading, setLoading, setRedirecting, isWrong, setIsWrong, doNotClear,
      subscription, setSubscription, setUserInfo
    }}>
      {renderContent()}
    </Context.Provider>
  );
};

export default AppContextProvider;

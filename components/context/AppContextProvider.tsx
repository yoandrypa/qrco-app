import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/router";

import { Amplify, Auth } from "aws-amplify";

import Context from "./Context";
import { initialData, initialBackground, initialFrame } from "../../helpers/qr/data";
import { BackgroundType, CornersAndDotsType, DataType, FramesType, OptionsType } from "../qr/types/types";
import { PARAM_QR_TEXT, QR_CONTENT_ROUTE, QR_DESIGN_ROUTE, QR_DETAILS_ROUTE, QR_TYPE_ROUTE } from "../qr/constants";
import AppWrapper from "../AppWrapper";
import awsExports from "../../libs/aws/aws-exports";
import PleaseWait from "../PleaseWait";
import Generator from "../qr/Generator";
import Loading from "../Loading";
import {
  dataCleaner,
  getBackgroundObject,
  getCornersAndDotsObject,
  getFrameObject,
  handleInitialData
} from "../../helpers/qr/helpers";

Amplify.configure(awsExports);

interface ContextProps {
  children: ReactNode;
}

const AppContextProvider = (props: ContextProps) => {
  const { children } = props;

  const [options, setOptions] = useState<OptionsType>(handleInitialData("Ebanux"));
  const [cornersData, setCornersData] = useState<CornersAndDotsType>(null);
  const [dotsData, setDotsData] = useState<CornersAndDotsType>(null);
  const [background, setBackground] = useState<BackgroundType>(initialBackground);
  const [frame, setFrame] = useState<FramesType>(initialFrame);
  const [data, setData] = useState<DataType>(initialData);
  const [isTrialMode, setIsTrialMode] = useState<boolean>(false);

  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);

  const [userInfo, setUserInfo] = useState(null);
  const [verifying, setVerifying] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);

  const doneInitialRender = useRef<boolean>(false);

  const router = useRouter();

  const isUserInfo = useMemo(() => userInfo !== null, [userInfo]);

  const clearData = useCallback((keepType?: boolean, doNot?: boolean, takeAwaySelection?: boolean) => {
    if (!keepType || doNot || takeAwaySelection) {
      setSelected(null);
    }
    setBackground(initialBackground);
    setFrame(initialFrame);
    setDotsData(null);
    setCornersData(null);
    setIsWrong(false);
    setLoading(false);
    setStep(0);
    setOptions(handleInitialData("Ebanux"));

    let newData: DataType;
    if (!keepType || data.isDynamic) {
      newData = initialData;
    } else {
      newData = {};
    }

    setData(newData);
  }, [data?.isDynamic, data.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (doneInitialRender.current && options.mode === undefined) {
      clearData(true);
    }
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (doneInitialRender.current && options?.mode !== "edit") {
      setSelected(null);
    }
  }, [data?.isDynamic]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isUserInfo && verifying) {
      setVerifying(false);
    }
  }, [isUserInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const verify = async () => {
      try {
        const userData = await Auth.currentAuthenticatedUser();
        setUserInfo(userData);
      } catch {
        setUserInfo(null);
        setVerifying(false);
      }
    };
    verify();
    doneInitialRender.current = true;
  }, []);

  useEffect(() => {
    if (options.mode === "edit") {
      setCornersData(getCornersAndDotsObject(options, "corners"));
      setDotsData(getCornersAndDotsObject(options, "cornersDot"));
      setBackground(getBackgroundObject(options) || initialBackground);
      setFrame(getFrameObject(options) || initialFrame);
      setData(dataCleaner(options));
      setOptions(dataCleaner(options, true)); // @ts-ignore
      setSelected(options.qrType);
      setStep(options?.isDynamic ? 1 : 2);
    }
  }, [options.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await Auth.signOut();
      setUserInfo(null);
      clearData(false); // includes setLoading as false
      await router.replace("/");
    } catch (error) {
      setLoading(false);
      console.log("error signing out: ", error);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (router.pathname.startsWith("/qr") && ![QR_TYPE_ROUTE, QR_CONTENT_ROUTE, QR_DESIGN_ROUTE, QR_DETAILS_ROUTE].includes(router.pathname)) {
    return (<>{children}</>);
  }

  if (verifying) {
    return (<PleaseWait />);
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
        <AppWrapper userInfo={userInfo} handleLogout={logout} clearData={clearData} setLoading={setLoading}
                    isTrialMode={isTrialMode} setIsTrialMode={setIsTrialMode} mode={data.mode} step={step}>
          {children}
        </AppWrapper>
      );
    }
  };

  return (<>
      {loading && <Loading />}
      <Context.Provider value={{
        cornersData, setCornersData,
        dotsData, setDotsData,
        frame, setFrame,
        background, setBackground,
        options, setOptions,
        selected, setSelected,
        data, setData, isTrialMode,
        userInfo, setUserInfo,
        step, setStep, clearData,
        loading, setLoading,
        isWrong, setIsWrong
      }}>
        {renderContent()}
      </Context.Provider>
    </>
  );
};

export default AppContextProvider;

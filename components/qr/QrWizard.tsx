import { ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Context from "../context/Context";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { generateId, generateShortLink } from "../../utils";
import {DataType, OptionsType, ProcessHanldlerType} from "./types/types";
import { QR_CONTENT_ROUTE, QR_DESIGN_ROUTE, QR_TYPE_ROUTE } from "./constants";
import { getUuid } from "../../helpers/qr/helpers";

import { getStep, saveOrUpdate, steps, StepsProps } from "./auxFunctions";
import RenderNextButton from "./helperComponents/smallpieces/RenderNextButton";
import RenderBackButton from "./helperComponents/smallpieces/RenderBackButton";

const RenderFloatingButtons = dynamic(() => import("./helperComponents/smallpieces/RenderFloatingButtons"));
const RenderPreview = dynamic(() => import("./renderers/RenderPreview"));
const Notifications = dynamic(() => import("../notifications/Notifications"));
const ProcessHandler = dynamic(() => import( "./renderers/ProcessHandler"));

interface QrWizardProps {
  children: ReactNode;
}

const QrWizard = ({ children }: QrWizardProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [size, setSize] = useState<number>(0);
  const [forceDownload, setForceDownload] = useState<{ item: HTMLElement } | undefined>(undefined);
  const [, setUnusedState] = useState();

  // @ts-ignore
  const forceUpdate = useCallback(() => setUnusedState({}), []);
  const dataInfo = useRef<ProcessHanldlerType[]>([]);
  const btnRef = useRef<any>(null);
  const sizeRef = useRef<any>(null);
  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

  // @ts-ignore
  const {
    selected,
    data,
    setData,
    userInfo,
    options,
    frame,
    background,
    cornersData,
    dotsData,
    isWrong,
    loading,
    setOptions,
    setLoading,
    setRedirecting,
    clearData
  }: StepsProps = useContext(Context);

  const router = useRouter();

  const handleBack = () => {
    router.push(
      router.pathname === QR_DESIGN_ROUTE ? QR_CONTENT_ROUTE : QR_TYPE_ROUTE,
      undefined, { shallow: true }).then(() => setLoading(false));
  };

  const isLogged = Boolean(userInfo);

  const updatingHandler = (value: string | null, status?: boolean) => {
    if (value !== null) {
      dataInfo.current.push({ value });
    } else {
      dataInfo.current[dataInfo.current.length - 1].status = status;
    }
    forceUpdate();
  };

  const currentStep = useMemo(() => getStep(router.pathname),
    [router.pathname]);

  const lastStep = (goToList: boolean) => {
    const item = document.getElementById("qrCodeReferenceId");
    if (item) {
      setForceDownload({ item });
    } else {
      clearData();
      router.push(goToList ? "/" : QR_TYPE_ROUTE, undefined, { shallow: true }).
        then(() => setLoading(false));
    }
  };

  const handleSuccess = () => {
    if (data.claim !== undefined) {
      setData((prev: DataType) => {
        delete prev.claim;
        return data;
      });
    }
  }

  const handleNext = async () => {
    setLoading(true);
    if ([QR_TYPE_ROUTE, "/"].includes(router.pathname)) {
      if (data.isDynamic && !isLogged) {
        router.push({ pathname: QR_CONTENT_ROUTE, query: {selected}}).then(() => setLoading(false));
      } else {
        router.push(QR_CONTENT_ROUTE, undefined, {shallow: true}).then(() => setLoading(false));
      }
    } else if (router.pathname === QR_DESIGN_ROUTE && isLogged) {
      await saveOrUpdate(data, userInfo, options, frame, background, cornersData, dotsData, selected, setLoading, setIsError,
        handleSuccess, router, lastStep, dataInfo.current.length, updatingHandler);
    } else if (router.pathname === QR_DESIGN_ROUTE && !isLogged) {
      lastStep(false);
    } else {
      router.push(
        router.pathname === QR_TYPE_ROUTE ? QR_CONTENT_ROUTE : QR_DESIGN_ROUTE,
        undefined, { shallow: true }).then(() => setLoading(false));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (payload: IntersectionObserverEntry[]) => {
        setVisible(payload[0].isIntersecting || false);
      }, {
        root: document.querySelector("#scrollArea"),
        rootMargin: "0px",
        threshold: [0.3],
      });

    observer.observe(btnRef.current);
    setSize(sizeRef.current.offsetWidth);
    const getWidth = () => { setSize(sizeRef.current.offsetWidth); };
    window.addEventListener("resize", getWidth);

    if (router.pathname === QR_CONTENT_ROUTE && isLogged && data?.isDynamic &&
      !Boolean(options.id) && options.mode === undefined) {
      const genShortLinkAndId = async () => {
        const id = getUuid();
        const shortCode = router.query?.address || await generateId(); // @ts-ignore
        setOptions((prev: OptionsType) => ({
          ...prev,
          id,
          shortCode,
          claimable: data?.claimable || false,
          preGenerated: data?.preGenerated || false,
          data: generateShortLink(shortCode, process.env.REACT_APP_SHORT_URL_DOMAIN)
        }));
      };
      genShortLinkAndId();
    }

    return () => window.removeEventListener("resize", getWidth);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box ref={sizeRef} sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        pb: "10px",
        mb: "10px",
      }}>
        <RenderBackButton
          loading={loading}
          step={currentStep}
          handleBack={handleBack}
          editingStatic={!data.isDynamic && options.mode === 'edit'}
          selected={selected}/>
        <Stepper activeStep={currentStep} sx={{ width: "100%", my: 0 }}>
          {steps.map((label: string) => <Step key={label}>
            <StepLabel>{isWide ? label : ""}</StepLabel>
          </Step>)}
        </Stepper>
        <RenderNextButton
          handleNext={handleNext}
          isLogged={isLogged}
          loading={loading}
          step={currentStep}
          isWrong={isWrong}
          selected={selected}
          qrName={data?.qrName}/>
      </Box>
      <Box sx={{ position: "absolute", top: "32px" }} ref={btnRef}/>
      <Box sx={{ minHeight: "calc(100vh - 205}px)" }}>
        {children}
      </Box>
      {dataInfo.current.length ? <ProcessHandler
        process={dataInfo.current}
        handleCommand={(isError?: boolean) => {
          dataInfo.current = [];
          if (!isError) { // @ts-ignore
            setForceDownload({item: document.getElementById("qrCodeReferenceId")});
          } else {
            forceUpdate();
          }
        }
      }/> : null}
      {!loading && !visible && (
        <RenderFloatingButtons
          loading={loading}
          step={currentStep}
          isLogged={isLogged}
          qrName={data?.qrName}
          isWrong={isWrong}
          editingStatic={!data.isDynamic && options.mode === 'edit'}
          handleBack={handleBack}
          handleNext={handleNext}
          size={size}
          selected={selected}/>
      )}
      {forceDownload !== undefined && (
        <RenderPreview
          avoidDuplicate
          externalDesign={forceDownload?.item}
          externalFrame={frame}
          handleDone={async () => {
            setForceDownload(undefined);
            setRedirecting(true);
            router.push("/", undefined, { shallow: true }).then(() => {
              setLoading(false);
              setRedirecting(false);
            });
          }}/>
      )}
      {isError &&
        <Notifications autoHideDuration={3500} message="Error accessing data!" onClose={() => setIsError(false)} showProgress/>}
    </>
  );
};

export default QrWizard;

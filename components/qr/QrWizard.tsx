import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Context from "../context/Context";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import useMediaQuery from "@mui/material/useMediaQuery";

import { generateId, generateShortLink } from "../../utils";
import { DataType, OptionsType, ProcessHanldlerType } from "./types/types";
import { QR_CONTENT_ROUTE, QR_DESIGN_ROUTE, QR_TYPE_ROUTE } from "./constants";
import { getUuid } from "../../helpers/qr/helpers";
import { getStep, saveOrUpdate, steps, StepsProps } from "./auxFunctions";
import RenderNextButton from "./helperComponents/smallpieces/RenderNextButton";
import RenderBackButton from "./helperComponents/smallpieces/RenderBackButton";

import dynamic from "next/dynamic";
import session from "@ebanux/ebanux-utils/sessionStorage";
import { startAuthorizationFlow } from "@ebanux/ebanux-utils/auth";
import { useRouter } from "next/router";
import { request } from "../../libs/utils/request";
import { setWarning, hideNotification } from "../Notification";
import ConfirmDialog, { waitConfirmation } from "../ConfirmDialog";
import { releaseWaiting, startWaiting } from "../Waiting";

const RenderFloatingButtons = dynamic(() => import("./helperComponents/smallpieces/RenderFloatingButtons"));
const Notifications = dynamic(() => import("../notifications/Notifications"));
const ProcessHandler = dynamic(() => import("./renderers/ProcessHandler"));
const RenderPreview = dynamic(() => import("./renderers/RenderPreview"));

const QrWizard = ({ children }: { children: ReactNode; }) => {
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
    selected, data, options, frame, background, cornersData, dotsData, isWrong, loading, setOptions,
    setRedirecting, clearData, setData,
    subscription, userInfo,
  }: StepsProps = useContext(Context);

  const router = useRouter();
  const isFirstStep = [QR_TYPE_ROUTE, "/"].indexOf(router.pathname) !== -1;

  const handleBack = () => {
    startWaiting();
    router.push(
      router.pathname === QR_DESIGN_ROUTE ? QR_CONTENT_ROUTE : QR_TYPE_ROUTE,
      undefined,
      { shallow: true }
    ).finally(releaseWaiting);
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

  const currentStep = useMemo(() => getStep(router.pathname), [router.pathname]);

  const lastStep = (goToList: boolean) => {
    const item = document.getElementById("qrCodeReferenceId");
    if (item) {
      setForceDownload({ item });
    } else {
      clearData();
      startWaiting();
      router.push(
        goToList ? "/" : QR_TYPE_ROUTE,
        undefined,
        { shallow: true }
      ).finally(releaseWaiting);
    }
  };

  function onConfirmUpgrade(value: boolean) {
    hideNotification();
    if (!value) return;
    startWaiting();
    router.push('/plans').finally(releaseWaiting);
  }

  async function allowCreate() {
    if (!data.isDynamic || !isFirstStep) return true;

    if (!session.isAuthenticated) {
      startWaiting();
      session.set('CONTEXT', { selected, data });
      session.set('CALLBACK_ROUTE', { pathname: QR_CONTENT_ROUTE });
      startAuthorizationFlow();
      return false;
    }

    if (process.env.REACT_APP_OVERRIDE === 'dev') {
      return true;
    }

    let upToDynamicQR = process.env.FREE_DYNAMIC_QRS || 1;
    let amountByAdditionalDynamicQR = 0;

    if (subscription?.status === 'active') {
      upToDynamicQR = subscription.features.upToDynamicQR;
      amountByAdditionalDynamicQR = subscription.features.amountByAdditionalDynamicQR;
    }

    if (amountByAdditionalDynamicQR === 0) {
      const { count } = await request({ url: 'links/count', throwError: 'notify' });
      if (upToDynamicQR !== -1 && count >= upToDynamicQR) {
        setWarning([
          'You have reached the limit of Dynamic QRs for this account.',
          'Upgrade to a paid plan to add more QRs.',
        ], false);
        waitConfirmation('Click accept to if you want to view or upgrade your current plan.', onConfirmUpgrade);
        return false;
      }
    }

    return true;
  }

  const handleNext = async () => {
    if (!(await allowCreate())) return;

    if (isFirstStep) {
      // Step 1: QR_TYPE_ROUTE or / ==>  QR_CONTENT_ROUTE
      startWaiting();
      router.push({
        pathname: QR_CONTENT_ROUTE,
        query: { selected, address: router.query.address },
      }).finally(releaseWaiting);

    } else if (router.pathname === QR_CONTENT_ROUTE) {
      // Step 2: QR_CONTENT_ROUTE ==> QR_DESIGN_ROUTE
      startWaiting();
      router.push(
        { pathname: QR_DESIGN_ROUTE, query: router.query },
        undefined,
        { shallow: true },
      ).finally(releaseWaiting);

    } else if (router.pathname === QR_DESIGN_ROUTE) {
      // Step 3: QR_DESIGN_ROUTE    ==> PRINT | DOWNLOAD | SAVE
      if (!session.isAuthenticated) return lastStep(false);

      startWaiting();
      await saveOrUpdate(data, userInfo, options, frame, background, cornersData, dotsData, selected, setIsError,
        () => {
          setData((prev: DataType) => {
            const newData = { ...data };
            if (newData.claim !== undefined) {
              delete newData.claim;
            }
            if (newData.preGenerated !== undefined) {
              delete newData.preGenerated;
            }
            if (newData.claimable !== undefined) {
              delete newData.claimable;
            }
            return prev;
          })
        }, router, lastStep, dataInfo.current.length, updatingHandler);
      releaseWaiting();

    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (payload: IntersectionObserverEntry[]) => {
        setVisible(payload[0].isIntersecting || false);
      }, { root: document.querySelector("#scrollArea"), rootMargin: "0px", threshold: [0.3] });

    observer.observe(btnRef.current);
    setSize(sizeRef.current.offsetWidth);
    const getWidth = () => setSize(sizeRef.current.offsetWidth);
    window.addEventListener("resize", getWidth);

    if (router.pathname === QR_CONTENT_ROUTE && isLogged && data?.isDynamic && (!Boolean(options.id) || options.mode !== 'edit')) {
      const genShortLinkAndId = async () => {
        const id = getUuid();
        const shortCode = data.claim || await generateId(); // @ts-ignore
        setOptions((prev: OptionsType) => ({ ...prev, id, shortCode, data: generateShortLink(shortCode, process.env.SHORT_URL_DOMAIN) }));
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
          cloneMode={data.mode === 'clone'}
          selected={selected} />
        <Stepper activeStep={currentStep} sx={{ width: "100%", my: 0 }}>
          {steps.map((label: string) => <Step key={label}><StepLabel>{isWide ? label : ""}</StepLabel></Step>)}
        </Stepper>
        <RenderNextButton
          handleNext={handleNext}
          isLogged={isLogged}
          loading={loading}
          step={currentStep}
          isWrong={isWrong}
          selected={selected}
          qrName={data?.qrName} />
      </Box>
      <Box sx={{ position: "absolute", top: "32px" }} ref={btnRef} />
      <Box sx={{ minHeight: "calc(100vh - 205}px)" }}>{children}</Box>
      {dataInfo.current.length ? <ProcessHandler process={dataInfo.current} handleCommand={
        (isError?: boolean) => {
          dataInfo.current = [];
          if (!isError) { // @ts-ignore
            setForceDownload({ item: document.getElementById('qrCodeReferenceId') });
          } else {
            forceUpdate();
          }
        }
      } /> : null}
      {!loading && !visible && (
        <RenderFloatingButtons
          loading={loading}
          step={currentStep}
          isLogged={isLogged}
          qrName={data?.qrName}
          isWrong={isWrong}
          editingStatic={!data.isDynamic && options.mode === 'edit'}
          cloneMode={options.mode === 'clone'}
          handleBack={handleBack}
          handleNext={handleNext}
          size={size}
          selected={selected} />
      )}
      {forceDownload !== undefined && (
        <RenderPreview
          avoidDuplicate
          externalDesign={forceDownload?.item}
          externalFrame={frame}
          handleDone={async () => {
            setForceDownload(undefined);
            setRedirecting(true);
            startWaiting();
            router.push("/", undefined, { shallow: true }).then(() => {
              setRedirecting(false);
            }).finally(releaseWaiting);
          }} />
      )}
      <ConfirmDialog />
    </>
  );
};

export default QrWizard;

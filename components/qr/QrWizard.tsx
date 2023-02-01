import { ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { get as getUser } from "../../handlers/users";
import { list } from "../../handlers/qrs"
import RenderNextButton from "./helperComponents/smallpieces/RenderNextButton";
import RenderBackButton from "./helperComponents/smallpieces/RenderBackButton";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const RenderConfirmDlg = dynamic(() => import("../renderers/RenderConfirmDlg"));
const RenderFloatingButtons = dynamic(() => import("./helperComponents/smallpieces/RenderFloatingButtons"));
const Notifications = dynamic(() => import("../notifications/Notifications"));
const ProcessHandler = dynamic(() => import("./renderers/ProcessHandler"));
const RenderPreview = dynamic(() => import("./renderers/RenderPreview"));

interface QrWizardProps {
  children: ReactNode;
}

const QrWizard = ({ children }: QrWizardProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [size, setSize] = useState<number>(0);
  const [forceDownload, setForceDownload] = useState<{ item: HTMLElement } | undefined>(undefined);
  const [, setUnusedState] = useState();
  const [showLimitDlg, setShowLimitDlg] = useState<boolean>(false)
  const [limitReached, setLimitReached] = useState<boolean>(false)
  const [isFreeMode, setIsFreeMode] = useState<boolean>(false)

  // @ts-ignore
  const forceUpdate = useCallback(() => setUnusedState({}), []);

  const dataInfo = useRef<ProcessHanldlerType[]>([]);
  const btnRef = useRef<any>(null);
  const sizeRef = useRef<any>(null);
  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

  // @ts-ignore
  const { selected, data, userInfo, options, frame, background, cornersData, dotsData, isWrong, loading, setOptions,
    setLoading, setRedirecting, clearData, setData }: StepsProps = useContext(Context);

  const router = useRouter();

  const handleBack = () => {
    router.push(router.pathname === QR_DESIGN_ROUTE ? QR_CONTENT_ROUTE : QR_TYPE_ROUTE,
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

  const currentStep = useMemo(() => getStep(router.pathname), [router.pathname]);

  const lastStep = (goToList: boolean) => {
    const item = document.getElementById("qrCodeReferenceId");
    if (item) {
      setForceDownload({ item });
    } else {
      clearData();
      router.push(goToList ? "/" : QR_TYPE_ROUTE, undefined, { shallow: true })
        .then(() => setLoading(false));
    }
  };

  const handleNext = async () => {
    if (data.isDynamic && limitReached) {
      setShowLimitDlg(true)
      return;
    }

    setLoading(true); // @ts-ignore
    if ([QR_TYPE_ROUTE, "/"].includes(router.pathname)) {
      if (data.isDynamic && !isLogged) {
        router.push({ pathname: QR_CONTENT_ROUTE, query: { selected } })
          .then(() => setLoading(false));
      } else {
        router.push(QR_CONTENT_ROUTE, undefined, { shallow: true })
          .then(() => setLoading(false));
      }
    } else if (router.pathname === QR_DESIGN_ROUTE && isLogged) {
      await saveOrUpdate(data, userInfo, options, frame, background, cornersData, dotsData, selected, setLoading, setIsError,
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
    } else if (router.pathname === QR_DESIGN_ROUTE && !isLogged) {
      lastStep(false);
    } else {
      router.push(router.pathname === QR_TYPE_ROUTE ? QR_CONTENT_ROUTE : QR_DESIGN_ROUTE, undefined, { shallow: true })
        .then(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (router.pathname === QR_CONTENT_ROUTE && data.isDynamic && limitReached) {
      setShowLimitDlg(true)
    }
  }, [router.pathname, limitReached]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const observer = new IntersectionObserver(
      (payload: IntersectionObserverEntry[]) => {
        setVisible(payload[0].isIntersecting || false);
      }, { root: document.querySelector("#scrollArea"), rootMargin: "0px", threshold: [0.3] });

    observer.observe(btnRef.current);
    setSize(sizeRef.current.offsetWidth);
    const getWidth = () => { setSize(sizeRef.current.offsetWidth); };
    window.addEventListener("resize", getWidth);

    if (router.pathname === QR_CONTENT_ROUTE && isLogged && data?.isDynamic && (!Boolean(options.id) || options.mode !== 'edit')) {
      const genShortLinkAndId = async () => {
        const id = getUuid();
        const shortCode = data.claim || await generateId(); // @ts-ignore
        setOptions((prev: OptionsType) => ({ ...prev, id, shortCode, data: generateShortLink(shortCode, process.env.REACT_APP_SHORT_URL_DOMAIN) }));
      };
      genShortLinkAndId();
    }

    return () => window.removeEventListener("resize", getWidth);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { // REACT_APP_STATUS will forbid the checking on develop
    if (userInfo && options.mode !== 'edit' && process.env.REACT_APP_STATUS !== 'develop') {
      const fetchUser = async () => {
        return await getUser(userInfo.cognito_user_id);
      };
      fetchUser().then(profile => {
        if (profile?.subscriptionData?.status !== 'active') {
          setIsFreeMode(true);
          list({ userId: userInfo.cognito_user_id }).then(qrs => { // @ts-ignore
            if ((qrs.items as Array<any>).some((el: any) => el.isDynamic)) {
              setLimitReached(true);
            }
          });
        } else {
          setIsFreeMode(false);
          //TODO handle plan limits
        }
      }).catch(console.error);
    }
  }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {showLimitDlg &&
        <RenderConfirmDlg
          title="Oops"
          message="You have reached the limit of Dynamic QRs for this account. Upgrade to a paid plan to add more QRs. Click here to upgrade now."
          handleOk={() => {
            router.push('/plans');
            setShowLimitDlg(false);
          }}
          handleCancel={() => {
            if (router.pathname === QR_CONTENT_ROUTE) {
              setRedirecting(true);
              const query = {}; // @ts-ignore
              if (router.query.address !== undefined) { query.address = router.query.address; }
              router.push({ pathname: QR_TYPE_ROUTE, query }, QR_TYPE_ROUTE);
            }
            setShowLimitDlg(false);
          }}
          yesMsg='Upgrade'
        />}
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
            router.push("/", undefined, { shallow: true }).then(() => {
              setLoading(false);
              setRedirecting(false);
            });
          }} />
      )}
      {isError &&
        <Notifications autoHideDuration={3500} message="Error accessing data!" onClose={() => setIsError(false)} showProgress />}
    </>
  );
};

export default QrWizard;

import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Context from "../context/Context";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useRouter } from "next/router";

import { generateId, generateShortLink } from "../../utils";
import { EbanuxDonationPriceData, ProcessHanldlerType } from "./types/types";
import { QR_TYPE_ROUTE } from "./constants";
import { getUuid } from "../../helpers/qr/helpers";
import * as QrHandler from "../../handlers/qrs";
import * as StorageHandler from "../../handlers/storage";
import * as EbanuxHandler from "../../handlers/ebanux";
import Notifications from "../notifications/Notifications";
import ProcessHandler from "./renderers/ProcessHandler";
import {cleaner, finalCleanForEdtion, generateObjectToEdit, steps, StepsProps} from "./auxFunctions";
import RenderNextButton from "./helperComponents/RenderNextButton";
import RenderBackButton from "./helperComponents/RenderBackButton";
import RenderFloatingButtons from "./helperComponents/RenderFloatingButtons";
import RenderPreview from "./renderers/RenderPreview";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

interface QrWizardProps {
  children: ReactNode;
}

const QrWizard = ({ children }: QrWizardProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [forceDownload, setForceDownload] = useState<any>(undefined);
  const [size, setSize] = useState<number>(0);
  const [, setUnusedState] = useState();

  // @ts-ignore
  const forceUpdate = useCallback(() => setUnusedState({}), []);
  const dataInfo = useRef<ProcessHanldlerType[]>([]);
  const btnRef = useRef<any>(null);
  const sizeRef = useRef<any>(null);
  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

  // @ts-ignore
  const {
    selected, step, setStep, data, userInfo, options, frame, background, cornersData,
    dotsData, isWrong, loading, setOptions, setLoading, isTrialMode
  }: StepsProps = useContext(Context);

  const router = useRouter();

  const handleBack = () => {
    setStep((prev: number) => prev - 1);
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

  const handleNext = async () => {
    setLoading(true); // @ts-ignore
    if (step === 0 && data.isDynamic && !isLogged) {
      router.push({ pathname: "/", query: { path: router.pathname, login: true, selected } }, "/")
        .then(() => { setLoading(false); });
    } else if (step === 1 && isLogged && data.isDynamic && !Boolean(options.id) && options.mode === undefined) {
      const id = getUuid();
      const shortCode = await generateId();
      setOptions({
        ...options, id, shortCode, data: generateShortLink(shortCode, process.env.REACT_APP_SHORT_URL_DOMAIN)
      });
      setStep(2);
    } else if (step === 2 && isLogged) {
      if (["pdf", "audio", "gallery", "video"].includes(selected)) { //Process assets before saving de QR Data
        updatingHandler("Uploading assets");
        try { // @ts-ignore
          data["files"] = await StorageHandler.upload(data["files"], `${userInfo.attributes.sub}/${selected}s`);
          updatingHandler(null, true);
        } catch {
          updatingHandler(null, false);
        }
      }

      if (data.backgndImg !== undefined) {
        if (!Array.isArray(data.backgndImg)) {
          updatingHandler("Uploading background image");
          try { // @ts-ignore
            data.backgndImg = await StorageHandler.upload([data.backgndImg], `${userInfo.attributes.sub}/${selected}s/design`);
            updatingHandler(null, true);
          } catch {
            updatingHandler(null, false);
          }
        } else {
          delete data.backgndImg;
        }
      }
      if (data.prevBackImg !== undefined) {
        updatingHandler("Removing previous background image");
        try {
          await StorageHandler.remove([{ Key: data.prevBackImg }]);
          delete data.prevBackImg;
          updatingHandler(null, true);
        } catch {
          updatingHandler(null, false);
        }
      }

      if (data.foregndImg !== undefined) {
        if (!Array.isArray(data.foregndImg)) {
          updatingHandler("Uploading main image");
          try { // @ts-ignore
            data.foregndImg = await StorageHandler.upload([data.foregndImg], `${userInfo.attributes.sub}/${selected}s/design`);
            updatingHandler(null, true);
          } catch {
            updatingHandler(null, false);
          }
        } else {
          delete data.foregndImg;
        }
      }
      if (data.prevForeImg !== undefined) {
        updatingHandler("Deleting previous main image");
        try {
          await StorageHandler.remove([{ Key: data.prevForeImg }]);
          delete data.prevForeImg;
          updatingHandler(null, true);
        } catch {
          updatingHandler(null, false);
        }
      }

      if (selected === "donations") {
        let priceData: EbanuxDonationPriceData;
        priceData = {
          name: `Donate ${data["title"]}` || "Donation",
          unitAmountUSD: data["donationUnitAmount"] || 1,
          redirectUrl: data["web"] || ""
        };
        if (data["donationPriceId"]) {
          try {
            updatingHandler("Updating donation payment data");
            updatingHandler(null, true);
          } catch (error) {
            setIsError(true);
            updatingHandler(null, false);
          }

        } else {

          try {
            updatingHandler("Creating Donation microsite");
            const temp = (process.env.REACT_NODE_ENV != 'production') ?
              userInfo.signInUserSession.idToken.jwtToken :
              userInfo.signInUserSession.accessToken.jwtToken;
            const price = await EbanuxHandler.createEbanuxDonationPrice(userInfo.attributes.sub,
              temp,
              priceData);
            data["donationPriceId"] = price.result.price.id;
            data["donationProductId"] = price.result.product.id;
            updatingHandler(null, true)
          } catch (error) {
            setIsError(true);
            console.log(error)
            updatingHandler(null, false)
          }
        }
      }

      let shortLink;
      const qrData = { ...data, qrType: selected };
      const qrDesign = { ...options };

      if (data.mode === undefined) {
        const qrDesignId = getUuid();
        const qrId = options.id || getUuid(); // @ts-ignore
        qrData.qrOptionsId = qrDesignId;
        qrData.userId = userInfo.attributes.sub;

        if (data.isDynamic) { // @ts-ignore
          qrData.shortLinkId = { userId: userInfo.attributes.sub, createdAt: Date.now() };
          shortLink = {
            target: generateShortLink(`qr/${qrId}`),
            address: options.shortCode || await generateId(), // @ts-ignore
            ...qrData.shortLinkId
          };
        }
        qrDesign.id = qrDesignId;
      }

      cleaner(qrDesign, background, frame, cornersData, dotsData, data.mode === 'edit');

      try {
        if (data.mode === undefined) {
          if (dataInfo.current.length) {
            updatingHandler("Saving QR Code data");
          }
          await QrHandler.create({ shortLink, qrDesign, qrData });
        } else {
          if (dataInfo.current.length) {
            updatingHandler("Updating QR Code data");
          }

          delete data.mode;
          delete qrData.mode;

          const objToEdit = generateObjectToEdit(qrData, data, qrDesign);
          finalCleanForEdtion(objToEdit);

          await QrHandler.edit(objToEdit);
        }

        if (dataInfo.current.length) {
          updatingHandler(null, true);
        } else {
          router.replace("/").then(() => { setLoading(false); });
        }
      } catch {
        if (dataInfo.current.length) {
          updatingHandler(null, false);
        }
        setIsError(true);
        setLoading(false);
      }
      if (dataInfo.current.length) {
        updatingHandler("done");
      }
    } else if (step === 2 && !isLogged) {
      const item = document.getElementById('qrCodeReferenceId');

      if (item) {
        setForceDownload({ item });
      } else {
        await router.push(QR_TYPE_ROUTE, "/", { shallow: true });
      }
    } else {
      setStep((prev: number) => prev + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((payload: IntersectionObserverEntry[]) => {
      setVisible(payload[0].isIntersecting || false);
    }, {
      root: document.querySelector('#scrollArea'),
      rootMargin: '0px',
      threshold: [0.3]
    });
    observer.observe(btnRef.current);
    setSize(sizeRef.current.offsetWidth);
    const getWidth = () => { setSize(sizeRef.current.offsetWidth); }
    window.addEventListener("resize", getWidth);
    return () => window.removeEventListener("resize", getWidth);
  }, [loading]);

  return (
    <>
      <Box ref={sizeRef} sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", pb: '10px' }} >
        <RenderBackButton
          loading={loading}
          step={step}
          isDynamic={data.isDynamic || false}
          handleBack={handleBack}
          mode={data.mode}
          selected={selected} />
        <Stepper activeStep={step} sx={{width: "100%", my: 0}}>
          {steps.map((label: string) => <Step key={label}>
            <StepLabel>{isWide ? label : ''}</StepLabel>
          </Step>)}
        </Stepper>
        <RenderNextButton
          handleNext={handleNext}
          isLogged={isLogged}
          loading={loading}
          step={step}
          isWrong={isWrong}
          selected={selected}
          qrName={data.qrName}
          mode={data.mode} />
      </Box>
      <Box sx={{ position: 'absolute', top: '32px' }} ref={btnRef} />
      <Box sx={{ minHeight: `calc(100vh - ${isTrialMode ? 215 : 205}px)` }}>
        {children}
      </Box>
      {dataInfo.current.length ? <ProcessHandler process={dataInfo.current} handleCommand={
        (isError?: boolean) => {
          dataInfo.current = [];
          if (!isError) {
            router.replace("/").then(() => { setLoading(false); });
          } else {
            forceUpdate();
          }
        }
      } /> : null}
      {!loading && !visible && (
        <RenderFloatingButtons
          loading={loading}
          step={step}
          isDynamic={data.isDynamic || false}
          isLogged={isLogged}
          qrName={data.qrName}
          isWrong={isWrong}
          handleBack={handleBack}
          handleNext={handleNext}
          mode={data.mode}
          size={size}
          selected={selected} />
      )}
      {forceDownload !== undefined && (
        <RenderPreview
          externalDesign={forceDownload.item}
          externalFrame={frame}
          handleDone={async () => {
            setForceDownload(undefined);
            await router.push(QR_TYPE_ROUTE, "/", { shallow: true });
          }} />
      )}
      {isError && (
        <Notifications autoHideDuration={3500} message="Error accessing data!" onClose={() => setIsError(false)} />
      )}
    </>
  );
};

export default QrWizard;

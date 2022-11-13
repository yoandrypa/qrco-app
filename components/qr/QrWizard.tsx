import {ReactNode, useCallback, useContext, useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Context from "../context/Context";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DoneIcon from "@mui/icons-material/Done";
import SaveIcon from "@mui/icons-material/Save";
import {styled} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import {useRouter} from "next/router";

import {generateId, generateShortLink} from "../../utils";
import {EbanuxDonationPriceData, ProcessHanldlerType} from "./types/types";
import {QR_TYPE_ROUTE} from "./constants";
import {getUuid} from "../../helpers/qr/helpers";
import * as QrHandler from "../../handlers/qrs";
import * as StorageHandler from "../../handlers/storage";
import * as EbanuxHandler from "../../handlers/ebanux";
import Notifications from "../notifications/Notifications";
import ProcessHandler from "./renderers/ProcessHandler";
import {cleaner, generateObjectToEdit, steps, StepsProps} from "./auxFunctions";
import {initialBackground} from "../../helpers/qr/data";

interface QrWizardProps {
  children: ReactNode;
}

const StepperButtons = styled(Button)(() => ({ width: "120px", height: "30px" }));

const QrWizard = ({ children }: QrWizardProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [, setUnusedState] = useState();

  // @ts-ignore
  const forceUpdate = useCallback(() => setUnusedState({}), []);

  const deleteBack = useRef<boolean>(false);
  const dataInfo = useRef<ProcessHanldlerType[]>([]);
  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

  // @ts-ignore
  const {
    selected, step, setStep, data, userInfo, options, frame, background, cornersData,
    dotsData, isWrong, loading, setOptions, setLoading, isTrialMode
  }: StepsProps = useContext(Context);

  useEffect(() => {
    if (options.mode === 'edit' && background?.type === 'image' && options.backgroundOptions.color.length === 7 && !deleteBack.current) {
      deleteBack.current = true;
    }
  }, [background, options]); // eslint-disable-line react-hooks/exhaustive-deps

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
        .then(() => {
          setLoading(false);
        });
    } else if (step === 1 && isLogged && data.isDynamic && !Boolean(options.id) && options.mode === undefined) {
      const id = getUuid();
      const shortCode = await generateId();
      setOptions({
        ...options,
        id,
        shortCode,
        data: generateShortLink(shortCode, process.env.REACT_APP_SHORT_URL_DOMAIN)
      });
      setStep(2);
    } else if (step === 2 && isLogged) {
      //Process assets before saving de QR Data
      if (["pdf", "audio", "gallery", "video"].includes(selected)) {
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
          updatingHandler(null, true);
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

        } else {
          try {
            const price = await EbanuxHandler.createEbanuxDonationPrice(userInfo.attributes.sub,
              userInfo.signInUserSession.accessToken.jwtToken,
              priceData);
            data["donationPriceId"] = price.data.result.price.id;
            data["donationProductId"] = price.data.result.product.id;
          } catch (error) {
            setIsError(true);
          }
        }
      }

      const qrData = { ...data, qrType: selected };

      let shortLink;

      const qrDesign = { ...options };

      if (data.mode === undefined) {
        const qrDesignId = getUuid();
        const qrId = options.id || getUuid();

        // @ts-ignore
        qrData.qrOptionsId = qrDesignId;
        qrData.userId = userInfo.attributes.sub;

        if (data.isDynamic) {
          // @ts-ignore
          qrData.shortLinkId = { userId: userInfo.attributes.sub, createdAt: Date.now() };
          shortLink = {
            target: generateShortLink(`qr/${qrId}`),
            address: options.shortCode || await generateId(),
            // @ts-ignore
            ...qrData.shortLinkId
          };
        }

        qrDesign.id = qrDesignId;
      }

      cleaner(qrDesign, background, frame, cornersData, dotsData);

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

          if (deleteBack.current) {
            objToEdit.background = initialBackground;
          }

          await QrHandler.edit(objToEdit);
        }

        if (dataInfo.current.length) {
          updatingHandler(null, true);
        } else {
          router.replace("/").then(() => {
            setLoading(false);
          });
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
      await router.push(QR_TYPE_ROUTE, "/", { shallow: true });
    } else {
      setStep((prev: number) => prev + 1);
    }
  };

  const renderBack = () => (
    <StepperButtons
      variant="contained"
      startIcon={<ChevronLeftIcon />}
      disabled={loading || step === 0 || !selected || (data.mode === "edit" && ((data.isDynamic && step <= 1) || (!data.isDynamic && step <= 2)))}
      onClick={handleBack}>
      {"Back"}
    </StepperButtons>
  );

  const renderNext = () => (
    <StepperButtons
      onClick={handleNext}
      endIcon={step >= 2 ? (isLogged ? <SaveIcon /> : <DoneIcon />) : <ChevronRightIcon />}
      disabled={
        loading || (isWrong && step > 0) || !selected ||
        (step === 1 && isLogged && !Boolean(data?.qrName?.trim()?.length))
      }
      variant={step >= 2 ? "outlined" : "contained"}>
      {step >= 2 ? (isLogged ? (data.mode === undefined ? "Save" : "Update") : "Done") : "Next"}
    </StepperButtons>
  );

  const renderSteps = useCallback(() => (
    <Stepper
      activeStep={step}
      alternativeLabel={!isWide}
      sx={{ width: "100%", mt: { xs: 2, sm: 0 }, mb: { xs: 1, sm: 0 } }}
    >
      {steps.map((label: string) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  ), [step, isWide]);

  return (
    <>
      <Box sx={{ minHeight: `calc(100vh - ${isTrialMode ? 215 : 205}px)` }}>
        {children}
      </Box>
      {dataInfo.current.length ? <ProcessHandler process={dataInfo.current} handleCommand={
        (isError?: boolean) => {
          dataInfo.current = [];
          if (!isError) {
            router.replace("/").then(() => {
              setLoading(false);
            });
          } else {
            forceUpdate();
          }
        }
      } /> : null}
      {isWide ? (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", pt: 2 }}>
          {renderBack()}
          {renderSteps()}
          {renderNext()}
        </Box>
      ) : (
        <>
          {renderSteps()}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {renderBack()}
            {renderNext()}
          </Box>
        </>
      )}
      {isError && (
        <Notifications autoHideDuration={3500} message="Error accessing data!" onClose={() => {
          setIsError(false);
        }} />
      )}
    </>
  );
};

export default QrWizard;

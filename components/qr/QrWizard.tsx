import {ReactNode, useCallback, useContext, useState} from "react";
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

import {useRouter} from "next/router";

import {generateId, generateShortLink} from "../../utils";
import * as QrHandler from "../../handlers/qrs";
import {
  BackgroundType,
  CornersAndDotsType,
  DataType,
  EbanuxDonationPriceData,
  EditType,
  FramesType,
  OptionsType
} from "./types/types";
import {QR_TYPE_ROUTE} from "./constants";
import {areEquals} from "../helpers/generalFunctions";
import {initialBackground, initialFrame} from "../../helpers/qr/data";
import useMediaQuery from "@mui/material/useMediaQuery";
import {getUuid} from "../../helpers/qr/helpers";
import * as StorageHandler from "../../handlers/storage";
import * as EbanuxHandler from "../../handlers/ebanux"
import Notifications from "../notifications/Notifications";

const steps = ["Type", "Content", "Design"];

interface QrWizardProps {
  children: ReactNode;
}

interface StepsProps {
  step: number;
  setStep: Function;
  selected: string;
  data: DataType;
  userInfo: {
    attributes: { sub: string },
    signInUserSession: {
      accessToken: {
        jwtToken: string
      }
    }
  };
  options: OptionsType;
  frame: FramesType;
  background: BackgroundType;
  cornersData: CornersAndDotsType;
  dotsData: CornersAndDotsType;
  setOptions: (opt: OptionsType) => void;
  isWrong: boolean;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  isTrialMode?: boolean;
}

const StepperButtons = styled(Button)(() => ({width: "120px", height: "30px"}));

const QrWizard = ({children}: QrWizardProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  const isWide = useMediaQuery("(min-width:600px)", {noSsr: true});

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

  const handleNext = async () => {
    setLoading(true);

    // @ts-ignore
    if (step === 0 && data.isDynamic && !isLogged) {
      router.push({pathname: "/", query: {path: router.pathname, login: true}}, "/")
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
        // @ts-ignore
        data["files"] = await StorageHandler.upload(data["files"], `${userInfo.attributes.sub}/${selected}s`);
      }

      if (selected === 'donations') {
        let priceData: EbanuxDonationPriceData;
        priceData = {
          name: `Donate ${data["title"]}` || 'Donation',
          unitAmountUSD: data["donationUnitAmount"] || 1,
          redirectUrl: data["web"] || ''
        }
        if (data["donationPriceId"]) {

        } else {
          try {
            const price = await EbanuxHandler.createEbanuxDonationPrice(userInfo.attributes.sub,
              userInfo.signInUserSession.accessToken.jwtToken,
              priceData)
            data["donationPriceId"] = price.data.result.price.id;
            data["donationProductId"] = price.data.result.product.id
          } catch (error) {
            setIsError(true)
          }
        }
      }

      const qrData = {...data, qrType: selected};
      let shortLink;

      const qrDesign = {...options};

      if (data.mode === undefined) {
        const qrDesignId = getUuid();
        const qrId = options.id || getUuid();
        const shortLinkId = getUuid();

        // @ts-ignore
        qrData.qrOptionsId = qrDesignId;
        // @ts-ignore
        qrData.id = qrId;
        // @ts-ignore
        qrData.userId = userInfo.attributes.sub;
        // @ts-ignore
        qrData.shortLinkId = {id: shortLinkId, userId: userInfo.attributes.sub};

        if (data.isDynamic) {
          shortLink = {
            id: shortLinkId,
            target: generateShortLink(`qr/${qrId}`),
            address: options.shortCode || await generateId(),
            // @ts-ignore
            userId: userInfo.attributes.sub
          };
        }

        qrDesign.id = qrDesignId;
      }

      if (!areEquals(frame, initialFrame)) {
        qrDesign.frame = frame;
      }
      if (!areEquals(background, initialBackground)) {
        qrDesign.background = background;
      }
      if (cornersData !== null) {
        qrDesign.corners = cornersData;
      }
      if (dotsData !== null) {
        qrDesign.cornersDot = dotsData;
      }
      if (!qrDesign.cornersDotOptions.type) {
        qrDesign.cornersDotOptions.type = '';
      }
      if (!qrDesign.cornersSquareOptions.type) {
        qrDesign.cornersSquareOptions.type = '';
      }
      if (qrDesign.mode !== undefined) {
        delete qrDesign.mode;
      }

      try {
        if (data.mode === undefined) {
          await QrHandler.create({shortLink, qrDesign, qrData});
        } else {
          const objToEdit = {
            ...qrData,
            userId: qrDesign.userId,
            id: qrDesign.id,
            qrType: qrData.qrType,
            qrName: qrData.qrName
          } as EditType;

          if (objToEdit.createdAt) {
            delete objToEdit.createdAt;
          }
          if (objToEdit.updatedAt) {
            delete objToEdit.updatedAt;
          }
          if (data.isDynamic) {
            objToEdit.isDynamic = true;
          }

          objToEdit.qrOptionsId = qrDesign;

          await QrHandler.edit(objToEdit);
        }

        router.replace("/").then(() => {
          setLoading(false);
        });
      } catch {
        setIsError(true);
        setLoading(false);
      }
    } else if (step === 2 && !isLogged) {
      await router.push(QR_TYPE_ROUTE, undefined, {shallow: true});
    } else {
      setStep((prev: number) => prev + 1);
    }
  };

  const renderBack = () => (
    <StepperButtons
      variant="contained"
      startIcon={<ChevronLeftIcon/>}
      disabled={loading || step === 0 || !selected || (data.mode === 'edit' && ((data.isDynamic && step <= 1) || (!data.isDynamic && step <= 2)))}
      onClick={handleBack}>
      {"Back"}
    </StepperButtons>
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const renderNext = () => (
    <StepperButtons
      onClick={handleNext}
      endIcon={step >= 2 ? (isLogged ? <SaveIcon/> : <DoneIcon/>) : <ChevronRightIcon/>}
      disabled={
        loading || isWrong || !selected ||
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
      sx={{width: "100%", mt: {xs: 2, sm: 0}, mb: {xs: 1, sm: 0}}}
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
      <Box sx={{minHeight: `calc(100vh - ${isTrialMode ? (step === 0 ? 207 : 215) : 195}px)`}}>
        {children}
      </Box>
      {isWide ? (
        <Box sx={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", pt: 2}}>
          {renderBack()}
          {renderSteps()}
          {renderNext()}
        </Box>
      ) : (
        <>
          {renderSteps()}
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            {renderBack()}
            {renderNext()}
          </Box>
        </>
      )}
      {isError && (
        <Notifications autoHideDuration={3500} message="Error accessing data!" onClose={() => {
          setIsError(false);
        }}/>
      )}
    </>
  );
};

export default QrWizard;

import {useContext, useEffect, useMemo, useState} from "react";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import Context from "../../context/Context";
import {DataType} from "../types/types";

import dynamic from "next/dynamic";

import {IS_DEV_ENV, ONLY_QR} from "../constants";
import RenderProDesc from "./smallpieces/RenderProDesc";
import RenderFreeDesc from "./smallpieces/RenderFreeDesc";
import TypeSelector from "./TypeSelector";
import {MyBadge} from "./looseComps/StyledComponents";
import {areEquals} from "../../helpers/generalFunctions";
import initialOptions, {initialData} from "../../../helpers/qr/data";

import RenderSamplePreview from "./smallpieces/RenderSamplePreview";

const RenderClaimingInfo = dynamic(() => import("./smallpieces/RenderClaimingInfo"));
const RenderLoseDataConfirm = dynamic(() => import('./smallpieces/RenderLoseDataConfirm'));
const RenderPreviewDrawer = dynamic(() => import('./smallpieces/RenderPreviewDrawer'));
const RenderPreviewButton = dynamic(() => import('./smallpieces/RenderPreviewButton'));

interface RenderTypeSelectorProps {
  selected?: string | null;
  handleSelect: (payload: string) => void;
  isLogged: boolean;
}

interface ContextData {
  data: DataType;
  setData: (vale: DataType) => void;
}

const RenderTypeSelector = ({selected, handleSelect}: RenderTypeSelectorProps) => { // @ts-ignore
  const {options, data, setData}: ContextData = useContext(Context);

  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [displayConfirm, setDisplayConfirm] = useState<{select: number} | null>(null);

  const isWide = useMediaQuery("(min-width:600px)", {noSsr: true});
  const isWideForPreview = useMediaQuery("(min-width:925px)", {noSsr: true});
  const isWideForThreeColumns = useMediaQuery("(min-width:1045px)", {noSsr: true});

  const isDynamic = useMemo(() => data.isDynamic || false, [data.isDynamic]);

  const proceed = (selection: number) => {
    const dynamic = selection === 0;
    if (dynamic) { // @ts-ignore
      setData((prev: DataType) => ({...prev, isDynamic: dynamic}));
    } else if (data.isDynamic !== undefined) { // @ts-ignore
      setData((prev: DataType) => {
        const tempoData = {...prev};
        delete tempoData.isDynamic;
        return tempoData;
      });
    }
  }

  const handleClick = (selection: number) => {
    const compareWith = {...initialOptions, data: options.data}; // @ts-ignore
    if (options.id) { compareWith.id = options.id; } // @ts-ignore
    if (options.shortCode) { compareWith.shortCode = options.shortCode; }
    const dataComp = {...data};
    if (initialData.isDynamic !== undefined) {
      dataComp.isDynamic = initialData.isDynamic;
    }

    if (!areEquals(dataComp, initialData) || !areEquals(options, compareWith)) {
      setDisplayConfirm({select: selection});
    } else {
      proceed(selection);
    }
  };

  const renderTypeSelector = (item: string, description: string, enabled: boolean) => (
    <Grid id={`card${item}`} item
          lg={!selected ? 3 : isWideForThreeColumns ? 4 : 6}
          md={!selected ? 4 : (isWideForThreeColumns ? 4 : 6)} sm={6} xs={12}>
      <TypeSelector
        icon={item} isDynamic={isDynamic} enabled={enabled} description={description} selected={selected === item}
        handleSelect={handleSelect} />
    </Grid>
  );

  useEffect(() => {
    if (isWideForPreview && openPreview) {
      setOpenPreview(false);
    }
  }, [isWideForPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{display: 'flex'}}>
      <Grid container spacing={1} sx={{height: 'fit-content'}}>
        <Grid item xs={12}>
          <Box sx={{width: '100%', position: 'relative'}}>
            <Tabs value={isDynamic ? 0 : 1} onChange={(_, newSel: number) => handleClick(newSel)}>
              <Tab sx={{pr: '37px', mr: '3px'}} label={
                <MyBadge badgeContent={
                  <Tooltip title={<RenderProDesc/>} arrow>
                    <span>Pro</span>
                  </Tooltip>
                } color="primary" pro>
                  <Typography>{isWide ? "Dynamic QR Codes" : "Dynamic"}</Typography>
                </MyBadge>
              }/>
              <Tab sx={{pr: '39px'}} disabled={data.claim !== undefined} label={
                <MyBadge badgeContent={
                  <Tooltip title={<RenderFreeDesc />} arrow>
                    <span>Free</span>
                  </Tooltip>} color="success" disabled={data.claim !== undefined}>
                  <Typography>{isWide ? "Static QR Codes" : "Static"}</Typography>
                </MyBadge>
              }/>
            </Tabs>
            {data.claim !== undefined && (<Box sx={{position: 'absolute', textAlign: 'center', top: '7px', right: 0}}>
              <RenderClaimingInfo claim={data.claim} />
            </Box>)}
          </Box>
        </Grid>
        {renderTypeSelector("web",  isDynamic ? "Transform a long URL in a shortened link" : "Link to any page on the web", true)}
        {!isDynamic ?
          (<>
            {renderTypeSelector("vcard", "Share your contact details", true)}
            {renderTypeSelector("email", "Receive email messages", true)}
            {renderTypeSelector("sms", "Receive text messages", true)}
            {renderTypeSelector("text", "Share a short text message", true)}
            {renderTypeSelector("wifi", "Invite to get connected to a WiFi network", true)}
            {renderTypeSelector("twitter", "Invite to post a tweet", true)}
            {renderTypeSelector("whatsapp", "Receive WhatsApp messages", true)}
            {renderTypeSelector("facebook", "Invite to share an URL in Facebook", true)}
            {IS_DEV_ENV && renderTypeSelector("crypto", "Receive crypto on your eWallet", true)}
          </>) : (<>
            {renderTypeSelector("vcard+", "Share your contact and social details", true)}
            {renderTypeSelector('business', 'Describe your business or company', true)}
            {renderTypeSelector("social", "Share your social networks information", true)}
            {renderTypeSelector("link", "Share your own links, including social info", true)}
            {renderTypeSelector("coupon", "Share a coupon", true)}
            {renderTypeSelector("donation", "Get donations from your supporters worldwide", true)}
            {renderTypeSelector("petId", "Share your pet's information", true)}
            {renderTypeSelector("custom", "Custom QR link from scratch using predefined sections", true)}
            {IS_DEV_ENV && renderTypeSelector("findMe", "Place a QR link on your stuff to make easy to find you", true)}
            {IS_DEV_ENV && renderTypeSelector("inventory", "Tag your products to make easy to find them", true)}
            {IS_DEV_ENV && renderTypeSelector("linkedLabel", "Share your product's information", true)}
            {IS_DEV_ENV && renderTypeSelector("fundme", "Start your own charity or fundraising campaign", true)}
            {IS_DEV_ENV && renderTypeSelector("paylink", "Receive payments worldwide", true)}
          </>)
        }
        {isDynamic ? (<>
          {renderTypeSelector("pdf", "Share a PDF file", true)}
          {renderTypeSelector("audio", "Share an audio file", true)}
          {renderTypeSelector("gallery", "Share a gallery of images", true)}
          {renderTypeSelector("video", "Share video files", true)}
        </>) : null}
      </Grid>
      {isWideForPreview && selected && (
        <RenderSamplePreview selected={selected} style={{ml: '15px', mt: '56px', width: '287px', position: 'sticky', top: '120px'}}
                             isDynamic={data.isDynamic || false} onlyQr={ONLY_QR.includes(selected) || !data.isDynamic}
                             showSampleMessage step={0} />
      )}
      {!openPreview && !isWideForPreview && selected && ( // @ts-ignore
        <RenderPreviewButton setOpenPreview={setOpenPreview} message="Sample"/>
      )}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer setOpenPreview={setOpenPreview} border={35} height={!data.isDynamic ? 425 : 700} > {/* @ts-ignore */}
          <RenderSamplePreview onlyQr={[...ONLY_QR, 'web'].includes(selected) || !data.isDynamic} selected={selected}
                               isDrawed style={{mt: '-15px'}} step={0} isDynamic={data.isDynamic || false} showSampleMessage />
        </RenderPreviewDrawer>
      )}
      {displayConfirm && (
        <RenderLoseDataConfirm
          handleOk={() => { proceed(displayConfirm.select); setDisplayConfirm(null); }}
          handleCancel={() => setDisplayConfirm(null)} />
      )}
    </Box>
  );
};

export default RenderTypeSelector;

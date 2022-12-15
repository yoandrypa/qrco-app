import {useContext, useEffect, useMemo, useState} from "react";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TypeSelector from "./TypeSelector";
import Box from "@mui/material/Box";

import Context from "../../context/Context";
import {DataType} from "../types/types";

import dynamic from "next/dynamic";

import {IS_DEV_ENV, ONLY_QR} from "../constants";
import RenderProDesc from "./smallpieces/RenderProDesc";
import RenderFreeDesc from "./smallpieces/RenderFreeDesc";
import RenderSamplePreview from "./smallpieces/RenderSamplePreview";
import {MyBadge} from "./smallpieces/StyledComponents";

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
  const {data, setData}: ContextData = useContext(Context);
  const isWide = useMediaQuery("(min-width:600px)", {noSsr: true});
  const isWideForPreview = useMediaQuery("(min-width:925px)", {noSsr: true});
  const isWideForThreeColumns = useMediaQuery("(min-width:1045px)", {noSsr: true});
  const isDynamic = useMemo(() => data.isDynamic || false, [data.isDynamic]);
  const [openPreview, setOpenPreview] = useState<boolean>(false);

  const handleClick = (selection: number) => { // @ts-ignore
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
  };

  const renderTypeSelector = (item: string, description: string, enabled: boolean) => (
    <Grid item lg={IS_DEV_ENV && selected ? (isWideForThreeColumns ? 4 : 6) : 3}
          md={!IS_DEV_ENV || !selected ? 4 : (isWideForThreeColumns ? 4 : 6)} sm={6} xs={12}>
      <TypeSelector
        icon={item}
        isDynamic={isDynamic}
        enabled={enabled}
        description={description}
        selected={selected === item}
        handleSelect={handleSelect}/>
    </Grid>
  );

  useEffect(() => {
    if (isWideForPreview && openPreview) {
      setOpenPreview(false);
    }
  }, [isWideForPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{display: 'flex'}}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
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
            <Tab sx={{pr: '39px'}} label={
              <MyBadge badgeContent={
                <Tooltip title={<RenderFreeDesc />} arrow>
                  <span>Free</span>
                </Tooltip>} color="success">
                <Typography>{isWide ? "Static QR Codes" : "Static"}</Typography>
              </MyBadge>
            }/>
          </Tabs>
        </Grid>
        {renderTypeSelector("web",  isDynamic ? "Transform a long URL in a shortened link" : "Link to any page on the web", true)}
        {!isDynamic ?
          (<>
            {renderTypeSelector("vcard", "Share your contact details", true)}
            {renderTypeSelector("email", "Send email messages", true)}
            {renderTypeSelector("sms", "Send text messages", true)}
            {renderTypeSelector("text", "Display a short text message", true)}
            {renderTypeSelector("wifi", "Get connected to a WiFi network", true)}
            {renderTypeSelector("twitter", "Post a tweet", true)}
            {renderTypeSelector("whatsapp", "Send a WhatsApp message", true)}
            {renderTypeSelector("facebook", "Share an URL in your wall", true)}
            {IS_DEV_ENV && renderTypeSelector("crypto", "Recieve crypto on your eWallet", true)}
          </>) : (<>
            {renderTypeSelector("vcard+", "Share your contact and social details", true)}
            {renderTypeSelector('business', 'Describe your business or company', true)}
            {renderTypeSelector("social", "Share your social networks information", true)}
            {renderTypeSelector("link", "Share your own links, including social info", true)}
            {renderTypeSelector("coupon", "Share a coupon", true)}
            {renderTypeSelector("donation", "Get donations from your supporters worldwide", true)}
            {IS_DEV_ENV && renderTypeSelector("fundme", "Start your own charity or fundraising campaign", true)}
            {IS_DEV_ENV && renderTypeSelector("paylink", "Receive payments worldwide", true)}
            {IS_DEV_ENV && renderTypeSelector("petId", "Share your pet's information", true)}
          </>)
        }
        {isDynamic ? (<>
          {renderTypeSelector("pdf", "Share a PDF file", true)}
          {renderTypeSelector("audio", "Share an audio file", true)}
          {renderTypeSelector("gallery", "Share a gallery of images", true)}
          {renderTypeSelector("video", "Share video files", true)}
        </>) : null}
      </Grid>
      {IS_DEV_ENV && isWideForPreview && selected && (
        <RenderSamplePreview selected={selected} style={{ml: '15px', mt: '18px', width: '370px'}}
                             onlyQr={ONLY_QR.includes(selected) || !data.isDynamic} step={0} />
      )}
      {IS_DEV_ENV && !openPreview && !isWideForPreview && selected && ( // @ts-ignore
        <RenderPreviewButton setOpenPreview={setOpenPreview} message="Sample"/>
      )}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer setOpenPreview={setOpenPreview} border={35} height={!data.isDynamic ? 500 : 675} > {/* @ts-ignore */}
          <RenderSamplePreview selected={selected} isDrawed style={{mt: '-15px'}} step={0} onlyQr={[...ONLY_QR, 'web'].includes(selected) || !data.isDynamic} />
        </RenderPreviewDrawer>
      )}
    </Box>
  );
};

export default RenderTypeSelector;

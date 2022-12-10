import {useContext, useEffect, useMemo, useState} from "react";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TypeSelector from "./TypeSelector";
import Box from "@mui/material/Box";
import {blue} from "@mui/material/colors";
import {styled} from "@mui/material/styles";

import Context from "../../context/Context";
import {DataType} from "../types/types";

import RenderPreviewDrawer from "./smallpieces/RenderPreviewDrawer";
import RenderPreviewButton from "./smallpieces/RenderPreviewButton";
import RenderSamplePreview from "./smallpieces/RenderSamplePreview";
import {IS_DEV_ENV} from "../constants";
import RenderProDesc from "./smallpieces/RenderProDesc";
import RenderFreeDesc from "./smallpieces/RenderFreeDesc";

interface RenderTypeSelectorProps {
  selected?: string | null;
  handleSelect: (payload: string) => void;
  isLogged: boolean;
}

interface ContextData {
  data: DataType;
  setData: (vale: DataType) => void;
  useInfo: any;
}

const MyBadge = styled(Badge)(({pro}: { pro?: boolean }) => ({
  '& .MuiBadge-badge': {
    top: 11,
    right: pro ? -20 : -22,
    height: 18,
    fontSize: '0.55rem',
    borderRadius: '4px',
    background: pro ? '#000' : blue[800]
  }
}));

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

  const renderTypeSelector = (item: string, label: string, description: string, enabled: boolean) => (
    <Grid item lg={IS_DEV_ENV && selected ? (isWideForThreeColumns ? 4 : 6) : 3}
          md={!IS_DEV_ENV || !selected ? 4 : (isWideForThreeColumns ? 4 : 6)} sm={6} xs={12}>
      <TypeSelector
        icon={item}
        label={label}
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
        {renderTypeSelector("web", isDynamic ? "Short URL" : "Website",
          isDynamic ? "Transform a long URL in a shortened link" : "Link to any page on the web", true)}
        {!isDynamic ?
          (<>
            {renderTypeSelector("vcard", "vCard", "Share your contact details", true)}
            {renderTypeSelector("email", "Email", "Send email messages", true)}
            {renderTypeSelector("sms", "SMS", "Send text messages", true)}
            {renderTypeSelector("text", "Text", "Display a short text message", true)}
            {renderTypeSelector("wifi", "WiFi", "Get connected to a WiFi network", true)}
            {renderTypeSelector("twitter", "Twitter", "Post a tweet", true)}
            {renderTypeSelector("whatsapp", "WhatsApp", "Send a WhatsApp message", true)}
            {renderTypeSelector("facebook", "Facebook", "Share an URL in your wall", true)}
            {IS_DEV_ENV && renderTypeSelector("crypto", "Crypto Payment", "Recieve crypto on your eWallet", true)}
          </>) : (<>
            {renderTypeSelector("vcard+", "vCard Plus", "Share your contact and social details", true)}
            {renderTypeSelector('business', 'Business', 'Describe your business or company', true)}
            {renderTypeSelector("social", "Social Networks", "Share your social networks information", true)}
            {renderTypeSelector("link", "Link-in-Bio", "Share your own links, including social info", true)}
            {renderTypeSelector("coupon", "Coupon", "Share a coupon", true)}
            {renderTypeSelector("donation", "Donation", "Get donations from your supporters worldwide", true)}
            {IS_DEV_ENV && renderTypeSelector("fundme", "Fund Me", "Start your own charity or fundraising campaign", true)}
            {IS_DEV_ENV && renderTypeSelector("paylink", "Send Me Money", "Receive payments worldwide", true)}
          </>)
        }
        {isDynamic ? (<>
          {renderTypeSelector("pdf", "PDF File", "Share a PDF file", true)}
          {renderTypeSelector("audio", "Audio File", "Share an audio file", true)}
          {renderTypeSelector("gallery", "Gallery", "Share a gallery of images", true)}
          {renderTypeSelector("video", "Video Files", "Share video files", true)}
        </>) : null}
      </Grid>
      {IS_DEV_ENV && isWideForPreview && selected && (
        <RenderSamplePreview selected={selected} style={{ml: '15px', mt: '18px', width: '370px'}} onlyQr={!data.isDynamic} />
      )}
      {IS_DEV_ENV && !openPreview && !isWideForPreview && selected && data.isDynamic && ( // @ts-ignore
        <RenderPreviewButton setOpenPreview={setOpenPreview} message="Sample"/>
      )}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer setOpenPreview={setOpenPreview} height={675} border={35}> {/* @ts-ignore */}
          <RenderSamplePreview selected={selected} isDrawed style={{mt: '-15px'}} />
        </RenderPreviewDrawer>
      )}
    </Box>
  );
};

export default RenderTypeSelector;

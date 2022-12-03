import { useContext, useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import TypeSelector from "./TypeSelector";
import Context from "../../context/Context";
import { DataType } from "../types/types";
import { blue } from "@mui/material/colors";
import Box from "@mui/material/Box";
import RenderIframe from "../../RenderIframe";
import RenderCellPhoneShape from "./RenderCellPhoneShape";
import { NO_MICROSITE } from "../constants";
import RenderPreviewDrawer from "./RenderPreviewDrawer";
import RenderPreviewButton from "./RenderPreviewButton";

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

const MyBadge = styled(Badge)(({ pro }: { pro?: boolean }) => ({
  '& .MuiBadge-badge': {
    top: 11,
    right: pro ? -20 : -22,
    height: 18,
    fontSize: '0.55rem',
    borderRadius: '4px',
    background: pro ? '#000' : blue[800]
  }
}));

const RenderTypeSelector = ({ selected, handleSelect }: RenderTypeSelectorProps) => { // @ts-ignore
  const { data, setData }: ContextData = useContext(Context);
  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });
  const isWideForPreview = useMediaQuery("(min-width:925px)", { noSsr: true });
  const isDynamic = useMemo(() => data.isDynamic || false, [data.isDynamic]);
  const [openPreview, setOpenPreview] = useState<boolean>(false);

  const handleClick = (selection: number) => { // @ts-ignore
    const dynamic = selection === 0;
    if (dynamic) { // @ts-ignore
      setData((prev: DataType) => ({ ...prev, isDynamic: dynamic }));
    } else if (data.isDynamic !== undefined) { // @ts-ignore
      setData((prev: DataType) => {
        const tempoData = { ...prev };
        delete tempoData.isDynamic;
        return tempoData;
      });
    }
  };

  const renderTypeSelector = (item: string, label: string, description: string, enabled: boolean, isDynamic?: boolean) => (
    <Grid item lg={data.isDynamic && selected ? 4 : 3} md={4} sm={6} xs={12}>
      <TypeSelector
        isDynamic={isDynamic || false}
        icon={item}
        label={label}
        enabled={enabled}
        description={description}
        selected={selected === item}
        handleSelect={handleSelect} />
    </Grid>
  );

  const renderPreview = (forbidStyle?: boolean, renderSampleMessage?: boolean) => (
    <Box sx={{ ml: !forbidStyle ? '20px' : 0, mt: !forbidStyle ? '60px' : 0 }}>
      <RenderCellPhoneShape width={270} height={550} offlineText="The selected card has no available sample">
        {selected && !NO_MICROSITE.includes(selected) ?
          <RenderIframe width="256px" height="536px" src={`${process.env.REACT_MICROSITES_ROUTE}/sample/${selected}`} /> : null}
      </RenderCellPhoneShape>
      {renderSampleMessage && <Typography sx={{ textAlign: 'center', fontSize: 'small', color: theme => theme.palette.text.disabled, mt: '10px' }}>Sample</Typography>}
    </Box>
  );

  useEffect(() => {
    if (isWideForPreview && openPreview) { setOpenPreview(false); }
  }, [isWideForPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs value={isDynamic ? 0 : 1} onChange={(_, newSel: number) => handleClick(newSel)}>
            <Tab sx={{ pr: '37px', mr: '3px' }} label={
              <MyBadge badgeContent={
                <Tooltip title={
                  <span>
                    <p>Dynamic QR codes:</p>
                    <ul style={{ paddingLeft: 0, listStylePosition: 'inside' }}>
                      <li>QR code + Short Link + Microsite</li>
                      <li>Easy to customize</li>
                      <li>Easy to use</li>
                      <li>Unlimited content changes</li>
                      <li>Ability to fix mistakes</li>
                      <li>Ability to be shared as a Short URL</li>
                      <li>Reusable QR codes after printing</li>
                      <li>QR content in a mobile-friendly microsite</li>
                      <li>Microsite easy to share with other apps</li>
                      <li>Scans tracking and other statistics included</li>
                      <li>Available for authenticated users only</li>
                    </ul>
                  </span>
                } arrow>
                  <span>Pro</span>
                </Tooltip>
              } color="primary" pro>
                <Typography>{isWide ? "Dynamic QR Codes" : "Dynamic"}</Typography>
              </MyBadge>
            } />
            <Tab sx={{ pr: '39px' }} label={
              <MyBadge badgeContent={
                <Tooltip title={
                  <span>
                    <p>Static QR codes:</p>
                    <ul style={{ paddingLeft: 0, listStylePosition: 'inside' }}>
                      <li>100% free</li>
                      <li>Easy to customize</li>
                      <li>Easy to use</li>
                      <li>Effective for simple uses</li>
                      <li>Take longer to scan</li>
                      <li>Non-editable content</li>
                      <li>Unlimited for both authenticated and guest users</li>
                      <li>Stored for authenticated users only</li>
                    </ul>
                  </span>
                } arrow>
                  <span>Free</span>
                </Tooltip>} color="success">
                <Typography>{isWide ? "Static QR Codes" : "Static"}</Typography>
              </MyBadge>
            } />
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
            {process.env.REACT_NODE_ENV === 'develop' && renderTypeSelector("crypto", "Crypto Payment", "Recieve crypto on your eWallet", true)}
          </>) : (<>
            {renderTypeSelector("vcard+", "vCard Plus", "Share your contact and social details", true, true)}
            {renderTypeSelector('business', 'Business', 'Describe your business or company', true, true)}
            {renderTypeSelector("social", "Social Networks", "Share your social networks information", true, true)}
            {renderTypeSelector("link", "Link-in-Bio", "Share your own links, including social info", true, true)}
            {renderTypeSelector("coupon", "Coupon", "Share a coupon", true, true)}
            {renderTypeSelector("donations", "Donation", "Get donations from your supporters worldwide", true, true)}
            {process.env.REACT_NODE_ENV === 'develop' && renderTypeSelector("fundme", "Fund Me", "Start your own charity or fundraising campaign", true)}
            {process.env.REACT_NODE_ENV === 'develop' && renderTypeSelector("paylink", "Send Me Money", "Receive payments worldwide", true)}
          </>)
        }
        {isDynamic ? (<>
          {renderTypeSelector("pdf", "PDF File", "Share a PDF file", true, true)}
          {renderTypeSelector("audio", "Audio File", "Share an audio file", true, true)}
          {renderTypeSelector("gallery", "Gallery", "Share a gallery of images", true, true)}
          {renderTypeSelector("video", "Video Files", "Share video files", true, true)}
        </>) : null}
      </Grid>
      {isWideForPreview && selected && data.isDynamic && renderPreview(false, true)}
      {!openPreview && !isWideForPreview && selected && data.isDynamic && ( // @ts-ignore
        <RenderPreviewButton setOpenPreview={setOpenPreview} message="Sample" />
      )}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer setOpenPreview={setOpenPreview} height={618}>{renderPreview(true)}</RenderPreviewDrawer>
      )}
    </Box>
  );
};

export default RenderTypeSelector;

import {useContext, useMemo} from "react";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import TypeSelector from "./TypeSelector";
import Context from "../../context/Context";
import {DataType} from "../types/types";

interface RenderTypeSelectorProps {
  selected?: string | null;
  handleSelect: Function;
}

interface ContextData {
  data: DataType;
  setData: (vale: DataType) => void;
  useInfo: any;
}

const RenderTypeSelector = ({selected, handleSelect}: RenderTypeSelectorProps) => { // @ts-ignore
  const {data, setData}: ContextData = useContext(Context);

  const isWide = useMediaQuery("(min-width:600px)", {noSsr: true});
  const isDynamic = useMemo(() => Boolean(data.isDynamic), [data.isDynamic]);

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
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <TypeSelector
        icon={item}
        label={label}
        enabled={enabled}
        description={description}
        selected={selected === item}
        handleSelect={handleSelect}/>
    </Grid>
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Tabs value={isDynamic ? 0 : 1} onChange={(_, newSel: number) => handleClick(newSel)}>
          <Tab label={isWide ? "Dynamic QR Codes" : "Dynamic"}/>
          <Tab label={isWide ? "Static QR Codes" : "Static"}/>
        </Tabs>
      </Grid>
      {renderTypeSelector("web", "Website", "Link to any page on the web", true)}
      {!isDynamic ?
        (<>
          {renderTypeSelector("email", "Email", "Send email messages", true)}
          {renderTypeSelector("sms", "SMS", "Send text messages", true)}
          {renderTypeSelector("vcard", "VCard", "Share your contact details", true)}
          {renderTypeSelector("text", "Text", "Display a short text message", true)}
          {renderTypeSelector("wifi", "WiFi", "Get connected to a WiFi network", true)}
        </>) : (<>
          {renderTypeSelector("vcard+", "VCard Plus", "Share your contact and social details", true)}
          {renderTypeSelector('business', 'Business', 'Describe your business or company', true)}
          {renderTypeSelector("social", "Social networks", "Share your social networks information", true)}
          {renderTypeSelector("link", "Link-in-Bio", "Share your own links, including social info", true)}
          {renderTypeSelector("coupon", "Coupon", "Share a coupon", true)}
          {renderTypeSelector("donations", "Donations", "Get donations from your supporters worldwide", true)}
          {process.env.REACT_NODE_ENV === 'develop' && renderTypeSelector("fundme", "Fund Me", "Start your own charity or fundraising campaign", true)}
          {process.env.REACT_NODE_ENV === 'develop' && renderTypeSelector("paylink", "Payment Link", "Receive payments worldwide", true)}
          {process.env.REACT_NODE_ENV === 'develop' && renderTypeSelector("crypto", "Crypto Payment", "Recieve crypto on your eWallet", true)}
        </>)
      }
      {renderTypeSelector("twitter", "Twitter", "Post a tweet", true)}
      {renderTypeSelector("whatsapp", "Whatsapp", "Send a Whatsapp message", true)}
      {renderTypeSelector("facebook", "Facebook", "Share an URL in your wall", true)}
      {isDynamic ? (<>
        {renderTypeSelector("pdf", "PDF file", "Share a PDF file", true)}
        {renderTypeSelector("audio", "Audio file", "Share an audio file", true)}
        {renderTypeSelector("gallery", "Gallery", "Share a gallery of images", true)}
        {renderTypeSelector("video", "Video files", "Share video files", true)}
      </>) : null}
    </Grid>
  );
};

export default RenderTypeSelector;

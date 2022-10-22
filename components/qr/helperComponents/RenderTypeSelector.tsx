import { MouseEvent, useCallback, useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MUIButton from "@mui/material/Button";
import CheckBoxEmpty from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxChecked from "@mui/icons-material/CheckBoxTwoTone";
import useMediaQuery from "@mui/material/useMediaQuery";
import { blue } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import TypeSelector from "./TypeSelector";
import Context from "../../context/Context";
import { DataType } from "../types/types";

interface RenderTypeSelectorProps {
  selected?: string | null;
  handleSelect: Function;
}

interface ContextData {
  data: DataType;
  setData: (vale: DataType) => void;
  useInfo: any;
}

const Button = styled(MUIButton)(() => ({ width: "calc(50% - 5px)", height: "32px" }));
const getColor = (condition: boolean): string => (condition ? "green" : blue[900]);

const RenderTypeSelector = ({ selected, handleSelect }: RenderTypeSelectorProps) => {
  // @ts-ignore
  const { data, setData }: ContextData = useContext(Context);
  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

  const isDynamic = useMemo(() => Boolean(data.isDynamic), [data.isDynamic]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    // @ts-ignore
    const dynamic: boolean = event.currentTarget.id === "dynamic";
    if (dynamic) {
      setData({ ...data, isDynamic: dynamic });
    } else if (data.isDynamic !== undefined) {
      const tempoData:DataType = { ...data };
      delete tempoData.isDynamic;
      setData(tempoData);
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
        handleSelect={handleSelect} />
    </Grid>
  );

  const renderNo = useCallback(() => (<CheckBoxEmpty sx={{ color: blue[900] }} />), []);
  const renderYes = useCallback(() => (<CheckBoxChecked color="success" />), []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            sx={{ borderColor: getColor(isDynamic), color: getColor(isDynamic) }}
            onClick={handleClick}
            startIcon={isDynamic ? renderYes() : renderNo()}
            key="dynamic"
            id="dynamic"
            variant="outlined">{isWide ? "Dynamic QR Codes" : "Dynamic"}</Button>
          <Button
            sx={{ borderColor: getColor(!isDynamic), color: getColor(!isDynamic) }}
            onClick={handleClick}
            startIcon={!isDynamic ? renderYes() : renderNo()}
            key="static"
            id="static"
            variant="outlined">{isWide ? "Static QR Codes" : "Static"}</Button>
        </Box>
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
          {renderTypeSelector("coupon", "Coupon", "Share a coupon", true)}
          {process.env.DEVELOPMENT_MODE && renderTypeSelector("donations", "Donations", "Get donations from your supporters worldwide.", true)}
        </>)
      }
      {renderTypeSelector("twitter", "Twitter", "Post a tweet", true)}
      {renderTypeSelector("whatsapp", "Whatsapp", "Send a Whatsapp message", true)}
      {renderTypeSelector("facebook", "Facebook", "Share an URL in your wall", true)}
      {isDynamic ? (<>
        {renderTypeSelector("pdf", "PDF file", "Share a PDF file", true)}
        {renderTypeSelector("audio", "Audio file", "Share an audio file", true)}
        {renderTypeSelector("image", "Image file", "Share image files", true)}
        {renderTypeSelector("video", "Video file", "Share video files", true)}
      </>) : null}
    </Grid>
  );
};

export default RenderTypeSelector;

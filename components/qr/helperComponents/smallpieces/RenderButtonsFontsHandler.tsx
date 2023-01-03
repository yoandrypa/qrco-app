import Grid from "@mui/material/Grid";
import RenderFontsSelector from "./RenderFontsSelector";
import RenderFontsSizeSelector from "./RenderFontsSizeSelector";
import RenderFontStyles from "./RenderFontStyles";
import {DataType} from "../../types/types";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {
  data?: DataType;
  handleValue: Function;
}

export default function RenderButtonsFontsHandler({data, handleValue}: Props) {
  const isWide = useMediaQuery("(min-width:1010px)", { noSsr: true });
  const isWideEnough = useMediaQuery("(min-width:483px)", { noSsr: true });

  return (
    <Grid container spacing={2}>
      <Grid item xs={isWide ? 4 : 12}>
        <RenderFontsSelector
          handleSelect={handleValue} property="buttonsFont" value={data?.buttonsFont || "none"} label="Font"/>
      </Grid>
      <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
        <RenderFontsSizeSelector
          handleSelect={handleValue}
          property="buttonsFontSize"
          value={data?.buttonsFontSize || "default"}
          label="Size"/>
      </Grid>
      <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
        <RenderFontStyles value={data?.buttonsFontStyle} property="buttonsFontStyle" handleValue={handleValue}/>
      </Grid>
    </Grid>
  )
}

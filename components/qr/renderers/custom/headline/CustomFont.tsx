import Grid from "@mui/material/Grid";
import RenderFontsSelector from "../../../helperComponents/smallpieces/RenderFontsSelector";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import RenderFontsSizeSelector from "../../../helperComponents/smallpieces/RenderFontsSizeSelector";
import RenderFontStyles from "../../../helperComponents/smallpieces/RenderFontStyles";

interface Props {
  handleValue: Function;
  headlineFont?: string;
  headlineFontSize?: string;
  headLineFontStyle?: string;
}

export default function CustomFont({handleValue, headlineFont, headlineFontSize, headLineFontStyle}: Props) {
  const isWide = useMediaQuery("(min-width:1010px)", { noSsr: true });
  const isWideEnough = useMediaQuery("(min-width:483px)", { noSsr: true });

  return (
    <Box sx={{mt: 2}}>
      <Grid container spacing={2}>
        <Grid item xs={isWide ? 4 : 12}>
          <RenderFontsSelector handleSelect={handleValue} property="headlineFont" value={headlineFont || "none"} label="Font"/>
        </Grid>
        <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
          <RenderFontsSizeSelector handleSelect={handleValue} property="headlineFontSize" value={headlineFontSize || "default"} label="Size"/>
        </Grid>
        <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
          <RenderFontStyles handleValue={handleValue} property="headLineFontStyle" value={headLineFontStyle} />
        </Grid>
      </Grid>
    </Box>
  )
}

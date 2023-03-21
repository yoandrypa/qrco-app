import {DataType} from "../../types/types";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";

import RenderFontsSelector from "./RenderFontsSelector";
import RenderFontsSizeSelector from "./RenderFontsSizeSelector";
import RenderFontStyles from "./RenderFontStyles";

interface Props {
  data?: DataType;
  handleValue: Function;
}

export default function RenderTitleDescFontsHandler({handleValue, data}: Props) {
  const isWide = useMediaQuery("(min-width:1010px)", { noSsr: true });
  const isWideEnough = useMediaQuery("(min-width:483px)", { noSsr: true });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={isWide ? 4 : 12}>
          <RenderFontsSelector handleSelect={handleValue} property="sectionTitleFont" value={data?.sectionTitleFont || "none"} label="Title font"/>
        </Grid>
        <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
          <RenderFontsSizeSelector handleSelect={handleValue} property="sectionTitleFontSize" value={data?.sectionTitleFontSize || "default"} label="Title size"/>
        </Grid>
        <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
          <RenderFontStyles value={data?.sectionTitleFontStyle} property="sectionTitleFontStyle" handleValue={handleValue}/>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{mt: '2px'}}>
        <Grid item xs={isWide ? 4 : 12}>
          <RenderFontsSelector handleSelect={handleValue} property="sectionDescFont" value={data?.sectionDescFont || "none"} label="Description font"/>
        </Grid>
        <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
          <RenderFontsSizeSelector handleSelect={handleValue} property="sectionDescFontSize" value={data?.sectionDescFontSize || "default"} label="Description size"/>
        </Grid>
        <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
          <RenderFontStyles value={data?.sectionDescFontStyle} property="sectionDescFontStyle" handleValue={handleValue}/>
        </Grid>
      </Grid>
    </>
  );
}

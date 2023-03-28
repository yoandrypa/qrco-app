import AdUnitsIcon from "@mui/icons-material/AdUnits";
import SpacingSelector from "../looseComps/SpacingSelector";
import {CustomCommon} from "../../types/types";

import dynamic from "next/dynamic";

const Typography = dynamic(() => import("@mui/material/Typography"));
const Box = dynamic(() => import("@mui/material/Box"));
const ShareIcon = dynamic(() => import("@mui/icons-material/Share"));
const RenderDisplacement = dynamic(() => import("../looseComps/RenderDisplacement"));

interface RenderUpperProps extends CustomCommon {
  includeSharerConfig?: boolean;
}

export default function RenderUpperSectionHeightAndSharer({data, handleValue, includeSharerConfig}: RenderUpperProps) {
  return (
    <>
      <SpacingSelector
        selection={data?.upperHeight || 'default'}
        item="upperHeight"
        message="Top margin calibrator"
        handleValues={handleValue}
        noNarrow
        icon={
          <AdUnitsIcon fontSize="small" color="primary" sx={{mr: '5px'}}/>
        }
      />
      {includeSharerConfig && (
        <Box sx={{mb: 1}}>
          <Box sx={{mt: 2, display: 'flex'}}>
            <ShareIcon fontSize="small" color="primary" />
            <Typography sx={{ml: '5px'}}>{'Share button position'}</Typography>
          </Box>
          <RenderDisplacement
            property="sharerPosition"
            handleValue={handleValue}
            direction={data?.sharerPosition}
            includeDefault
            includeNo
            hideClear
          />
        </Box>
      )}
    </>
  );
}

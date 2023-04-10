import AdUnitsIcon from "@mui/icons-material/AdUnits";
import SpacingSelector from "../looseComps/SpacingSelector";
import {CustomCommon} from "../../types/types";

import dynamic from "next/dynamic";

const QRPreviewForSharerConfig = dynamic(() => import("./QRPreviewForSharerConfig"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const Box = dynamic(() => import("@mui/material/Box"));
const ShareIcon = dynamic(() => import("@mui/icons-material/Share"));
const RenderDisplacement = dynamic(() => import("../looseComps/RenderDisplacement"));

interface RenderUpperProps extends CustomCommon {
  includeSharerConfig?: boolean;
  includeQrCode?: boolean;
}

export default function RenderUpperSectionHeightAndSharer(
  {data, handleValue, includeSharerConfig, includeQrCode}: RenderUpperProps
) {
  const isEmpty = Boolean(data?.layout?.includes('empty'));

  return (
    <>
      <SpacingSelector
        selection={data?.upperHeight || 'default'}
        item="upperHeight"
        message="Top margin calibrator"
        handleValues={handleValue}
        includeSmall={isEmpty}
        noNarrow={!isEmpty}
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
          <Box sx={{display: 'flex', flexDirection: {sm: 'row', xs: 'column'}, justifyContent: {sm: 'space-between', xs: 'inherit'}}}>
            <RenderDisplacement
              property="sharerPosition"
              handleValue={handleValue}
              direction={data?.sharerPosition}
              includeDefault
              includeNo
              hideClear
            />
            {includeQrCode && data?.sharerPosition !== 'no' && <QRPreviewForSharerConfig handleValue={handleValue} data={data} />}
          </Box>
        </Box>
      )}
    </>
  );
}

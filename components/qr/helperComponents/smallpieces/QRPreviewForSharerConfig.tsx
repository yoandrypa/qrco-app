import {ChangeEvent, useContext} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";

import {CustomCommon} from "../../types/types";
import {getOptionsForPreview} from "../../../../helpers/qr/auxFunctions";
import Context from "../../../context/Context";

import dynamic from "next/dynamic";

const RenderPreview = dynamic(() => import("../../renderers/RenderPreview"));

export default function QRPreviewForSharerConfig({data, handleValue}: CustomCommon) {
  const {selected, options, background, frame, cornersData, dotsData} = useContext(Context);

  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('hideQrForSharing')(!event.target.checked);
  }

  const getDataBack = (item: string) => {
    const f = new File([item], 'filename.svg', {type: 'image/svg+xml'});

    if (!data?.qrForSharing || data.qrForSharing.size !== f.size) {
      handleValue('qrForSharing')(f);
    }
  }

  return <Box sx={{display: 'grid'}}>
    <FormControlLabel control={<Switch checked={data?.hideQrForSharing !== true} onChange={handle} />}
                      label="Include QR code for sharing it" sx={{mt: {sm: '-5px', xs: 0}}}/>
    {!data?.hideQrForSharing && (
      <RenderPreview
        getDataBack={getDataBack}
        onlyPreview
        width={270}
        qrDesign={getOptionsForPreview(data, options, background, frame, cornersData, dotsData, selected)}
      />
    )}
  </Box>
}

import {useContext, useState} from "react";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {handleDesignerString} from "../../../../helpers/qr/helpers";
import {DataType} from "../../types/types";
import Context from "../../../context/Context";
import {handleCopy} from "../../../helpers/generalFunctions";

import dynamic from "next/dynamic";

const RenderCopied = dynamic(() => import("../../helperComponents/looseComps/RenderCopiedNotification"));

interface RenderGenerateProps {
  selected: string;
  data: DataType
}

export default function RenderPreviewURLString({selected, data}: RenderGenerateProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // @ts-ignore
  const { isWrong, userInfo }: { isWrong: boolean, userInfo: any} = useContext(Context);

  if (userInfo === null) {
    return null;
  }

  const copyHandler = () => {
    handleCopy(handleDesignerString(selected, data), setCopied);
  }

  return (
    <>
      <Divider sx={{my: 2}}/>
      <TextField
        value={handleDesignerString(selected, data)}
        size="small"
        fullWidth
        label="Output URL"
        disabled={isWrong}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Copy to clipboard">
                <IconButton disabled={isWrong} size="small" onClick={copyHandler}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )
        }}
      />
      {copied && <RenderCopied setCopied={setCopied} />}
    </>
  );
}

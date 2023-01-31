import {ALLOWED_FILE_EXTENSIONS, FILE_LIMITS} from "../../../consts";
import {conjunctMethods, toBytes} from "../../../utils";
import FileUpload from "react-material-file-upload";
import Typography from "@mui/material/Typography";

import pluralize from "pluralize";
import dynamic from "next/dynamic";
import {ChangeEvent} from "react";

import {DataType} from "../types/types";

const Box = dynamic(() => import("@mui/material/Box"));
const FormControlLabel = dynamic(() => import("@mui/material/FormControlLabel"));
const Switch = dynamic(() => import("@mui/material/Switch"));

interface AssetsProps {
  type: "gallery" | "video" | "pdf" | "audio";
  totalFiles: number;
  data: DataType;
  displayUpto?: boolean;
  setData: Function;
}

export default function RenderAssetsData({type, totalFiles, data, setData, displayUpto}: AssetsProps) {
  const handleChange = (files: File[]) => {
    if (!data.files || files.length === 0) {
      setData({ ...data, files });
      return;
    }

    const isSameFile = (uploadedFile: File, fileToUpload: File) => {
      return uploadedFile.name === fileToUpload.name && uploadedFile.lastModified === fileToUpload.lastModified;
    };

    const A = [...data.files];
    const B = [...files];
    let C = conjunctMethods.intersection(A, B, isSameFile);
    if (C.length === 0) {
      C = A.concat(B);
    }

    setData({ ...data, files: C });
  };

  const handleInclude = (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: DataType) => {
      const newData = {...prev};
      if (newData.includeDescription !== undefined && !event.target.checked) {
        delete newData.includeDescription;
      } else {
        newData.includeDescription = event.target.checked;
      }
      return newData;
    });
  }

  let title = "Drag 'n' drop some files here, or click to select files.";
  if (totalFiles > 1) {
    title += ` Selected ${data.files?.length || 0} of ${totalFiles} allowed`;
  }

  return (
    <>
      <FileUpload
        onChange={handleChange}
        accept={ALLOWED_FILE_EXTENSIONS[type]}
        multiple={["gallery", "video"].includes(type)}
        // @ts-ignore
        disabled={data["files"]?.length >= totalFiles}
        // @ts-ignore
        value={data["files"]}
        title={title}
        maxFiles={FILE_LIMITS[type].totalFiles}
        maxSize={toBytes(FILE_LIMITS[type].totalMbPerFile, "MB")}
      />
      {displayUpto && (
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
          <FormControlLabel label="Include section description" control={
            <Switch checked={data?.includeDescription} inputProps={{'aria-label': 'isAutoOpen'}} onChange={handleInclude} />}
          />
          <Typography variant="caption" sx={{color: theme => theme.palette.text.disabled}}>
            {`Up to ${pluralize('files', totalFiles, true)}`}
          </Typography>
        </Box>
      )}
    </>
  );
}

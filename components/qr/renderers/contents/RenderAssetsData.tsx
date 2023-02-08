import {ALLOWED_FILE_EXTENSIONS, FILE_LIMITS} from "../../../../consts";
import {conjunctMethods, toBytes} from "../../../../utils";
import FileUpload from "react-material-file-upload";
import Typography from "@mui/material/Typography";

import pluralize from "pluralize";
import dynamic from "next/dynamic";
import {ChangeEvent} from "react";

import {DataType, Type} from "../../types/types";

const Box = dynamic(() => import("@mui/material/Box"));
const FormControlLabel = dynamic(() => import("@mui/material/FormControlLabel"));
const Switch = dynamic(() => import("@mui/material/Switch"));

interface AssetsProps {
  type: "gallery" | "video" | "pdf" | "audio";
  totalFiles: number;
  data?: Type;
  displayUpto?: boolean;
  setData: Function;
  index: number;
}

export default function RenderAssetsData({type, totalFiles, data, setData, displayUpto, index}: AssetsProps) {
  const handleChange = (files: File[]) => {
    if (!data?.files || files.length === 0) {
      setData((prev: DataType) => {
        const newData = {...prev};
        if (index === -1) {
          newData.files = files;
        } else { // @ts-ignore
          if (!newData.custom[index].data) { newData.custom[index].data = {}; } // @ts-ignore
          newData.custom[index].data.files = files;
        }
        return newData;
      });
      return;
    }

    const isSameFile = (uploadedFile: File, fileToUpload: File) => {
      return uploadedFile.name === fileToUpload.name && uploadedFile.lastModified === fileToUpload.lastModified;
    };

    setData((prev: DataType) => {
      const newData = {...prev};

      const A = data.files ? [...data.files] : [];
      const B = [...files];
      let C = conjunctMethods.intersection(A, B, isSameFile);
      if (C.length === 0) { C = A.concat(B); }

      if (index === -1) {
        newData.files = C;
      } else { // @ts-ignore
        if (!newData.custom[index].data) { newData.custom[index].data = {}; } // @ts-ignore
        newData.custom[index].data.files = C;
      }
      return newData;
    });
  };

  const handleInclude = (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: DataType) => {
      const newData = {...prev};
      if (index === -1) {
        if (newData.includeDescription !== undefined && !event.target.checked) {
          delete newData.includeDescription;
        } else {
          newData.includeDescription = event.target.checked;
        }
      } else {
        if (newData?.custom?.[index]?.data?.includeDescription !== undefined && !event.target.checked) { // @ts-ignore
          delete newData.custom[index].data.includeDescription;
        } else { // @ts-ignore
          if (!newData.custom[index].data) { newData.custom[index].data = {}; } // @ts-ignore
          newData.custom[index].data.includeDescription = event.target.checked;
        }
      }
      return newData;
    });
  };

  let title = "Drag 'n' drop some files here, or click to select files.";
  if (totalFiles > 1) {
    title += ` Selected ${data?.files?.length || 0} of ${totalFiles} allowed`;
  }

  return (
    <>
      <FileUpload
        onChange={handleChange}
        accept={ALLOWED_FILE_EXTENSIONS[type]}
        multiple={["gallery", "video"].includes(type)} // @ts-ignore
        disabled={data?.files && data.files.length >= totalFiles} // @ts-ignore
        value={data?.files || []}
        title={title}
        maxFiles={FILE_LIMITS[type].totalFiles}
        maxSize={toBytes(FILE_LIMITS[type].totalMbPerFile, "MB")}
      />
      {displayUpto && (
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
          <FormControlLabel label="Include section description" control={
            <Switch
              checked={data?.includeDescription}
              inputProps={{'aria-label': 'includeDescription'}}
              onChange={handleInclude} />}
          />
          <Typography variant="caption" sx={{color: theme => theme.palette.text.disabled}}>
            {`Up to ${pluralize('files', totalFiles, true)}`}
          </Typography>
        </Box>
      )}
    </>
  );
}

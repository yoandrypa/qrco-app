import {ChangeEvent, useEffect} from "react";

import {ALLOWED_FILE_EXTENSIONS, FILE_LIMITS} from "../../../../consts";
import {conjunctMethods, toBytes} from "../../../../utils";
import FileUpload from "react-material-file-upload";
import {DataType, Type} from "../../types/types";

import pluralize from "pluralize";

import dynamic from "next/dynamic";

const Box = dynamic(() => import("@mui/material/Box"));
const FormControlLabel = dynamic(() => import("@mui/material/FormControlLabel"));
const Switch = dynamic(() => import("@mui/material/Switch"));
const Typography = dynamic(() => import("@mui/material/Typography"));

interface AssetsProps {
  type: "gallery" | "video" | "pdf" | "audio";
  totalFiles: number;
  data?: Type;
  setData: Function;
  index: number;
  doNotAutoOpen?: boolean;
}

export default function RenderAssetsData({type, totalFiles, data, setData, index, doNotAutoOpen}: AssetsProps) {
  const handleValues = (autoOpen: boolean) => {
    setData((prev: DataType) => {
      const newData = {...prev};
      if (index === undefined || index === -1) {
        newData.autoOpen = autoOpen;
        if (newData.autoOpen !== undefined && !autoOpen) { delete newData.autoOpen; }
      } else { // @ts-ignore
        if (!newData.custom[index].data) { newData.custom[index].data = {}; } // @ts-ignore
        newData.custom[index].data.autoOpen = autoOpen; // @ts-ignore
        if (!autoOpen) { delete newData.custom[index].data.autoOpen; }
      }
      return newData;
    });
  };

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
    } else {
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
    }
  };

  let title = "Drag 'n' drop some files here, or click to select files.";
  if (totalFiles > 1) {
    title += ` Selected ${data?.files?.length || 0} of ${totalFiles} allowed`;
  }

  useEffect(() => {
    if ((data?.files?.length !== 1 || doNotAutoOpen) && data?.autoOpen) {
      handleValues(false);
    }
  }, [data?.files?.length]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
        {!doNotAutoOpen && type === 'pdf' && data?.files?.length === 1 && (
          <FormControlLabel label="Auto open" control={
            <Switch checked={data?.autoOpen} inputProps={{'aria-label': 'isAutoOpen'}} sx={{mr: '5px'}}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleValues(event.target.checked)} />}
          />
        )}
        <Typography variant="caption" sx={{color: theme => theme.palette.text.disabled}}>
          {`Up to ${pluralize('files', totalFiles, true)}`}
        </Typography>
      </Box>
    </>
  );
}

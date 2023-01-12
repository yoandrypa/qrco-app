import Common from "../helperComponents/Common";
import FileUpload from "react-material-file-upload";
import React, {ChangeEvent, useContext, useEffect} from "react";
import Grid from "@mui/material/Grid";
import {ALLOWED_FILE_EXTENSIONS, FILE_LIMITS} from "../../../consts";
import {conjunctMethods, toBytes} from "../../../utils";

import pluralize from "pluralize";
import Context from "../../context/Context";
import RenderTitleDesc from "./contents/RenderTitleDesc";

import dynamic from "next/dynamic";

const Switch = dynamic(() => import("@mui/material/Switch"));
const FormControlLabel = dynamic(() => import("@mui/material/FormControlLabel"));

type AssetDataProps = {
  type: "gallery" | "video" | "pdf" | "audio";
  data: {
    files?: File[];
    autoOpen?: boolean;
    titleAbout?: string;
    descriptionAbout?: string;
  };
  handleValues: Function;
  setData: Function;
}

const AssetData = ({ type, data, setData, handleValues }: AssetDataProps) => {
  // @ts-ignore
  const { setIsWrong } = useContext(Context);

  useEffect(() => {
    // @ts-ignore
    setIsWrong(!data["files"] || data["files"].length === 0);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (files: File[]) => {
    if (!data["files"] || files.length === 0) {
      setData({ ...data, files });
      return;
    }

    const isSameFile = (uploadedFile: File, fileToUpload: File) => {
      return uploadedFile.name === fileToUpload.name && uploadedFile.lastModified === fileToUpload.lastModified;
    };
    const A = data["files"];
    const B = files;
    let C = conjunctMethods.intersection(A, B, isSameFile);
    if (C.length === 0) {
      C = A.concat(B);
    }

    setData({ ...data, files: C });
  };

  const totalFiles = FILE_LIMITS[type].totalFiles;
  let title = "Drag 'n' drop some files here, or click to select files.";
  if (totalFiles > 1) {
    title += ` Selected ${data["files"]?.length || 0} of ${totalFiles} allowed`;
  }

  useEffect(() => {
    if (data?.files?.length !== 1 && data?.autoOpen) {
      handleValues('autoOpen')(false);
    }
  }, [data?.files?.length]);

  return (
    <Common
      msg={`You can upload a maximum of ${pluralize("file", totalFiles, true)} of size ${FILE_LIMITS[type].totalMbPerFile} MBs.`}>
      <Grid container>
        <Grid item xs={12}>
          <RenderTitleDesc handleValues={handleValues} title={data.titleAbout} description={data.descriptionAbout} />
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        {type === 'pdf' && data?.files?.length === 1 && (
          <Grid item xs={12}>
            <FormControlLabel label="Auto open" control={
              <Switch checked={data?.autoOpen} inputProps={{'aria-label': 'isAutoOpen'}}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleValues('autoOpen')(event.target.checked)} />}
            />
          </Grid>
        )}
      </Grid>
    </Common>
  );
};

export default AssetData;

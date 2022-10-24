import Common from "../helperComponents/Common";
import FileUpload from "react-material-file-upload";
import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from "../../../consts";
import { conjunctMethods, toBytes } from "../../../utils";

import Notifications from "../../notifications/Notifications";

import pluralize from "pluralize";
import Context from "../../context/Context";

export type AssetDataProps = {
  type: "image" | "video" | "pdf" | "audio";
  data: {
    files?: File[];
  };
  setData: Function;
}

const AssetData = ({ type, data, setData }: AssetDataProps) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
  };
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

  return (
    <Common
      msg={`You can upload a maximum of ${pluralize("file", FILE_LIMITS[type].totalFiles, true)} of size ${FILE_LIMITS[type].totalMbPerFile} MBs.`}>
      <Grid container>
        <Grid item xs={12}>
          <FileUpload
            onChange={handleChange}
            accept={ALLOWED_FILE_EXTENSIONS[type]}
            multiple={["image", "video"].includes(type)}
            // @ts-ignore
            value={data["files"]}
            maxFiles={FILE_LIMITS[type].totalFiles}
            // @ts-ignore
            maxSize={toBytes(FILE_LIMITS[type].totalMbPerFile, "MB")}
          />
        </Grid>
      </Grid>
    </Common>
  );
};

export default AssetData;

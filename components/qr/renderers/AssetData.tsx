import Common from "../helperComponents/Common";
import FileUpload from "react-material-file-upload";
import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from "../../../consts";
import { toBytes } from "../../../utils";

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

/*const validateFile = (files: File[], type: string, total: number) => {
  let errors = [];
  // @ts-ignore
  if (files.length + total > FILE_LIMITS[type].totalFiles) {
    errors.push("The maximum number for this type of files has been reached.");
  }

  files.forEach(file => {
    const fileSize = file.size / (1024 ** 2);
    // @ts-ignore
    if (fileSize > FILE_LIMITS[type].totalMbPerFile) {
      errors.push(`The file '${file.name}' exceeds the allowed size.`);
    }
  });

  return errors.join("\n");
};*/

const AssetData = ({ type, data, setData }: AssetDataProps) => {
  const [alertMessage, setAlertMessage] = useState("");

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
  };
  // @ts-ignore
  const { setIsWrong } = useContext(Context);

  useEffect(() => {
    // @ts-ignore
    setIsWrong(!data["files"] || data["files"].length === 0);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  /*const handleValues = (files: File[]) => {
    //const { files } = event.target;
    const tempo = { ...data };
    if (files?.length) {
      const filesToUpload = files;
      const errors = validateFile(filesToUpload, type, tempo["files"]?.length || 0);
      if (errors) {
        setAlertMessage(errors);
        return;
      }
      // @ts-ignore
      if (tempo["files"] && event.target.multiple) {
        const isAlreadyIncluded = (uploadedFile: File, fileToUpload: File) => {
          return uploadedFile.name === fileToUpload.name && uploadedFile.lastModified === fileToUpload.lastModified;
        };

        filesToUpload.forEach(async fileToUpload => {
          // @ts-ignore
          if (!tempo["files"].some(uploadedFile => isAlreadyIncluded(uploadedFile, fileToUpload))) {
            // @ts-ignore
            tempo["files"].push(fileToUpload);
          }
        });
      } else {
        // @ts-ignore
        tempo["files"] = [...filesToUpload];
      }
      // @ts-ignore
    }
    setData(tempo);
  };*/

  const handleChange = (files: File[]) => {
    setData({ ...data, files });
  };

  /*const handleDelete = (index: number) => {
    const tempo = { ...data };
    tempo["files"]?.splice(index, 1);
    setData(tempo);
  };*/

  return (
    <Common
      msg={`You can upload a maximum of ${pluralize("file", FILE_LIMITS[type].totalFiles, true)} of size ${FILE_LIMITS[type].totalMbPerFile} MBs.`}>
      <Grid container>
        <Grid item xs={12}>
          {/*<Button variant="outlined" component="label" startIcon={<UploadRounded />}
            // @ts-ignore
                  disabled={data["files"]?.length >= FILE_LIMITS[type].totalFiles}>
            Upload {fixArticles("a " + type)}
            <input id="assetFile"
              // @ts-ignore
                   onChange={handleValues}
                   onClick={event => {
                     // @ts-ignore
                     event.target.value = null;
                   }}
                   hidden
                   accept={ALLOWED_FILE_EXTENSIONS[type]}
                   multiple={["image", "video"].includes(type)}
                   type="file" />
          </Button>*/}
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
        {/*<Grid item xs={12} paddingTop={1}>
          <Divider textAlign="right">File list {data["files"]?.length || 0}/{FILE_LIMITS[type].totalFiles}</Divider>
          <List dense>
            @ts-ignore
            {(data && data["files"]) ? data["files"].map((file: File, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton color="error" edge="end" aria-label="delete file" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: PRIMARY_LIGHT_COLOR }}>
                    {getIconByType(type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={file.name}
                              secondary={`Size: ${formatBytes(file.size)}, Last update: ${humanDate(file.lastModified)}`} />
              </ListItem>
            )) : null}
          </List>
        </Grid>*/}
      </Grid>
      {alertMessage &&
        <Notifications severity="warning" message={alertMessage} onClose={handleClose} autoHideDuration={8000} />}
    </Common>
  );
};

export default AssetData;

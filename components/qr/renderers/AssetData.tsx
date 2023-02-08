import {ChangeEvent, useContext, useEffect} from "react";
import Grid from "@mui/material/Grid";

import Context from "../../context/Context";
import Common from "../helperComponents/Common";
import RenderTitleDesc from "./contents/RenderTitleDesc";
import RenderAssetsData from "./contents/RenderAssetsData";
import {FILE_LIMITS} from "../../../consts";
import {conjunctMethods, formatBytes} from "../../../utils";

import pluralize from "pluralize";

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
    setIsWrong(!data.files || data.files.length === 0);
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

  useEffect(() => {
    if (data?.files?.length !== 1 && data?.autoOpen) {
      handleValues('autoOpen')(false);
    }
  }, [data?.files?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common
      msg={`You can upload a maximum of ${pluralize("file", totalFiles, true)} of size ${formatBytes(FILE_LIMITS[type].totalMbPerFile * 1048576)}.`}>
      <Grid container>
        <Grid item xs={12}>
          <RenderTitleDesc handleValues={handleValues} title={data.titleAbout} description={data.descriptionAbout} />
        </Grid>
        <Grid item xs={12}>
          <RenderAssetsData setData={setData} data={data} type={type} totalFiles={totalFiles} index={-1} />
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

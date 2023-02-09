import {FILE_LIMITS} from "../../../consts";
import {formatBytes} from "../../../utils";

import pluralize from "pluralize";

import Custom from "./Custom";

type AssetDataProps = {
  type: "gallery" | "video" | "pdf" | "audio";
  data: {
    files?: File[];
    autoOpen?: boolean;
  };
  handleValues: Function;
  setData: Function;
  setIsWrong: (isWrong: boolean) => void;
}

const AssetData = ({ type, data, setData, handleValues, setIsWrong }: AssetDataProps) => {
  return (
    <Custom
      data={data}
      setData={setData}
      handleValues={handleValues}
      setIsWrong={setIsWrong}
      tip={`You can upload a maximum of ${pluralize("file", FILE_LIMITS[type].totalFiles, true)} of size ${formatBytes(FILE_LIMITS[type].totalMbPerFile * 1048576)}.`}
      predefined={['title', type]}
    />
  );
};

export default AssetData;

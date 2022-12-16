import {useEffect} from "react";
import Box from "@mui/material/Box";

import Common from "../helperComponents/Common";
import RenderSocials from "./helpers/RenderSocials";

import {DataType} from "../types/types";
import socialsAreValid from "./validator";

interface NetWorksProps {
  data: DataType;
  setData: Function;
  setIsWrong?: (isWrong: boolean) => void;
}

const NetworksData = ({data, setData, setIsWrong}: NetWorksProps) => {
  useEffect(() => {
    if (setIsWrong !== undefined) {
      setIsWrong(!data?.socials || data.socials.length === 0 || !socialsAreValid(data));
    }
  }, [data]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="Your social networks. Users can reach you using the social networks.">
      <Box sx={{ mt: 2 }}>
        <RenderSocials data={data} setData={setData} showTitleAndDesc />
      </Box>
    </Common>
  );
}

export default NetworksData;

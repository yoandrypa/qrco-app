import {useEffect} from "react";
import Box from "@mui/material/Box";

import Common from "../helperComponents/Common";
import RenderSocials from "./helpers/RenderSocials";

import {SocialProps} from "../types/types";
import socialsAreValid from "./validator";
import {SOCIALS} from "../constants";

interface NetWorksProps {
  data: SocialProps;
  setData: Function;
  setIsWrong?: (isWrong: boolean) => void;
}

const NetworksData = ({data, setData, setIsWrong}: NetWorksProps) => {
  useEffect(() => {
  if (setIsWrong !== undefined) {
    setIsWrong(!Object.keys(data || {}).filter((x: string) => SOCIALS.includes(x)).length || !socialsAreValid(data));
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.facebook, data.whatsapp, data.twitter, data.instagram, data.linkedin, data.pinterest, data.telegram, data.youtube]);

  return (
    <Common msg="Your social networks. Users can reach you using the social networks.">
      <Box sx={{ mt: 2 }}>
        <RenderSocials data={data} setData={setData} />
      </Box>
    </Common>
  );
}

export default NetworksData;

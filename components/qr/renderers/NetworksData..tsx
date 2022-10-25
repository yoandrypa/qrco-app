import {useContext} from "react";
import Box from "@mui/material/Box";

import Common from "../helperComponents/Common";
import RenderSocials from "./helpers/RenderSocials";

import {SocialProps} from "../types/types";
import Context from "../../context/Context";

interface NetWorksProps {
  data: SocialProps;
  setData: Function;
}

interface ContextProps {
  setIsWrong: (isWrong: boolean) => void;
}

const NetworksData = ({data, setData}: NetWorksProps) => {
  // @ts-ignore
  const { setIsWrong }: ContextProps = useContext(Context);

  return (
    <Common msg="Your social networks. Users can reach you using the social networks.">
      <Box sx={{ mt: 2 }}>
        <RenderSocials data={data} setData={setData} setIsWrong={setIsWrong} isWrong={false} />
      </Box>
    </Common>
  );
}

export default NetworksData;

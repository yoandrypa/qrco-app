// import {useEffect} from "react";
// import Box from "@mui/material/Box";
//
// import Common from "../helperComponents/Common";
// import RenderSocials from "./contents/RenderSocials";

import {DataType} from "../types/types";
// import socialsAreValid from "./validator";
import Custom from "./Custom";

interface NetWorksProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

const NetworksData = ({data, setData, setIsWrong, handleValues}: NetWorksProps) => {
  // useEffect(() => {
  //   if (setIsWrong !== undefined) {
  //     setIsWrong(!data?.socials || data.socials.length === 0 || !socialsAreValid(data));
  //   }
  // }, [data]);  // eslint-disable-line react-hooks/exhaustive-deps

  return <Custom
    data={data}
    setData={setData}
    handleValues={handleValues}
    setIsWrong={setIsWrong}
    tip="Your social networks. Users can reach you using the social networks."
    predefined={
      ['title', 'socials']
    }
  />

  // return (
  //   <Common msg="Your social networks. Users can reach you using the social networks.">
  //     <Box sx={{ mt: 2 }}>
  //       <RenderSocials data={data} setData={setData} showTitleAndDesc index={-1} />
  //     </Box>
  //   </Common>
  // );
}

export default NetworksData;

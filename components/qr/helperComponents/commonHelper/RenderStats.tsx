import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import VisitDetailsSections from "../../../visit/VisitDetailsSections";
import {findByShortLink} from "../../../../handlers/visit";

import {releaseWaiting, startWaiting} from "../../../Waiting";

interface StatsDetailsProps {
  visitCount: number;
  userId: string;
  createdAt: number;
}

function RenderStats({visitCount, userId, createdAt}: StatsDetailsProps) {
  const [data, setData] = useState<any>(undefined);

  useEffect(() => {
    const getVisits = async () => {
      const result = await findByShortLink({ userId, createdAt });
      setData(result);
    };

    if (visitCount > 0) { // @ts-ignore
      startWaiting();
      getVisits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      releaseWaiting();
    }
  }, [data]);

  if (visitCount === 0) {
    return (
      <Box sx={{width: '100%', textAlign: 'center', p: 2}}>
        <Typography>No data to show...</Typography>
      </Box>
    );
  }

  if (data === undefined) {
    return (
      <Box sx={{width: '100%', textAlign: 'center', p: 2}}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return <VisitDetailsSections visitData={data} visitCount={visitCount}/>;
}

export default RenderStats;

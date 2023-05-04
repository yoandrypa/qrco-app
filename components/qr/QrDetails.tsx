import { ReactNode, SyntheticEvent, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import VisitDetailsSections from "../visit/VisitDetailsSections";
import QrDetail from "./QrDetail";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import RenderSamplePreview from "./helperComponents/smallpieces/RenderSamplePreview";
import { previewQRGenerator } from "../../helpers/qr/auxFunctions";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import dynamic from "next/dynamic";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { findByShortLink } from "../../handlers/visit";
import { useCheckOnlyQr } from "../../helpers/qr/helpers";

const RenderPreviewButton = dynamic(() => import("./helperComponents/smallpieces/RenderPreviewButton"));
const RenderPreviewDrawer = dynamic(() => import("./helperComponents/smallpieces/RenderPreviewDrawer"));

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const QrDetails = ({ visitData, qrData, goBack }: any) => {
  const [value, setValue] = useState(0);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [data, setData] = useState<any>(undefined);

  const isWideForPreview = useMediaQuery("(min-width:925px)", {noSsr: true});

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const isOnlyQr = useCheckOnlyQr(qrData.qrType, qrData);

  useEffect(() => {
    if (!data) {
      const getVisits = async (userId: string, createdAt: number) => {
        const result = await findByShortLink({ userId, createdAt });
        setData(result);
      };

      // @ts-ignore
      if (qrData.shortLinkId?.visitCount > 0) { // @ts-ignore
        // const createdAt = (new Date(qrData.shortLinkId.createdAt)).getTime(); // eslint-disable-line react-hooks/exhaustive-deps
        getVisits(qrData.shortLinkId.userId, qrData.shortLinkId.createdAt.getTime());
      }
      // setData({ qrData, visits });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", position: 'relative' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{ height: "30px", alignItems: "center" }}
          >
            <Tab icon={<DescriptionOutlinedIcon fontSize="small"/>} iconPosition="start"
                 label="Details" sx={{ mt: "-10px", mb: "-15px" }}/>
            <Tab icon={<QueryStatsIcon fontSize="small"/>} iconPosition="start"
                 label="Stats" sx={{ mt: "-10px", mb: "-15px" }}/>
          </Tabs>
          {goBack && (
            <Tooltip title="Go back">
              <IconButton onClick={() => goBack(undefined)} sx={{position: 'absolute', top: 1, right: 0}}>
                <ArrowBackIcon/>
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <TabPanel value={value} index={0}>
          <QrDetail qrData={qrData}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VisitDetailsSections visitData={data} visitCount={qrData?.shortLinkId?.visitCount || 0}/>
        </TabPanel>
      </Box>
      {isWideForPreview && (
        <RenderSamplePreview
          style={{
            ml: "15px",
            mt: "5px",
            width: "370px",
            position: "sticky",
            top: "100px"
          }}
          step={1}
          noEditImages
          isDynamic={qrData.isDynamic || false}
          code={qrData?.shortLinkId?.address || ''}
          onlyQr={isOnlyQr}
          data={previewQRGenerator(qrData, qrData.qrType, undefined, true)}
          qrOptions={qrData.qrOptionsId} />
      )} {/* @ts-ignore */}
      {!openPreview && !isWideForPreview && <RenderPreviewButton setOpenPreview={setOpenPreview} message="Sample"/>}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer setOpenPreview={setOpenPreview} border={35} height={!qrData.isDynamic ? 425 : 700} > {/* @ts-ignore */}
          <RenderSamplePreview
            noEditImages
            code={qrData?.shortLinkId?.address || ''}
            onlyQr={isOnlyQr}
            data={previewQRGenerator(qrData, qrData.qrType, undefined, true)}
            qrOptions={qrData.qrOptionsId}
            isDrawed style={{mt: '-15px'}} step={1} isDynamic={qrData.isDynamic || false} />
        </RenderPreviewDrawer>
      )}
    </Box>
  );
};

export default QrDetails;

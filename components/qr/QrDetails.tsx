import Box from "@mui/material/Box";
import VisitDetailsSections from "../visit/VisitDetailsSections";
import React from "react";
import QrDetail from "./QrDetail";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import RenderSamplePreview
  from "./helperComponents/smallpieces/RenderSamplePreview";
import { previewQRGenerator } from "../../helpers/qr/auxFunctions";
import { ONLY_QR } from "./constants";

interface TabPanelProps {
  children?: React.ReactNode;
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const QrDetails = ({ visitData, qrData }: any) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{ height: "30px", alignItems: "center" }}
          >
            <Tab icon={<DescriptionOutlinedIcon fontSize="small"/>}
                 iconPosition="start"
                 label="Details" sx={{ mt: "-10px", mb: "-15px" }}/>
            <Tab icon={<QueryStatsIcon fontSize="small"/>} iconPosition="start"
                 label="Stats" sx={{ mt: "-10px", mb: "-15px" }}/>
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <QrDetail qrData={qrData}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VisitDetailsSections visitData={visitData}/>
        </TabPanel>
      </Box>
      <RenderSamplePreview selected={qrData.qrType} style={{
        ml: "15px",
        mt: "5px",
        width: "370px",
        position: "sticky",
        top: "100px",
      }} step={0} isDynamic={qrData.isDynamic || false}
                           code={"ssswww"}
                           onlyQr={ONLY_QR.includes(qrData.qrType) ||
                             !qrData.isDynamic}
                           data={previewQRGenerator(qrData, qrData.qrType)}
                           qrOptions={qrData.qrOptionsId}/>
    </Box>
  );
};

export default QrDetails;

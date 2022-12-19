import Box from "@mui/material/Box";
import VisitDetailsSections from "../visit/VisitDetailsSections";
import React from "react";
import QrDetail from "./QrDetail";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DescriptionIcon from "@mui/icons-material/Description";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import RenderSamplePreview from "./helperComponents/smallpieces/RenderSamplePreview";
import {previewQRGenerator} from "../../helpers/qr/auxFunctions";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          {children}
        </Box>
      )}
    </div>
  );
};

const QrDetails = ({visitData, qrData}: any) => {
  const [value, setValue] = React.useState(0);

  // const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // @ts-ignore
  // const {setLoading, setOptions} = useContext(Context);

  // const handleEdit = useCallback((qr: QrDataType) => {
  //   setLoading(true);
  //   setOptions({...qr.qrOptionsId, ...qr, mode: "edit"});
  //   router.push(QR_CONTENT_ROUTE, undefined, {shallow: true}).then(() => setLoading(false));
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const actions = [
  //   {icon: <EditIcon/>, name: "Edit", action: () => handleEdit(qrData)},
  //   {icon: <PauseIcon/>, name: "Pause", action: () => {}},
  //   {icon: <BlockIcon/>, name: "Banned", action: () => {}},
  //   {icon: <FileCopyIcon/>, name: "Copy", action: () => {}},
  //   {icon: <SaveIcon/>, name: "Save", action: () => {}},
  //   {icon: <PrintIcon/>, name: "Print", action: () => {}},
  //   {icon: <ShareIcon/>, name: "Share", action: () => {}},
  // ];

  return (
    <Box sx={{display: "flex"}}>
      <Box sx={{width: "100%"}}>
        <Box sx={{borderBottom: 1, borderColor: "divider", width: "100%"}}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{height: "30px", alignItems: "center"}}
          >
            <Tab icon={<DescriptionIcon fontSize="small"/>} iconPosition="start"
                 label="Details" sx={{mt: '-10px', mb: '-15px'}}/>
            <Tab icon={<QueryStatsIcon fontSize="small"/>} iconPosition="start"
                 label="Stats" sx={{mt: '-10px', mb: '-15px'}}/>
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <QrDetail qrData={qrData}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VisitDetailsSections visitData={visitData}/>
        </TabPanel>
        {/*<SpeedDial*/}
        {/*  ariaLabel="SpeedDial openIcon example"*/}
        {/*  sx={{position: "fixed", bottom: 16, right: 16}}*/}
        {/*  icon={<SpeedDialIcon onClick={() => {*/}
        {/*    setLoading(true);*/}
        {/*    router.replace(*/}
        {/*      "/qr/" + (new Date(qrData.createdAt)).getTime() + "/details").then(() => setLoading(false));*/}
        {/*  }} openIcon={<RefreshIcon/>}/>}*/}
        {/*>*/}
        {/*  {actions.map((action) => (*/}
        {/*    <SpeedDialAction*/}
        {/*      key={action.name}*/}
        {/*      icon={action.icon}*/}
        {/*      tooltipTitle={action.name}*/}
        {/*      tooltipOpen*/}
        {/*      onClick={action.action}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</SpeedDial>*/}
      </Box>
      <RenderSamplePreview
        isDynamic={qrData.isDynamic || false}
        code={qrData.qrOptionsId?.data ? qrData.qrOptionsId.data.slice(
          qrData.qrOptionsId.data.lastIndexOf("/") + 1) : qrData.qrType}
        isDrawed={true} style={{mt: "-15px"}}
        data={previewQRGenerator(qrData, qrData.qrType)}
        qrOptions={qrData.qrOptionsId}
        onlyQr={qrData.qrType === "web" || !qrData.isDynamic} step={1}/>
    </Box>
  );
};

export default QrDetails;

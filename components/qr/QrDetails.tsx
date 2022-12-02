import Box from "@mui/material/Box";
import VisitDetailsSections from "../visit/VisitDetailsSections";
import React from "react";
import QrDetail from "./QrDetail";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DescriptionIcon from "@mui/icons-material/Description";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

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
}

const QrDetails = ({ visitData, qrData }: any) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{height: "30px", alignItems: "center"}}
        >
          <Tab icon={<DescriptionIcon />} iconPosition="start" label="Details" />
          <Tab icon={<QueryStatsIcon />} iconPosition="start" label="Stats" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <QrDetail qrData={qrData} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <VisitDetailsSections visitData={visitData} />
      </TabPanel>
    </Box>
    /*<Box>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <QrDetail qrData={qrData} />
          {/!*<Card>
            <CardHeader
              title={qrData.shortLinkId.visitCount + " " + pluralize("Visit", qrData.shortLinkId.visitCount)}
              action={
                <IconButton aria-label="settings" disabled={isLoading}
                            onClick={() => {
                              setLoading(true);
                              router.replace("/qr/" + (new Date(qrData.shortLinkId.createdAt)).getTime() + "/details").then(() => setLoading(false));
                            }}>
                  <ReplayIcon />
                </IconButton>
              }
            />
            <CardContent>Some content</CardContent>
            <CardActions disableSpacing sx={{ justifyContent: "right" }}>
              <IconButton color="primary" disabled={isLoading} onClick={() => handleEdit(qrData)}>
                <EditOutlined />
              </IconButton>
            </CardActions>
          </Card>*!/}
          {/!*<QrList qrs={{ items: [qrData] }} />*!/}
        </Grid>
        {visitData && <Grid item xs={12}>
          <VisitDetailsSections visitData={visitData} />
        </Grid>}
      </Grid>
    </Box>*/
  );
};

export default QrDetails;
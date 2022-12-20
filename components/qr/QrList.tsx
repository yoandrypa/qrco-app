import React, {useState, useContext, useEffect} from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Edit from "@mui/icons-material/Edit";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import Public from "@mui/icons-material/Public";
import {sanitize} from "../../utils";
import Link from "next/link";
import {useRouter} from "next/router";
import Context from "../context/Context";
import RenderNewQrButton from "../renderers/RenderNewQrButton";
import RenderPreview from "./renderers/RenderPreview";
import useMediaQuery from "@mui/material/useMediaQuery";
import {humanDate} from "../helpers/generalFunctions";
import {handleDesignerString, handleInitialData, qrNameDisplayer} from "../../helpers/qr/helpers";
// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";
import * as QrHandler from "../../handlers/qrs";
import RenderQrListOptions from "./helperComponents/smallpieces/RenderQrListOptions";

const QrList = ({ title }: any) => {
  const [qrs, setQRs] = useState({ items: [] });
  // @ts-ignore
  const { setOptions, setStep, setLoading } = useContext(Context);
  const router = useRouter();

  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

  const renderStaticDynamic = (is: boolean) => (
    <Typography variant="caption" style={{ color: "gray" }}>
      {is ? <SyncIcon fontSize="inherit" sx={{mr: '5px'}} /> : <SyncDisabledIcon fontSize="inherit" sx={{mr: '5px'}} />}
      {is ? "Dynamic" : "Static"}
    </Typography>
  );

  const renderQr = (qrOptions: any, value: string, qr: any) => {
    const options = { ...qrOptions };
    if (!options.image?.trim().length) {
      options.image = null;
    }
    options.data = value;
    return <RenderPreview qrDesign={options} qr={qr} onlyPreview/>;
  };

  useEffect(() => {
    if (router.query.selected) {
      setStep(1);
    } else {
      setOptions(handleInitialData("Ebanux"));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(true);
    const currentAccount = session.currentAccount;
    if (currentAccount) {
      QrHandler.list({ userId: currentAccount.cognito_user_id }).then(qrs => {
          // @ts-ignore
          setQRs(qrs);
          setLoading(false);
        },
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Stack spacing={2} sx={{mt: '5px'}}>
        {qrs.items?.length > 0 ? (
          <>
            {title && <Typography variant="h6" style={{ fontWeight: "bold" }}>{title}</Typography>}
            {qrs.items.map((qr: any) => { // @ts-ignore
              const qrLink = sanitize.link(qr.shortLinkId || {}); // @ts-ignore
              if (qr.qrOptionsId?.background?.backColor === "") {
                qr.qrOptionsId.background.backColor = null;
              }
              if (qr.qrOptionsId?.background?.file === "") {
                qr.qrOptionsId.background.file = null;
              }
              return (
                <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={3} key={qr.createdAt}>
                  <Grid container justifyContent="flex-start" alignItems="center" spacing={2}>
                    <Grid item sm={5} xs={12}>
                      <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Box sx={{ display: "flex" }}>
                          <Box sx={{ width: "70px", mx: 1 }}>
                            <Box sx={{ mt: 1 }}>
                              {renderQr(qr.qrOptionsId, !qr.isDynamic ? handleDesignerString(qr.qrType, qr) : qr.qrOptionsId.data, qr)}
                            </Box>
                          </Box>
                          <Stack direction="column" sx={{ my: "auto" }}>
                            <Typography variant="subtitle2" sx={{ color: "orange", mb: "-7px" }}>{qrNameDisplayer(qr.qrType, qr.isDynamic)}</Typography>
                            <Typography variant="h6" sx={{fontWeight: "bold", mb: "-2px"}}>{qr.qrName}</Typography>
                            {isWide ? (
                              <Typography variant="caption" sx={{ color: "gray" }}>
                                {`Created at: ${humanDate(new Date(qr.createdAt).getTime())}`}
                              </Typography>
                            ) : (
                              <Typography variant="caption" sx={{ color: "gray" }}>{/*@ts-ignore*/}
                                <Link href={qrLink.link}>{qrLink.link}</Link>
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                        {!isWide && <RenderQrListOptions qr={qr} />}
                      </Box>
                    </Grid>
                    {!isWide ? (<Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          px: "11px",
                          mt: "-22px",
                        }}>
                        {renderStaticDynamic(qr.isDynamic)}
                        <Typography variant="caption" style={{ color: "gray" }}>
                          {`${qrLink.visitCount || 0} visits`}
                        </Typography>
                      </Box>
                    </Grid>) : (<Grid item xs={4}>
                      <Box sx={{ display: "flex" }}>
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <Stack direction="column" spacing={0.8} justifyContent="flex-start" alignItems="flex-start" sx={{ ml: { xs: 2, sm: 0 } }}>
                          {renderStaticDynamic(qr.isDynamic)}
                          {qrLink.address ? (
                            <Typography variant="caption" sx={{ color: "gray" }}>{/*@ts-ignore*/}
                              <Public fontSize="inherit" />
                              <Link href={qrLink.link}>{qrLink.link.split("//")[1]}</Link>
                            </Typography>) : <div />}
                          <Typography variant="caption" sx={{ color: "gray" }}>
                            <Edit fontSize="inherit" />
                            {`Updated at: ${humanDate(new Date(qr.updatedAt).getTime())}`}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>)}
                    {isWide && (<Grid item xs={3}>
                      <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        {qr.isDynamic ? (
                          <Stack direction="column" spacing={1.2} justifyContent="flex-start" alignItems="center">
                            <Typography variant="h4" style={{color: qrLink.visitCount > 0 ? "blue" : "red"}}>
                              {qrLink.visitCount || 0}
                            </Typography>
                            <Typography variant="caption" style={{ color: "gray" }}>
                              Visits
                            </Typography>
                          </Stack>
                        ) : <div />}
                        {isWide && <RenderQrListOptions qr={qr} />}
                      </Box>
                    </Grid>)}
                  </Grid>
                </Paper>
              );
            })}
            {/*{hasMore && <Button onClick={() => handleShowMore(lastKey)}>Show more</Button>}*/}
          </>
        ) : (
          <Grid container justifyContent="center" alignItems="center" sx={{ height: "calc( 100vh - 200px );" }}>
            <Grid item>
              <Alert severity="info" variant="outlined" action={<RenderNewQrButton />} sx={{ width: 450, p: 5 }}>
                There are no QR codes.
              </Alert>
            </Grid>
          </Grid>
        )}
      </Stack>
    </>
  );
};

export default QrList;

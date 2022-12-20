import React, {useState, useContext, useEffect} from "react";
import InfoIcon from '@mui/icons-material/Info';
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Edit from "@mui/icons-material/Edit";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import Public from "@mui/icons-material/Public";
import { sanitize } from "../../utils";
import Link from "next/link";
import { useRouter } from "next/router";
import Context from "../context/Context";
import RenderNewQrButton from "../renderers/RenderNewQrButton";
import RenderPreview from "./renderers/RenderPreview";
import useMediaQuery from "@mui/material/useMediaQuery";
import {humanDate} from "../helpers/generalFunctions";
import {handleDesignerString, handleInitialData, qrNameDisplayer} from "../../helpers/qr/helpers";
import {list}from "../../handlers/qrs";
import RenderQrListOptions from "./helperComponents/smallpieces/RenderQrListOptions";

const dateHandler = (date: string): string => `${date.startsWith('Yesterday') || date.startsWith('Today') ? ':' : ' at:'} ${date}`;

export default function QrList({ title }: any) {
  const [waiting, setWaiting] = useState<boolean>(true);
  const [qrs, setQRs] = useState({ items: [] }); // @ts-ignore
  const { setOptions, setLoading, userInfo } = useContext(Context);
  const router = useRouter();

  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

  const renderStaticDynamic = (is: boolean, avoidIcon?: boolean) => (
    <Typography variant="caption" style={{ color: "gray" }}>
      {!avoidIcon ? (is ? <SyncIcon fontSize="inherit" sx={{mr: '5px'}} /> : <SyncDisabledIcon fontSize="inherit" sx={{mr: '5px'}} />) : null}
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
    if (!router.query.selected) {
      setOptions(handleInitialData("Ebanux"));
    }
    setLoading(true);
    if (userInfo) {
      list({ userId: userInfo.cognito_user_id }).then(qrs => { // @ts-ignore
        setQRs(qrs);
        setLoading(false);
        if (waiting) {
          setWaiting(false);
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack spacing={2} sx={{mt: '5px'}}>
      {qrs.items && qrs.items.length > 0 && (
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
              <Paper sx={{width: "100%", overflow: "hidden"}} elevation={3} key={qr.createdAt}>
                <Stack spacing={2} direction="row" justifyContent="space-between" sx={{minHeight: '85px'}}>
                  <Box sx={{display: "flex", justifyContent: "space-between", minWidth: '200px'}}>
                    <Box sx={{display: "flex"}}>
                      <Box sx={{width: "70px", mx: 1}}>
                        <Box sx={{mt: 1}}>
                          {renderQr(qr.qrOptionsId, !qr.isDynamic ? handleDesignerString(qr.qrType, qr) : qr.qrOptionsId.data, qr)}
                        </Box>
                      </Box>
                      <Stack direction="column" sx={{my: "auto"}}>
                        <Typography variant="subtitle2" sx={{ color: "orange", mb: "-7px" }}>
                          {qrNameDisplayer(qr.qrType, qr.isDynamic)}
                        </Typography>
                        <Typography variant="h6" sx={{fontWeight: "bold", mb: "-2px"}}>{qr.qrName}</Typography>
                        {isWide ? (
                          <Typography variant="caption" sx={{color: "gray"}}>
                            {`Created${dateHandler(humanDate(new Date(qr.createdAt).getTime()))}`}
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{color: "gray"}}>{/*@ts-ignore*/}
                            <Link href={qrLink.link}>{qrLink.link}</Link>
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                  {!isWide && <Box sx={{display: 'grid', textAlign: 'center', mr: '7px'}}>
                    <RenderQrListOptions qr={qr}/>
                    {renderStaticDynamic(qr.isDynamic, true)}
                    <Typography variant="caption" style={{color: "gray"}}>
                      {`${qrLink.visitCount || 0} visits`}
                    </Typography>
                  </Box>}
                  {isWide && (
                    <Box sx={{display: "flex", width: '220px'}}>
                      <Divider orientation="vertical" flexItem sx={{mx: 2}}/>
                      <Stack direction="column" spacing={0.8} justifyContent="flex-start" alignItems="flex-start" sx={{ml: {xs: 2, sm: 0}, my: 'auto'}}>
                        {renderStaticDynamic(qr.isDynamic)}
                        {qrLink.address ? (
                          <Typography variant="caption" sx={{color: "gray"}}>{/*@ts-ignore*/}
                            <Public fontSize="inherit" sx={{mr: '5px'}}/>
                            <Link href={qrLink.link}>{qrLink.link.split("//")[1]}</Link>
                          </Typography>) : <div/>}
                        <Typography variant="caption" sx={{color: "gray"}}>
                          <Edit fontSize="inherit" sx={{mr: '5px'}}/>
                          {`Updated${dateHandler(humanDate(new Date(qr.updatedAt).getTime()))}`}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                  {isWide && (
                    <Box sx={{display: "flex", justifyContent: "space-between", width: {sm: '100px', md: '220px'}}}>
                      {qr.isDynamic ? (
                        <Stack direction="column" spacing={1} justifyContent="flex-start" alignItems="center" sx={{my: 'auto'}}>
                          <Typography variant="h4" sx={{color: qrLink.visitCount > 0 ? "blue" : "red", mb: '-12px'}}>
                            {qrLink.visitCount || 0}
                          </Typography>
                          <Typography variant="caption" sx={{color: "gray"}}>
                            {'Visits'}
                          </Typography>
                        </Stack>
                      ) : <div/>}
                      <RenderQrListOptions qr={qr}/>
                    </Box>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </>
      )}
      {!qrs.items?.length && !waiting && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <Box sx={{ border: theme => `solid 1px ${theme.palette.info.light}`, p: '20px', borderRadius: '5px'}}>
            <InfoIcon color="info"/>
            <Typography sx={{mb: '25px', color: theme => theme.palette.info.light, fontWeight: 'bold'}}>
              {'There are no QR codes.'}
            </Typography>
            <RenderNewQrButton light />
          </Box>
        </Box>
      )}
    </Stack>
  );
};

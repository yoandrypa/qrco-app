import {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";

import pluralize from "pluralize";

import InfoIcon from '@mui/icons-material/Info';
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Edit from "@mui/icons-material/Edit";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import MonetizationIcon from '@mui/icons-material/MonetizationOn';
import useMediaQuery from "@mui/material/useMediaQuery";
import dynamic from "next/dynamic";

import RenderQrListOptions from "./helperComponents/smallpieces/RenderQrListOptions";
import Context from "../context/Context";
import RenderPreview from "./renderers/RenderPreview";
import {sanitize} from "../../utils";
import {humanDate} from "../helpers/generalFunctions";
import {handleDesignerString, handleInitialData, qrNameDisplayer} from "../../helpers/qr/helpers";
import {list, pauseQRLink, remove} from "../../handlers/qrs";
import {releaseWaiting, startWaiting} from "../Waiting";
import {QR_CONTENT_ROUTE, QR_DESIGN_ROUTE} from "./constants";
import RenderLinkOptions from "./helperComponents/RenderLinkOptions";

const RenderConfirmDlg = dynamic(() => import("../renderers/RenderConfirmDlg"));
const ButtonCreateQrLynks = dynamic(() => import("../menus/MainMenu/ButtonCreateQrLynks"));
const KeyIcon = dynamic(() => import("@mui/icons-material/Key"));

const dateHandler = (date: string): string => `${date.startsWith('Yesterday') || date.startsWith('Today') ? ':' : ' at:'} ${date}`;

const iconsProps = {width: '17px', height: '17px', mb: '-3px'};

const renderStaticDynamic = (is: boolean, avoidIcon?: boolean, isSecret?: boolean) => (
  <Typography variant="caption" style={{ color: '#808080'}}>
    {!avoidIcon ? (is ? <SyncIcon sx={{ ...iconsProps, mr: '5px' }} /> : <SyncDisabledIcon sx={{ ...iconsProps, mr: '5px' }} />) : null}
    {is ? "Dynamic" : "Static"}
    {isSecret && <KeyIcon sx={{ ...iconsProps, mb: '-5px', ml: '5px' }} color="error"/>}
  </Typography>
);

const renderQr = (qr: any) => {
  const options = { ...qr.qrOptionsId };
  if (!options.image?.trim().length) {
    options.image = null;
  }
  options.data = !qr.isDynamic ? handleDesignerString(qr.qrType, qr) : qr.qrOptionsId.data;
  return <RenderPreview qrDesign={options} qr={qr} onlyPreview />;
};

export default function QrList({ title }: any) {
  const [confirm, setConfirm] = useState<{ createdAt: number; userId: string; } | null>(null);
  const [qrs, setQRs] = useState({ items: [] }); // @ts-ignore
  const { setOptions, userInfo } = useContext(Context);
  const router = useRouter();

  const isWide = useMediaQuery("(min-width:665px)", { noSsr: true });

  const loadItems = useCallback(() => {
    if (userInfo) {
      startWaiting();
      list({ userId: userInfo.cognito_user_id }) // @ts-ignore
        .then((qrs) => setQRs(qrs))
        .finally(() => releaseWaiting());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClone = useCallback((qr: QrDataType) => {
    startWaiting();
    const objectToClone = { ...qr.qrOptionsId, ...qr, mode: "clone", qrName: `${qr.qrName} copy` } as any; // @ts-ignore
    if (!objectToClone.image?.trim()?.length && qr.qrOptionsId?.image?.trim()?.length) { // @ts-ignore
      objectToClone.image = qr.qrOptionsId.image;
    }
    if (objectToClone.secret !== undefined) { delete objectToClone.secret; }
    setOptions(objectToClone);
    router.push(QR_CONTENT_ROUTE, undefined, { shallow: true }).finally(() => releaseWaiting());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = useCallback((qr: QrDataType) => {
    startWaiting();
    const objToEdit = { ...qr.qrOptionsId, ...qr, mode: "edit" } as any; // @ts-ignore
    if (!objToEdit.image?.trim()?.length && qr.qrOptionsId?.image?.trim()?.length) { // @ts-ignore
      objToEdit.image = qr.qrOptionsId.image;
    }
    setOptions(objToEdit);
    router.push(qr.isDynamic ? QR_CONTENT_ROUTE : QR_DESIGN_ROUTE, undefined, { shallow: true })
      .finally(() => releaseWaiting());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePauseQrLink = useCallback((shortLinkId: LinkType) => {
    startWaiting();
    pauseQRLink(shortLinkId).then(() => loadItems());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    startWaiting(); // @ts-ignore
    const deleted = await remove(confirm);
    if (deleted) {
      setConfirm(null);
      loadItems();
    }
    releaseWaiting();
  };

  useEffect(() => {
    if (!router.query.selected) { setOptions(handleInitialData("Ebanux")); }
    loadItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack spacing={2} sx={{ mt: '5px' }}>
      {qrs.items && qrs.items.length > 0 && (
        <>
          {title && <Typography variant="h6" style={{ fontWeight: "bold" }}>{title}</Typography>}
          {qrs.items.map((qr: any) => { // @ts-ignore
            const qrLink = sanitize.link(qr.shortLinkId || {}); // @ts-ignore
            if (qr.qrOptionsId?.background?.backColor === "") { qr.qrOptionsId.background.backColor = null; }
            if (qr.qrOptionsId?.background?.file === "") { qr.qrOptionsId.background.file = null; }

            return (
              <Paper sx={{ width: "100%", overflow: "hidden", '&:hover': { boxShadow: '0 0 3px 2px #849abb' } }}
                     elevation={3} key={qr.createdAt}>
                <Stack spacing={2} direction="row" justifyContent="space-between" sx={{ minHeight: '85px' }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", minWidth: '35%' }}>
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ width: "70px", mx: 1, mt: 1 }}>
                        {renderQr(qr)}
                      </Box>
                      <Stack direction="column" sx={{ my: "auto" }}>
                        <Typography variant="subtitle2" sx={{ color: "orange", mb: "-7px", display: 'flex', alignItems: 'center' }}>
                          {qrNameDisplayer(qr.qrType, qr.isDynamic)}
                          {qr.isMonetized && <MonetizationIcon sx={{width: 18, height: 18, ml: '2px'}} color="warning" />}
                        </Typography>
                        <Typography variant="h6" sx={{
                          fontWeight: "bold", mb: "-2px", width: {sm: '350px', xs: '200px'}, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {qr.qrName}
                        </Typography>
                        {isWide ? (
                          <Typography variant="caption" sx={{ color: '#808080'}}>
                            {`Created${dateHandler(humanDate(new Date(qr.createdAt).getTime()))}`}
                          </Typography>
                        ) : <RenderLinkOptions link={qrLink?.link || ''} isWide={false} iconsProps={iconsProps} />}
                      </Stack>
                    </Box>
                  </Box>
                  {!isWide && (<Box sx={{display: 'grid', textAlign: 'right'}}>
                    <RenderQrListOptions qr={qr} handleEdit={handleEdit} handlePauseQrLink={handlePauseQrLink}
                                         setConfirm={setConfirm} handleClone={handleClone} link={qrLink.link} />
                    <Box sx={{display: 'grid', mr: '10px'}}>
                      {renderStaticDynamic(qr.isDynamic, true, qr.secret !== undefined)}
                      <Typography variant="caption" style={{color: "#808080"}}>{pluralize('visit', qrLink.visitCount || 0, true)}</Typography>
                    </Box>
                  </Box>)}
                  {isWide && (
                    <Box sx={{ display: "flex", width: '350px' }}>
                      <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />
                      <Stack direction="column" spacing={0.8} justifyContent="flex-start" alignItems="flex-start"
                             sx={{ ml: { xs: 2, sm: 0 }, my: 'auto' }}>
                        {renderStaticDynamic(qr.isDynamic, false, qr.secret !== undefined)}
                        {qrLink.address ? (
                          <RenderLinkOptions link={qrLink?.link || ''} isWide={true} iconsProps={iconsProps} />
                        ) : <div />}
                        <Typography variant="caption" sx={{ color: '#808080'}}>
                          <Edit sx={{ ...iconsProps, mr: '5px' }} />
                          {`Updated${dateHandler(humanDate(new Date(qr.updatedAt).getTime()))}`}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                  {isWide && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: { sm: '100px', md: '220px' } }}>
                      {qr.isDynamic ? (
                        <Stack direction="column" spacing={1} justifyContent="flex-start" alignItems="center"
                               sx={{ my: 'auto' }}>
                          <Typography variant="h4" sx={{ color: qrLink.visitCount > 0 ? "blue" : "red", mb: '-12px' }}>
                            {qrLink.visitCount || 0}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#808080'}}>
                            {pluralize('Visit', qrLink.visitCount || 0)}
                          </Typography>
                        </Stack>
                      ) : <div />}
                      <RenderQrListOptions qr={qr} handleEdit={handleEdit} handlePauseQrLink={handlePauseQrLink}
                         setConfirm={setConfirm} handleClone={handleClone} link={qr.isDynamic ? qrLink.link : undefined} />
                    </Box>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </>
      )}
      {!qrs.items?.length && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <Box sx={{ border: theme => `solid 1px ${theme.palette.info.light}`, p: '20px', borderRadius: '5px' }}>
            <InfoIcon color="info" />
            <Typography sx={{ mb: '25px', color: theme => theme.palette.info.light, fontWeight: 'bold' }}>
              {'There are no QRLynks.'}
            </Typography>
            <ButtonCreateQrLynks light />
          </Box>
        </Box>
      )}
      {confirm !== null && (
        <RenderConfirmDlg
          handleCancel={() => setConfirm(null)}
          handleOk={handleDelete}
          title="Delete confirmation"
          message="Are you sure you want to delete the selected QR?"
          confirmationMsg="This action can not be undone."
          confirmStyle={{ color: 'orange', fontSize: 'small' }}
        />
      )}
    </Stack>
  );
};

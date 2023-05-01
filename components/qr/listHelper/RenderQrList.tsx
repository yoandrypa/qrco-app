import Typography from "@mui/material/Typography";
import {sanitize} from "../../../utils";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {handleDesignerString, qrNameDisplayer} from "../../../helpers/qr/helpers";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import {areEquals, humanDate} from "../../helpers/generalFunctions";
import RenderLinkOptions from "../helperComponents/RenderLinkOptions";
import RenderQrListOptions from "../helperComponents/smallpieces/RenderQrListOptions";
import pluralize from "pluralize";
import Divider from "@mui/material/Divider";
import Edit from "@mui/icons-material/Edit";
import RenderPreview from "../renderers/RenderPreview";
import {dateHandler} from "./functions";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";

import dynamic from "next/dynamic";
import useMediaQuery from "@mui/material/useMediaQuery";
import {memo} from "react";

const KeyIcon = dynamic(() => import("@mui/icons-material/Key"));
const LockOutlinedIcon = dynamic(() => import("@mui/icons-material/LockOutlined"));

const renderQr = (qr: any) => {
  const options = { ...qr.qrOptionsId };
  if (!options.image?.trim().length) {
    options.image = null;
  }
  options.data = !qr.isDynamic ? handleDesignerString(qr.qrType, qr) : qr.qrOptionsId.data;
  return <RenderPreview qrDesign={options} qr={qr} onlyPreview />;
};

const iconsProps = {width: '17px', height: '17px', mb: '-3px'};

const renderStaticDynamic = (is: boolean, avoidIcon?: boolean, isSecret?: boolean, isLock?: boolean) => (
  <Typography variant="caption" style={{ color: '#808080'}}>
    {!avoidIcon ? (is ? <SyncIcon sx={{ ...iconsProps, mr: '5px' }} /> : <SyncDisabledIcon sx={{ ...iconsProps, mr: '5px' }} />) : null}
    {is ? "Dynamic" : "Static"}
    {isSecret && <KeyIcon sx={{ ...iconsProps, mb: '-5px', ml: '1px' }} color="error"/>}
    {isLock && <LockOutlinedIcon sx={{ ...iconsProps, mb: '-5px', ml: '1px' }} color="warning"/>}
  </Typography>
);

interface QRProps {
  title: string;
  qrs?: Array<any>;
  handleEdit: (edit: QrDataType) => void;
  handlePauseQrLink: (id: LinkType) => void;
  openDetails: (qr: any) => void;
  setConfirm: (conf: {createdAt: number, userId: string}) => void;
  handleClone: (clone: QrDataType) => void;
}

function RenderQrList({title, qrs, handleEdit, handlePauseQrLink, openDetails, setConfirm, handleClone}: QRProps) {
  const isWide = useMediaQuery("(min-width:665px)", { noSsr: true });

  return (
    <Stack spacing={2} sx={{ mt: '5px' }}>
      {qrs && qrs.length > 0 && (
        <>
          {title && <Typography variant="h6" style={{ fontWeight: "bold" }}>{title}</Typography>}
          {qrs.map((qr: any) => { // @ts-ignore
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
                      {renderStaticDynamic(qr.isDynamic, true, qr.secret !== undefined && !qr.secretOps?.includes('e'), qr.secretOps?.includes('l'))}
                      <Typography variant="caption" style={{color: "#808080"}}>{pluralize('visit', qrLink.visitCount || 0, true)}</Typography>
                    </Box>
                  </Box>)}
                  {isWide && (
                    <Box sx={{ display: "flex", width: '350px' }}>
                      <Divider orientation="vertical" flexItem sx={{ mr: 2 }} />
                      <Stack direction="column" spacing={0.8} justifyContent="flex-start" alignItems="flex-start"
                             sx={{ ml: { xs: 2, sm: 0 }, my: 'auto' }}>
                        {renderStaticDynamic(qr.isDynamic, false, qr.secret !== undefined && !qr.secretOps?.includes('e'), qr.secretOps?.includes('l'))}
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
                      <RenderQrListOptions qr={qr} handleEdit={handleEdit} handlePauseQrLink={handlePauseQrLink} showDetails={openDetails}
                                           setConfirm={setConfirm} handleClone={handleClone} link={qr.isDynamic ? qrLink.link : undefined} />
                    </Box>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </>
      )}
    </Stack>
  )
}

const notIf = (current: QRProps, next: QRProps) => areEquals(current.qrs, next.qrs) && current.title === next.title;

export default memo(RenderQrList, notIf);

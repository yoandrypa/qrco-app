import {MouseEvent, useContext, useEffect, useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Stack from "@mui/material/Stack";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QrCodeIcon from '@mui/icons-material/QrCode';
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import Context from "../../../context/Context";
import {IS_DEV_ENV} from "../../constants";

import {useRouter} from "next/router";
import RenderPreview from "../../renderers/RenderPreview";
import {handleDesignerString} from "../../../../helpers/qr/helpers";

interface RenderQrOptsProps {
  qr: any;
  handleEdit: (edit: QrDataType) => void;
  setConfirm: (conf: { createdAt: number; userId: string; }) => void;
  handlePauseQrLink: (id: LinkType) => void;
}

export default function RenderQrListOptions({qr, handleEdit, setConfirm, handlePauseQrLink}: RenderQrOptsProps) {
  const router = useRouter();
  // @ts-ignore
  const {loading, setLoading} = useContext(Context);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [preview, setPreview] = useState<any>(null);

  const isWide = useMediaQuery("(min-width:900px)", { noSsr: true });

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleDetails = () => {
    setLoading(true);
    router.push("/qr/" + (new Date(qr.createdAt)).getTime() + "/details").then(() => setLoading(false));
  }

  const handlePreview = () => {
    const options = { ...qr.qrOptionsId };
    if (!options.image?.trim().length) {
      options.image = null;
    }
    options.data = !qr.isDynamic ? handleDesignerString(qr.qrType, qr) : qr.qrOptionsId.data;
    setPreview(options);
  }

  useEffect(() => {
    if (isWide && anchor) {
      setAnchor(null);
    }
  }, [isWide]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((loading || confirm || preview) && anchor) {
      setAnchor(null);
    }
  }, [loading, confirm, preview]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        {isWide && (
          <>
            <Tooltip title="Details">
              <IconButton color="primary" disabled={loading} onClick={() => handleDetails()}>
                <InfoOutlinedIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton color="primary" disabled={loading} onClick={() => handleEdit(qr)}>
                <EditOutlined/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" disabled={loading} onClick={() => setConfirm({userId: qr.userId, createdAt: qr.createdAt})}>
                <DeleteOutlineRounded/>
              </IconButton>
            </Tooltip>
          </>)}
        <Tooltip title="More options">
          <IconButton aria-label="more" id="menuButton" aria-controls={anchor !== null ? 'menuButton' : undefined}
                      aria-expanded={anchor !== null ? 'true' : undefined} aria-haspopup="true" onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        {anchor && (
          <Menu
            id="menuButton"
            MenuListProps={{ 'aria-labelledby': 'menuButton' }}
            anchorEl={anchor}
            open onClose={() => setAnchor(null)}
          >
            {!isWide && (
              <MenuItem key="editMenuItem" onClick={() => handleEdit(qr)}>
                <EditOutlined color="primary"/>
                <Typography sx={{ml: '5px'}}>{'Edit'}</Typography>
              </MenuItem>
            )}
            {!isWide && (
              <MenuItem key="detailsMenuItem" onClick={() => handleDetails()}>
                <InfoOutlinedIcon color="primary"/>
                <Typography sx={{ml: '5px'}}>{'Details'}</Typography>
              </MenuItem>
            )}
            {qr.shortLinkId && (
              <MenuItem key="pauseMenuItem" onClick={() => handlePauseQrLink(qr.shortLinkId)}>
                {qr.shortLinkId.paused ? <PlayCircleOutlineIcon color="primary"/> : <PauseCircleOutlineIcon color="primary"/>}
                <Typography sx={{ml: '5px'}}>{qr.shortLinkId.paused ? "Activate" : "Pause"}</Typography>
              </MenuItem>
            )}
            <MenuItem key="previewMenuItem" onClick={handlePreview}>
              <QrCodeIcon color="primary"/>
              <Typography sx={{ml: '5px'}}>{'Preview'}</Typography>
            </MenuItem>
            {IS_DEV_ENV && qr.qrType === "donation" && !!qr.donationProductId && (
              <MenuItem component="a" target="_blank" rel="noopener noreferrer" key="goToDashBoardMenuItem" onClick={() => setAnchor(null)}
                        href={IS_DEV_ENV ? "https://dev-app.ebanux.com/checkouts" : "https://app.ebanux.com/checkouts"}>
                <DashboardIcon color="info" />
                <Typography sx={{ml: '5px'}}>Go to dashboard</Typography>
              </MenuItem>
            )}
            {!isWide && (
              <MenuItem key="deleteMenuItem" onClick={() => setConfirm({userId: qr.userId, createdAt: qr.createdAt})}>
                <DeleteOutlineRounded color="error"/>
                <Typography sx={{ml: '5px'}}>{'Delete'}</Typography>
              </MenuItem>
            )}
          </Menu>
        )}
      </Stack>
      {preview && <RenderPreview qrDesign={preview} externalClose={() => setPreview(null)} />}
    </>
  );
}

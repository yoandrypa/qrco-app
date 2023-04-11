import {memo, MouseEvent, useContext, useEffect, useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Divider from '@mui/material/Divider';

import Stack from "@mui/material/Stack";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QrCodeIcon from '@mui/icons-material/QrCode';
import Typography from "@mui/material/Typography";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from "@mui/material/useMediaQuery";

import dynamic from "next/dynamic";
import {useRouter} from "next/router";

import Context from "../../../context/Context";
import {IS_DEV_ENV} from "../../constants";
import {handleDesignerString} from "../../../../helpers/qr/helpers";

const RenderPreview = dynamic(() => import("../../renderers/RenderPreview"));
const DynamicFeedIcon = dynamic(() => import("@mui/icons-material/DynamicFeed"));
const DashboardIcon = dynamic(() => import("@mui/icons-material/Dashboard"));
const PlayCircleOutlineIcon = dynamic(() => import("@mui/icons-material/PlayCircleOutline"));
const PauseCircleOutlineIcon = dynamic(() => import("@mui/icons-material/PauseCircleOutline"));

interface RenderQrOptsProps {
  qr: any;
  link?: string;
  handleEdit: (edit: QrDataType) => void;
  handleClone: (clone: QrDataType) => void;
  setConfirm: (conf: { createdAt: number; userId: string; }) => void;
  handlePauseQrLink: (id: LinkType) => void;
}

const RenderQrListOptions = ({qr, handleEdit, setConfirm, handlePauseQrLink, handleClone, link}: RenderQrOptsProps) => {
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
  };

  const handlePreview = () => {
    const options = { ...qr.qrOptionsId };
    if (!options.image?.trim().length) {
      options.image = null;
    }
    options.data = !qr.isDynamic ? handleDesignerString(qr.qrType, qr) : qr.qrOptionsId.data;
    setPreview(options);
  };

  const beforeEdit = () => {
    handleEdit(qr);
  };

  const beforeDelete = () => {
    setConfirm({userId: qr.userId, createdAt: qr.createdAt})
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
              <IconButton color="primary" disabled={loading} onClick={handleDetails}>
                <InfoOutlinedIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton color="primary" disabled={loading} onClick={beforeEdit}>
                <EditOutlined/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" disabled={loading} onClick={beforeDelete}>
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
              <MenuItem key="editMenuItem" onClick={beforeEdit}>
                <EditOutlined color="primary"/>
                <Typography sx={{ml: '5px'}}>{'Edit'}</Typography>
              </MenuItem>
            )}
            {!isWide && (
              <MenuItem key="detailsMenuItem" onClick={handleDetails}>
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
            <MenuItem key="cloneMenuItem" onClick={() => handleClone(qr)}>
              <DynamicFeedIcon color="primary"/>
              <Typography sx={{ml: '5px'}}>{'Clone'}</Typography>
            </MenuItem>
            <Divider/>
            {link !== undefined && (
              <MenuItem key="openLink" target="_blank" component="a" href={link}>
                <OpenInNewIcon color="primary"/>
                <Typography sx={{ml: '5px'}}>{'Open microsite'}</Typography>
              </MenuItem>
            )}
            <MenuItem key="downloadMenu" onClick={handlePreview}>
              <QrCodeIcon color="primary"/>
              <Typography sx={{ml: '5px'}}>{'Download QR code'}</Typography>
            </MenuItem>
            {qr.isMonetized && (
              <MenuItem component="a" target="_blank" rel="noopener noreferrer" key="goToDashBoardMenuItem" onClick={() => setAnchor(null)}
                        href={`${process.env.PAYLINK_BASE_URL}/checkouts`}>
                <DashboardIcon color="info" />
                <Typography sx={{ml: '5px'}}>Go to dashboard</Typography>
              </MenuItem>
            )}
            {!isWide && (
              <MenuItem key="deleteMenuItem" onClick={beforeDelete}>
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

export default memo(RenderQrListOptions, (curr: RenderQrOptsProps, next: RenderQrOptsProps) => curr.link === next.link);

import {MouseEvent, useCallback, useContext, useEffect, useState} from "react";
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

import Context from "../../../context/Context";
import {pauseQRLink, remove} from "../../../../handlers/qrs";
import {IS_DEV_ENV, QR_CONTENT_ROUTE} from "../../constants";

import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const RenderConfirmDlg = dynamic(() => import("../../../renderers/RenderConfirmDlg"));

interface RenderQrOptsProps {
  qr: any;
}

export default function RenderQrListOptions({qr}: RenderQrOptsProps) {
  const router = useRouter();
  // @ts-ignore
  const {loading, setLoading, setOptions} = useContext(Context);
  const [confirm, setConfirm] = useState<{ createdAt: number; userId: string; } | null>(null);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const isWide = useMediaQuery("(min-width:900px)", { noSsr: true });

  const handleEdit = useCallback((qr: QrDataType) => {
    setLoading(true);
    setOptions({...qr.qrOptionsId, ...qr, mode: "edit"});
    router.push(QR_CONTENT_ROUTE, undefined, {shallow: true}).then(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePauseQrLink = useCallback((shortLinkId: LinkType) => {
    setLoading(true);
    pauseQRLink(shortLinkId).then(() => router.replace("/").then(() => setLoading(false)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    setLoading(true); // @ts-ignore
    const deleted = await remove(confirm);
    if (deleted) {
      setConfirm(null);
      router.replace("/").then(() => setLoading(false));
    }
  };

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleDetails = () => {
    setLoading(true);
    router.push("/qr/" + (new Date(qr.createdAt)).getTime() + "/details").then(() => setLoading(false));
  }

  useEffect(() => {
    if (isWide && anchor) {
      setAnchor(null);
    }
  }, [isWide]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((loading || confirm) && anchor) {
      setAnchor(null);
    }
  }, [loading, confirm]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        {isWide && (
          <>
            <Tooltip title="Edit">
              <IconButton color="primary" disabled={loading} onClick={() => handleEdit(qr)}>
                <EditOutlined/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Details">
              <IconButton color="primary" disabled={loading} onClick={() => handleDetails()}>
                <InfoOutlinedIcon/>
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
      {confirm !== null && (
        <RenderConfirmDlg
          handleCancel={() => setConfirm(null)}
          handleOk={handleDelete}
          title="Delete confirmation"
          message="Are you sure you want to delete the selected QR?"
          confirmationMsg="This action can not be undone."
          confirmStyle={{color: 'orange', fontSize: 'small'}}
        />
      )}
    </>
  );
}

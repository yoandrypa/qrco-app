import {useCallback, useContext, useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Stack from "@mui/material/Stack";
import Context from "../../../context/Context";

import {pauseQRLink, remove} from "../../../../handlers/qrs";
import {IS_DEV_ENV, QR_CONTENT_ROUTE} from "../../constants";

import {useRouter} from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";

const RenderConfirmDlg = dynamic(() => import("../../../renderers/RenderConfirmDlg"));

interface RenderQrOptsProps {
  qr: any;
}

export default function RenderQrListOptions({qr}: RenderQrOptsProps) {
  const router = useRouter();
  // @ts-ignore
  const {isLoading, setLoading, setOptions} = useContext(Context);
  const [confirm, setConfirm] = useState<{ createdAt: number; userId: string; } | null>(null);


  const handleDashboard = async () => {
    await router.push(IS_DEV_ENV ? "https://dev-app.ebanux.com/checkouts" : "https://app.ebanux.com/checkouts");
  };

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

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" alignItems="center">
        <Tooltip title="Details">
          <IconButton color="primary" disabled={isLoading} onClick={() => {
            setLoading(true);
            router.push("/qr/" + (new Date(qr.createdAt)).getTime() + "/details").then(() => setLoading(false));
          }}>
            <InfoOutlinedIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton color="primary" disabled={isLoading} onClick={() => handleEdit(qr)}>
            <EditOutlined/>
          </IconButton>
        </Tooltip>
        {qr.shortLinkId ? (
          <Tooltip title={qr.shortLinkId.paused ? "Activate" : "Pause"}>
            <IconButton color="primary" disabled={isLoading} onClick={() => handlePauseQrLink(qr.shortLinkId)}>
              {qr.shortLinkId.paused ? <PlayCircleOutlineIcon/> : <PauseCircleOutlineIcon/>}
            </IconButton>
          </Tooltip>) : null
        }
        <Tooltip title="Delete">
          <IconButton color="error" disabled={isLoading} onClick={() => setConfirm({userId: qr.userId, createdAt: qr.createdAt})}>
            <DeleteOutlineRounded/>
          </IconButton>
        </Tooltip>
        {(qr.qrType === "donation" && !!qr.donationProductId) && (
          <Link
            href={process.env.REACT_NODE_ENV === "develop" ? "https://dev-app.ebanux.com/checkouts" : "https://app.ebanux.com/checkouts"}
            target='_blank'>
            <a target="_blank" rel="noopener noreferrer">
              <Tooltip title="Go to Dashboard">
                <IconButton color="info" disabled={isLoading} onClick={handleDashboard}>
                  <DashboardIcon/>
                </IconButton>
              </Tooltip>
            </a>
          </Link>
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

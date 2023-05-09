import {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";

import InfoIcon from '@mui/icons-material/Info';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import Context from "../context/Context";
import {handleInitialData} from "../../helpers/qr/helpers";
import {list, pauseQRLink, remove} from "../../handlers/qrs";
import {releaseWaiting, startWaiting} from "../Waiting";
import {QR_CONTENT_ROUTE, QR_DESIGN_ROUTE} from "./constants";
import QrDetails from "./QrDetails";
import RenderQrList from "./listHelper/RenderQrList";

const RenderConfirmDlg = dynamic(() => import("../renderers/RenderConfirmDlg"));
const ButtonCreateQrLynks = dynamic(() => import("../menus/MainMenu/ButtonCreateQrLynks"));

export default function QrList({ title }: any) {
  const [confirm, setConfirm] = useState<{ createdAt: number; userId: string; } | null>(null);
  const [qrs, setQRs] = useState({ items: [] });

  // @ts-ignore
  const {setOptions, userInfo, showingDetails, setShowingDetails} = useContext(Context);
  const router = useRouter();

  const loadItems = useCallback(() => {
    if (userInfo) {
      startWaiting();
      list({ userId: userInfo.cognito_user_id }) // @ts-ignore
        .then((qrs) => setQRs(qrs)).finally(() => releaseWaiting());
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
    setConfirm(null);
    startWaiting(); // @ts-ignore
    const deleted = await remove(confirm);
    if (deleted) { loadItems(); }
    releaseWaiting();
  };

  const openDetails = (detailsQr: any) => {
    setShowingDetails(detailsQr);
  }

  useEffect(() => {
    if (!router.query.selected) { setOptions(handleInitialData("Ebanux")); }
    loadItems();
    return () => setShowingDetails(undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (showingDetails) {
    return <QrDetails qrData={showingDetails} goBack={openDetails} />
  }

  return (<>
    <RenderQrList title={title} qrs={qrs?.items} handleEdit={handleEdit} handlePauseQrLink={handlePauseQrLink}
                  openDetails={openDetails} setConfirm={setConfirm} handleClone={handleClone} />
    {!qrs?.items?.length && (
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <Box sx={{ border: theme => `solid 1px ${theme.palette.info.light}`, p: '20px', borderRadius: '5px' }}>
          <InfoIcon color="info" />
          <Typography sx={{ mb: '25px', color: 'info.light', fontWeight: 'bold' }}>
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
  </>);
};

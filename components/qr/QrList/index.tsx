import dynamic from "next/dynamic";

import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { handleInitialData } from "../../../helpers/qr/helpers";
import { pauseQRLink, remove } from "../../../handlers/qrs";
import { releaseWaiting, startWaiting } from "../../Waiting";
import { QR_CONTENT_ROUTE, QR_DESIGN_ROUTE } from "../constants";

import NoQrs from "./NoQrs";
import LoadingQrs from "./LoadingQrs";
import Context from "../../context/Context";
import QrDetails from "../QrDetails";
import RenderQrList from "./RenderQrList";

import QrDataModel from "../../../models/qr_data";
import ShowMore from "./ShowMore";

const RenderConfirmDlg = dynamic(() => import("../../renderers/RenderConfirmDlg"));

interface IQRs {
  items: any[];
  total?: number;
  nextPageKey?: string;
}

export default function QrList({ title }: any) {
  const [confirm, setConfirm] = useState<{ createdAt: number; userId: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrs, setQRs] = useState<IQRs>({ items: [] });

  // @ts-ignore
  const { setOptions, userInfo, showingDetails, setShowingDetails } = useContext(Context);
  const router = useRouter();

  const loadItems = () => {
    if (userInfo) {
      const pageKey = qrs.nextPageKey || null;
      const limit = (process.env.PAGE_SIZE || 10) as number;

      startWaiting();
      QrDataModel.fetchByUser(userInfo.cognito_user_id, limit, pageKey).then((response: any) => {
        const newQrs = { ...response };
        newQrs.items = [...qrs.items, ...newQrs.items];
        setQRs(newQrs);
        console.log(2, newQrs.nextPageKey);
        setLoading(false);
      }).finally(releaseWaiting);
    }
  }

  const handleClone = useCallback((qr: QrDataType) => {
    startWaiting();
    const objectToClone = { ...qr.qrOptionsId, ...qr, mode: "clone", qrName: `${qr.qrName} copy` } as any; // @ts-ignore
    if (!objectToClone.image?.trim()?.length && qr.qrOptionsId?.image?.trim()?.length) { // @ts-ignore
      objectToClone.image = qr.qrOptionsId.image;
    }
    if (objectToClone.secret !== undefined) delete objectToClone.secret;
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

  const openDetails = (detailsQr: any) => {
    setShowingDetails(detailsQr);
  }

  useEffect(() => {
    if (!router.query.selected) setOptions(handleInitialData("Ebanux"));
    loadItems();
    return () => setShowingDetails(undefined);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (showingDetails) return <QrDetails qrData={showingDetails} goBack={openDetails} />
  if (loading) return <LoadingQrs />;
  if (qrs.total === 0) return <NoQrs />;

  const { items, nextPageKey, total = 0 } = qrs;

  return (
    <>
      <RenderQrList
        title={title}
        qrs={items}
        handleEdit={handleEdit}
        handlePauseQrLink={handlePauseQrLink}
        handleClone={handleClone}
        setConfirm={setConfirm}
        openDetails={openDetails}
      />
      <ShowMore total={total} count={items.length} nextPageKey={nextPageKey} onShowMore={loadItems} />
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
    </>
  );
};

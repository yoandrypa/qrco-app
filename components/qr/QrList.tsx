import React, { useCallback, useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import Edit from "@mui/icons-material/Edit";
import EditOutlined from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import Public from "@mui/icons-material/Public";
import IconButton from "@mui/material/IconButton";
import { sanitize } from "../../utils";
import Link from "next/link";
import * as QrHandler from "../../handlers/qrs";
import { useRouter } from "next/router";
import Context from "../context/Context";
import RenderNewQrButton from "../renderers/RenderNewQrButton";
import RenderPreview from "./renderers/RenderPreview";
import { capitalize } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { humanDate } from "../helpers/generalFunctions";
import { handleDesignerString, handleInitialData } from "../../helpers/qr/helpers";
import DashboardIcon from "@mui/icons-material/Dashboard";

const QrList = ({ qrs }: any) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    createdAt: number;
    userId: string;
  } | null>(null);

  /*const [items, setItems] = useState(qrs.items || []);
  const [lastKey, setLastKey] = useState<string | object | undefined>(qrs.lastKey);
  const [hasMore, setHasMore] = useState<boolean>(qrs.lastKey !== undefined);

  const fetchQrs = async (query: QrHandler.Query) => {
    return await QrHandler.list(query);
  };

  const handleShowMore = (lastKey: any) => {
    setLoading(true);
    fetchQrs({
      limit: 2, userId: userInfo.attributes.sub, startAt: lastKey
    }).then(qrs => {
      // @ts-ignore
      const allItems = items.concat(qrs.items);
      if (qrs.count === allItems.length) {
        setHasMore(false);
      }
      setLastKey(qrs.lastKey);
      setItems(allItems);
    }).catch(console.error);
    setLoading(false);
  };*/

  // @ts-ignore
  const { isLoading, setLoading, setOptions, setStep } = useContext(Context);
  const router = useRouter();

  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

  const handleEdit = useCallback((qr: QrDataType) => {
    setLoading(true);
    setOptions({ ...qr.qrOptionsId, ...qr, mode: "edit" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (router.query.selected) {
      setStep(1);
    } else {
      setOptions(handleInitialData("Ebanux"));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (deleteConfirm !== null) {
      setLoading(true);
      const deleted = await QrHandler.remove(deleteConfirm);
      if (deleted) {
        router.replace("/").then(() => {
          setDeleteConfirm(null);
          setLoading(false);
        });
      }
    }
  };

  const handleDashboard = async () => {
    const dashBaseUrl = process.env.REACT_NODE_ENV === "develop" ? "https://dev-app.ebanux.com/checkouts" : "https://app.ebanux.com/checkouts";
    await router.push(dashBaseUrl);
  };

  const handleCancelDeletion = useCallback(() => {
    setDeleteConfirm(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showConfirmationDialog = useCallback((userId: string, createdAt: number) => {
    setDeleteConfirm({ userId, createdAt });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderOptions = (qr: any) => (
    <Stack direction="row" justifyContent="flex-end" alignItems="center">
      <IconButton color="primary" disabled={isLoading} hidden={qr.shortLinkId.visitCount === 0}
                  onClick={() => {
                    setLoading(true);
                    router.push("/qr/" + (new Date(qr.shortLinkId.createdAt)).getTime() + "/details").then(() => setLoading(false));
                  }}>
        <InfoOutlinedIcon />
      </IconButton>
      <IconButton color="primary" disabled={isLoading} onClick={() => handleEdit(qr)}>
        <EditOutlined />
      </IconButton>
      <IconButton color="error" disabled={isLoading} onClick={() => showConfirmationDialog(qr.userId, qr.createdAt)}>
        <DeleteOutlineRounded />
      </IconButton>
      {(qr.qrType === "donations" && !!qr.donationProductId) &&
        (
          <a target="_blank"
             href={process.env.REACT_NODE_ENV === "develop" ? "https://dev-app.ebanux.com/checkouts" : "https://app.ebanux.com/checkouts"}
             rel="noopener noreferrer">
            <Tooltip title="Go to Dashboard">
              <IconButton color="info" disabled={isLoading} onClick={handleDashboard}>
                <DashboardIcon />
              </IconButton>
            </Tooltip>
          </a>

        )}
    </Stack>
  );

  const renderStaticDynamic = (is: boolean) => (
    <Typography variant="caption" style={{ color: "gray" }}>
      {is ? <SyncIcon fontSize="inherit" /> : <SyncDisabledIcon fontSize="inherit" />}
      {is ? " Dynamic" : " Static"}
    </Typography>
  );

  const renderQr = (qrOptions: any, value: string, qr: any) => {
    const options = { ...qrOptions };
    if (!options.image?.trim().length) {
      options.image = null;
    }
    options.data = value;
    return <RenderPreview qrDesign={options} qr={qr} />;
  };

  return (
    <>
      <Stack spacing={2}>
        {qrs.items?.length > 0 ? (
          <>
            <Typography variant="h6" style={{ fontWeight: "bold" }}>My QR Codes</Typography>
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
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex" }}>
                          <Box sx={{ width: "70px", mx: 1 }}>
                            {!qr.qrOptionsId || !Object.keys(qr.qrOptionsId).length ? (
                              <Box sx={{ mt: 2, mb: 1.5 }}>
                                <Image src="/ebanuxQr.svg" width={55} height={55} alt={qr.qrName} />
                              </Box>
                            ) : (
                              <Box sx={{ mt: 1 }}>
                                {renderQr(qr.qrOptionsId, !qr.isDynamic ? handleDesignerString(qr.qrType, qr) : qr.qrOptionsId.data, qr)}
                              </Box>
                            )}
                          </Box>
                          <Stack direction="column" sx={{ my: "auto" }}>
                            <Typography variant="subtitle2"
                                        sx={{ color: "orange", mb: "-7px" }}>{capitalize(qr.qrType)}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: "-2px" }}>{qr.qrName}</Typography>
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
                        {!isWide && renderOptions(qr)}
                      </Box>
                    </Grid>
                    {!isWide ? (<Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          px: "11px",
                          mt: "-22px"
                        }}>
                        {renderStaticDynamic(qr.isDynamic)}
                        <Typography variant="caption" style={{ color: "gray" }}>
                          {`${qrLink.visitCount || 0} scans`}
                        </Typography>
                      </Box>
                    </Grid>) : (<Grid item xs={4}>
                      <Box sx={{ display: "flex" }}>
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <Stack direction="column" spacing={0.8} justifyContent="flex-start" alignItems="flex-start"
                               sx={{ ml: { xs: 2, sm: 0 } }}>
                          {renderStaticDynamic(qr.isDynamic)}
                          {qrLink.address ? (
                            <Typography variant="caption" sx={{ color: "gray" }}>{/*@ts-ignore*/}
                              <Public fontSize="inherit" /> <Link href={qrLink.link}>{qrLink.link.split("//")[1]}</Link>
                            </Typography>) : <></>}
                          <Typography variant="caption" sx={{ color: "gray" }}>
                            <Edit fontSize="inherit" /> {`Updated at: ${humanDate(new Date(qr.updatedAt).getTime())}`}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>)}
                    {isWide && (<Grid item xs={3}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        {qr.isDynamic ? (
                          <Stack direction="column" spacing={1.2} justifyContent="flex-start" alignItems="center">
                            <Typography variant="h4" style={{ color: qrLink.visitCount > 0 ? "blue" : "red" }}>
                              {qrLink.visitCount || 0}
                            </Typography>
                            <Typography variant="caption" style={{ color: "gray" }}>
                              Scans
                            </Typography>
                          </Stack>
                        ) : <div />}
                        {isWide && renderOptions(qr)}
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
      {deleteConfirm !== null ?
        <Dialog
          sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
          maxWidth="xs"
          open={true}>
          <DialogTitle>Delete confirmation</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the selected QR?</Typography>
            <Typography variant="caption" color="orange">This action can not be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCancelDeletion}>
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        : null}
    </>
  );
};

export default QrList;

import { ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import Typography from "@mui/material/Typography";
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import Context from "../../context/Context";
import RenderNameAndSecret from "./commonHelper/RenderNameAndSecret";
import RenderQRCommons from "../renderers/RenderQRCommons";
import { NO_MICROSITE, PROFILE_IMAGE } from "../constants";
import { download } from "../../../handlers/storage";
import {DataType, ProcessHanldlerType} from "../types/types";
import { getOptionsForPreview, previewQRGenerator } from "../../../helpers/qr/auxFunctions";
import { saveOrUpdate } from "../auxFunctions";
import { blobUrlToFile, useCheckOnlyQr } from "../../../helpers/qr/helpers";
import { generateUUID } from "listr2/dist/utils/uuid";
import { releaseWaiting, startWaiting } from "../../Waiting";
import { FORCE_EXTRA, IGNORE_VALIDATOR } from "../../../consts";

import valueHanler from "./valueHandler";
import validator from "../validator";
import dynamic from "next/dynamic";

const RenderStats = dynamic(() => import("./commonHelper/RenderStats"));
const ErrorsDialog = dynamic(() => import("./looseComps/ErrorsDialog"));
const RenderMode = dynamic(() => import("./looseComps/RenderMode"));
const Notifications = dynamic(() => import("../../notifications/Notifications"));
const RenderPreviewDrawer = dynamic(() => import("./smallpieces/RenderPreviewDrawer"));
const RenderPreviewButton = dynamic(() => import("./smallpieces/RenderPreviewButton"));
const RenderSamplePreview = dynamic(() => import("./smallpieces/RenderSamplePreview"));
const RenderClaimingInfo = dynamic(() => import("./smallpieces/RenderClaimingInfo"));
const LoadingMicrositeImages = dynamic(() => import("./looseComps/LoadingMicrositeImages"));
const QueryStatsIcon = dynamic(() => import("@mui/icons-material/QueryStats"));
const ProcessHandler = dynamic(() => import("../renderers/ProcessHandler"));

interface CommonProps {
  msg: string; children: ReactNode;
}

function Common({msg, children}: CommonProps) { // @ts-ignore
  const {selected, data, setData, userInfo, options, isWrong, background, frame, cornersData, dotsData} = useContext(Context);

  const [loading, setLocalLoading] = useState<boolean>(false);
  const [backImg, setBackImg] = useState<any>(undefined);
  const [micrositeBackImage, setMicrositeBackImage] = useState<any>(undefined);
  const [foreImg, setForeImg] = useState<any>(undefined);
  const [error, setError] = useState<boolean>(false);
  const [tabSelected, setTabSelected] = useState<number>(0);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [forceOpen, setForceOpen] = useState<string | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<string[] | undefined>(undefined);
  const [, setUnusedState] = useState();

  const lastAction = useRef<string | undefined>(undefined);
  const loadingCount = useRef<number>(0);
  const dataInfo = useRef<ProcessHanldlerType[]>([]);

  const isWideForPreview = useMediaQuery("(min-width:720px)", { noSsr: true });

  // @ts-ignore
  const forceUpdate = useCallback(() => setUnusedState({}), []);

  const handleSelectTab = (_: any, newValue: number) => {
    setTabSelected(newValue);
  }

  const releasePick = useCallback(() => setForceOpen(undefined), []);

  const handleValue = useCallback((prop: string) => (payload: any) => {
    valueHanler(prop, data, payload, foreImg, backImg, micrositeBackImage, setData, setBackImg, setForeImg, setMicrositeBackImage);
  }, [backImg, foreImg, micrositeBackImage]); // eslint-disable-line react-hooks/exhaustive-deps

  const getFiles = useCallback(async (key: string, item: string) => {
    try {
      lastAction.current = 'loading images';
      const fileData = await download(key);

      if (options.mode === 'edit') {
        if (item === 'micrositeBackImage') { // @ts-ignore
          setMicrositeBackImage(structuredClone(fileData.content));
        } else if (item === 'backgndImg') { // @ts-ignore
          setBackImg(structuredClone(fileData.content));
        } else { // @ts-ignore
          setForeImg(structuredClone(fileData.content));
        }
      } else if (options.mode === 'clone') {
        if (item === 'micrositeBackImage') { // @ts-ignore
          const {name}: {name: string} = data.micrositeBackImage[0]; // @ts-ignore
          const file = await blobUrlToFile(fileData.content, `${generateUUID()}${name.slice(name.lastIndexOf('.'))}`);
          setData((prev: DataType) => ({...prev, micrositeBackImage: file}))
        } else if (item === 'backgndImg') {
          const {name}: {name: string} = data.backgndImg[0]; // @ts-ignore
          const file = await blobUrlToFile(fileData.content, `${generateUUID()}${name.slice(name.lastIndexOf('.'))}`);
          setData((prev: DataType) => ({...prev, backgndImg: file}))
        } else {
          const {name}: {name: string} = data.foregndImg[0]; // @ts-ignore
          const file = await blobUrlToFile(fileData.content, `${generateUUID()}${name.slice(name.lastIndexOf('.'))}`);
          setData((prev: DataType) => ({...prev, foregndImg: file}))
        }
      }

      loadingCount.current -= 1;
    } catch {
      if (item === 'micrositeBackImage') {
        setMicrositeBackImage(null);
      } else if (item === 'backgndImg') {
        setBackImg(null);
      } else {
        setForeImg(null);
      }

      loadingCount.current -= 1;
      setError(true);
    } finally {
      if (loadingCount.current === 0) {
        setLocalLoading(false);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isEditOrClone = useMemo(() => data.mode === 'edit' || data.mode === 'clone', [data?.mode]);

  useEffect(() => {
    if (isEditOrClone) {
      if (data?.micrositeBackImage?.[0]?.Key) {
        loadingCount.current += 1;
        setLocalLoading(true);
        getFiles(data.micrositeBackImage[0].Key, 'micrositeBackImage');
      }
      if (data?.backgndImg?.[0]?.Key) {
        loadingCount.current += 1;
        setLocalLoading(true);
        getFiles(data.backgndImg[0].Key, 'backgndImg');
      }
      if (data?.foregndImg?.[0]?.Key) {
        loadingCount.current += 1;
        setLocalLoading(true);
        getFiles(data.foregndImg[0].Key, 'foregndImg');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      dataInfo.current = [];
      forceUpdate();
      releaseWaiting();
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isWideForPreview && openPreview) { setOpenPreview(false); }
  }, [isWideForPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (forceOpen && tabSelected === 0) { setTabSelected(1); }
  }, [forceOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderChildren = () => (<>
    <Typography>{msg}</Typography>
    {children}
  </>);

  const getValidationErrors = useCallback(() =>
    validator(data.custom || [], FORCE_EXTRA.includes(selected), IGNORE_VALIDATOR.includes(selected) || !data.isDynamic),
    [data.custom, data.isDynamic, selected]);

  const handleSave = async () => {
    const validate = getValidationErrors();
    if (validate.length) {
      setValidationErrors(validate);
    } else {
      lastAction.current = 'saving the data';
      startWaiting();
      await saveOrUpdate(data, userInfo, options, frame, background, cornersData, dotsData, selected, setError,
        (creationDate?: string, qrForSharing?: any) => {
        setData((prev: DataType) => {
          const newData = {...prev};
          if (newData.mode !== 'secret') { newData.mode = 'edit'; }
          if (newData.claim !== undefined) { delete newData.claim; }
          if (newData.preGenerated !== undefined) { delete newData.preGenerated; }
          if (newData.claimable !== undefined) { delete newData.claimable; } // @ts-ignore
          if (creationDate) { newData.createdAt = creationDate; }
          if (qrForSharing) { newData.qrForSharing = qrForSharing; }
          return newData;
        });
        dataInfo.current = [];
        forceUpdate();
        releaseWaiting();
      }, undefined, undefined, undefined, (value: string | null, status?: boolean) => {
        if (value !== null) {
          dataInfo.current.push({ value });
        } else {
          dataInfo.current[dataInfo.current.length - 1].status = status;
        }
        forceUpdate();
      });
    }
  };

  const isOnlyQr = useCheckOnlyQr(selected, data);

  const handleImg = useCallback((prop: string) => setForceOpen(prop), []);
  const forceOpenValidator = () => { setValidationErrors(getValidationErrors()); }

  const optionsForPreview = useMemo(() => // eslint-disable-next-line react-hooks/exhaustive-deps
    getOptionsForPreview(data, options, background, frame, cornersData, dotsData, selected), [data, options.data]);

  const omitProfileImg = useMemo(() => !PROFILE_IMAGE.includes(selected) || !data?.isDynamic, [selected, data?.isDynamic]); // eslint-disable-line react-hooks/exhaustive-deps
  const code = useMemo(() => options?.data ? options.data.slice(options.data.lastIndexOf('/') + 1) : selected, [options?.data, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {error && (
        <Notifications
          title="Something went wrong"
          message={`There was an error ${lastAction.current}`}
          onClose={() => setError(false)}
          vertical="bottom"
          horizontal="center"
          showProgress
          autoHideDuration={10500}
        />
      )}
      {dataInfo.current.length ? <ProcessHandler process={dataInfo.current} handleCommand={() => {}}/> : null}
      {userInfo || data.mode === 'secret' ? (
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '100%' }}>
            <RenderNameAndSecret handleValue={handleValue} qrName={data?.qrName} secret={data?.secret} code={code}
                                 hideSecret={data.mode === 'secret' || !data?.isDynamic} errors={getValidationErrors()}
                                 openValidationErrors={forceOpenValidator} secretOps={data?.secretOps} handleSave={handleSave} />
            {![...NO_MICROSITE, 'web'].includes(selected) && data?.isDynamic ? (
              <Box sx={{width: '100%', position: 'relative'}}>
                <Tabs value={tabSelected} onChange={handleSelectTab} sx={{ mb: 1 }}>
                  <Tab label="Content" icon={<ArticleIcon fontSize="small"/>} iconPosition="start" sx={{ mt: '-10px', mb: '-15px'}}/>
                  <Tab label="Page Design" icon={<DesignServicesIcon fontSize="small"/>} iconPosition="start" sx={{ mt: '-10px', mb: '-15px'}}/>
                  {data.mode === 'edit' && <Tab label="Stats" icon={<QueryStatsIcon fontSize="small"/>} iconPosition="start" sx={{ mt: '-10px', mb: '-15px'}}/>}
                </Tabs>
                {data.mode && <RenderMode isWide={isWideForPreview} mode={data.mode} />}
                {data.claim !== undefined && (
                  <Box sx={{position: 'absolute', textAlign: 'center', top: '7px', right: 0}}>
                    <RenderClaimingInfo claim={data.claim} />
                  </Box>
                )}
                {loading && <LoadingMicrositeImages />}
                {tabSelected === 0 && renderChildren()}
                {tabSelected === 1 && (
                  <RenderQRCommons
                    isWideForPreview={isWideForPreview} handleValue={handleValue} omitPrimaryImg={omitProfileImg}
                    backgndImg={isEditOrClone ? (Array.isArray(data?.backgndImg) ? backImg || undefined : data?.backgndImg) : data?.backgndImg}
                    foregndImg={isEditOrClone ? (Array.isArray(data?.foregndImg) ? foreImg || undefined : data?.foregndImg) : data?.foregndImg}
                    micrositesImg={isEditOrClone ? (Array.isArray(data?.micrositeBackImage) ? micrositeBackImage || undefined : data?.micrositeBackImage) : data?.micrositeBackImage}
                    loading={loading} foreError={foreImg === null} backError={backImg === null}
                    data={data} releasePick={releasePick} forcePick={forceOpen} />
                )}
                {tabSelected === 2 && <RenderStats userId={options.userId} visitCount={data.visitCount} createdAt={data.creation} />}
              </Box>
            ) : renderChildren()}
          </Box>
          {isWideForPreview && (
            <RenderSamplePreview
              code={code} save={handleSave} style={{mt: 1, ml: '15px', position: 'sticky', top: '120px'}}
              saveDisabled={isWrong || !data.qrName?.trim().length} shareLink={options?.data}
              qrOptions={optionsForPreview} step={1} data={previewQRGenerator(data, selected, omitProfileImg)}
              onlyQr={isOnlyQr} isDynamic={data.isDynamic || false}
              backImg={isEditOrClone && backImg ? backImg : undefined} handlePickImage={handleImg}
              mainImg={isEditOrClone && foreImg ? foreImg : undefined}
              backgroundImg={isEditOrClone && micrositeBackImage ? micrositeBackImage : undefined} />
          )}
        </Box>
      ) : renderChildren()}
      {!openPreview && !isWideForPreview  && <RenderPreviewButton setOpenPreview={setOpenPreview} message="Preview" />}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer title="Preview" setOpenPreview={setOpenPreview} height={selected === 'web' || !data.isDynamic ? 400 : 700} border={35}>
          <RenderSamplePreview
            code={code} save={handleSave} saveDisabled={isWrong || !data.qrName?.trim().length} style={{mt: '-15px'}}
            data={previewQRGenerator(data, selected, omitProfileImg)} step={1} isDrawed
            onlyQr={isOnlyQr} isDynamic={data.isDynamic || false}
            shareLink={options?.data} qrOptions={optionsForPreview} handlePickImage={handleImg}
            backImg={isEditOrClone && backImg ? backImg : undefined}
            mainImg={isEditOrClone && foreImg ? foreImg : undefined}
            backgroundImg={isEditOrClone && micrositeBackImage ? micrositeBackImage : undefined} />
        </RenderPreviewDrawer>
      )}
      {validationErrors !== undefined && (
        <ErrorsDialog errors={validationErrors} handleClose={() => setValidationErrors(undefined)} />
      )}
    </>
  );
}

export default Common;

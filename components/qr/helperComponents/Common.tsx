import {ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import dynamic from "next/dynamic";

import Context from "../../context/Context";
import RenderQRCommons from "../renderers/RenderQRCommons";
import {DEFAULT_COLORS, NO_MICROSITE, PROFILE_IMAGE} from "../constants";
import {download} from "../../../handlers/storage";
import {DataType} from "../types/types";
import {previewQRGenerator} from "../../../helpers/qr/auxFunctions";
import {saveOrUpdate} from "../auxFunctions";
import {blobUrlToFile, handleDesignerString} from "../../../helpers/qr/helpers";
import {initialData} from "../../../helpers/qr/data";
import {generateUUID} from "listr2/dist/utils/uuid";

const RenderMode = dynamic(() => import("./looseComps/RenderMode"));
const Notifications = dynamic(() => import("../../notifications/Notifications"));
const RenderPreviewDrawer = dynamic(() => import("./smallpieces/RenderPreviewDrawer"));
const RenderPreviewButton = dynamic(() => import("./smallpieces/RenderPreviewButton"));
const RenderSamplePreview = dynamic(() => import("./smallpieces/RenderSamplePreview"));
const RenderClaimingInfo = dynamic(() => import("./smallpieces/RenderClaimingInfo"));

interface CommonProps {
  msg: string;
  children: ReactNode;
}

function Common({msg, children}: CommonProps) { // @ts-ignore
  const {selected, data, setData, userInfo, options, isWrong, background, frame, cornersData, dotsData, setLoading} = useContext(Context);

  const [loading, setLocalLoading] = useState<boolean>(false);
  const [backImg, setBackImg] = useState<any>(undefined);
  const [micrositeBackImage, setMicrositeBackImage] = useState<any>(undefined);
  const [foreImg, setForeImg] = useState<any>(undefined);
  const [error, setError] = useState<boolean>(false);
  const [tabSelected, setTabSelected] = useState<number>(0);
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [forceOpen, setForceOpen] = useState<string | undefined>(undefined);

  const lastAction = useRef<string | undefined>(undefined);
  const loadingCount = useRef<number>(0);

  const isWideForPreview = useMediaQuery("(min-width:720px)", { noSsr: true });

  const handleSelectTab = (_: any, newValue: number) => {
    setTabSelected(newValue);
  }

  const releasePick = useCallback(() => setForceOpen(undefined), []);

  const handleValue = useCallback((prop: string) => (payload: any) => {
    if (payload === undefined) {
      setData((prev: any) => {
        const newData = {...prev};
        if (prop === 'micrositeBackImage' && prev?.micrositeBackImage?.[0]?.Key) { newData.prevMicrositeImg = prev.micrositeBackImage[0].Key; }
        if (prop === 'backgndImg' && prev?.backgndImg?.[0]?.Key) { newData.prevBackImg = prev.backgndImg[0].Key; }
        if (prop === 'foregndImg' && prev?.foregndImg?.[0]?.Key) { newData.prevForeImg = prev.foregndImg[0].Key; }
        delete newData[prop];
        return newData;
      });
      if (prop === 'micrositeBackImage' && micrositeBackImage) { setMicrositeBackImage(undefined); }
      if (prop === 'backgndImg' && backImg) { setBackImg(undefined); }
      if (prop === 'foregndImg' && foreImg) { setForeImg(undefined); }
    } else if (!prop.startsWith('both')) {
      if (prop === 'micrositeBackImage' && micrositeBackImage !== undefined) {
        setMicrositeBackImage(undefined); // @ts-ignore
        setData((prev: DataType) => ({...prev, micrositeBackImage: payload, prevMicrositeImg: prev.micrositeBackImage[0].Key}));
      } else if (prop === 'backgndImg' && backImg !== undefined) {
        setBackImg(undefined); // @ts-ignore
        setData((prev: DataType) => ({...prev, backgndImg: payload, prevBackImg: prev.backgndImg[0].Key}));
      } else if (prop === 'foregndImg' && foreImg !== undefined) {
        setForeImg(undefined); // @ts-ignore
        setData((prev: DataType) => ({...prev, foregndImg: payload, prevForeImg: prev.foregndImg[0].Key}));
      } else if (payload.clear || (((prop === "globalFont" && payload === "Default") ||
          (['buttonsFont', 'titlesFont', 'messagesFont', 'titlesFontSize', 'messagesFontSize', 'buttonsFontSize',
              'subtitlesFontSize', 'subtitlesFont', 'layout'].includes(prop) && (['none', 'default'].includes(payload))
          )) && data[prop] === payload) || (prop === 'buttonShape' && payload === '1') ||
        (prop === 'buttonBack' && payload === 'default') || (prop === 'autoOpen' && !payload)) {
        setData((prev: any) => {
          const tempo = {...prev};
          delete tempo[prop];
          if (prop === 'buttonBack' && payload === 'default' && tempo.buttonBackColor !== undefined) {
            delete tempo.buttonBackColor;
          }
          return tempo;
        })
      } else if (prop === 'backgroundType') {
        setData((prev: any) => {
          const tempo = {...prev};
          if (tempo.backgroundColor !== undefined) { delete tempo.backgroundColor; }
          if (tempo.backgroundColorRight !== undefined) { delete tempo.backgroundColorRight; }
          if (tempo.backgroundDirection !== undefined) { delete tempo.backgroundDirection; }
          tempo.backgroundType = payload?.target?.value || payload;
          if (tempo.backgroundType !== 'image' && tempo.micrositeBackImage !== undefined) {
            setMicrositeBackImage(undefined);
            delete tempo.micrositeBackImage;
          }
          return tempo;
        });
      } else if (prop === 'buttonBack') {
        setData((prev: any) => {
          const newData = {...prev, buttonBackColor: payload === 'solid' ? DEFAULT_COLORS.p : 'unset'};
          newData[prop] = payload.target?.value !== undefined ? payload.target.value : payload;
          if (payload === 'gradient' && newData.buttonsOpacity !== undefined) {
            delete newData.buttonsOpacity;
          }
          return newData;
        });
      } else if (prop === 'buttonShape') {
        setData((prev: any) => {
          const newData = {...prev, [prop]: payload};
          if (newData.flipHorizontal !== undefined) { delete newData.flipHorizontal; }
          if (newData.flipVertical !== undefined && !['5', '6', '7'].includes(payload)) { delete newData.flipVertical; }
          if (newData.alternate !== undefined && !['5', '6', '7'].includes(payload)) { delete newData.alternate; }
          if (payload !== '4' && newData.buttonBorders !== undefined) { delete newData.buttonBorders; }
          return newData;
        })
      } else {
        setData((prev: any) => {
          const newData = {...prev};
          newData[prop] = payload.target?.value !== undefined ? payload.target.value : payload;
          if (prop === 'footerKind') {
            if (payload === 'default') { delete newData.footerKind; }
            if (payload !== 'custom' && newData.customFooter !== undefined) { delete newData.customFooter; }
          }
          if (prop === 'layout' && typeof payload === 'string' && payload.includes('banner') && newData.backgndImg !== undefined) {
            delete newData.backgndImg;
            setBackImg(undefined);
          } else if (['flipHorizontal', 'flipVertical', 'buttonShadow', 'buttonCase'].includes(prop) && !payload && newData[prop] !== undefined) {
            delete newData[prop];
          } else if (prop === 'buttonBorderStyle') {
            if (payload !== 'two' && newData.buttonBorderColors !== undefined) {
              delete newData.buttonBorderColors;
            }
            if (payload === 'noBorders') {
              delete newData.buttonBorderStyle;
              if (newData.buttonBorderWeight !== undefined) { delete newData.buttonBorderWeight; }
              if (newData.buttonBorderType !== undefined) { delete newData.buttonBorderType; }
            }
          }
          return newData;
        });
      }
    } else if ((prop === 'both' && (payload.p !== DEFAULT_COLORS.p || payload.s !== DEFAULT_COLORS.s)) ||
      (prop === 'both-gradient' && (payload.p !== DEFAULT_COLORS.s || payload.s !== DEFAULT_COLORS.p) )) {
      const isMain = prop === 'both';
      setData((prev: any) => ({...prev, [isMain ? 'primary' : 'backgroundColor']: payload.p, [isMain ? 'secondary' : 'backgroundColorRight']: payload.s}));
    } else {
      setData((prev: any) => {
        const temp = {...prev};
        if (prop === 'both') {
          if (temp.primary) { delete temp.primary; }
          if (temp.secondary) { delete temp.secondary; }
        } else {
          if (temp.backgroundColor) { delete temp.backgroundColor; }
          if (temp.backgroundColorRight) { delete temp.backgroundColorRight; }
        }
        return temp;
      });
    }
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
        setLocalLoading(true);
        loadingCount.current += 1;
        getFiles(data.micrositeBackImage[0].Key, 'micrositeBackImage');
      }
      if (data?.backgndImg?.[0]?.Key) {
        setLocalLoading(true);
        loadingCount.current += 1;
        getFiles(data.backgndImg[0].Key, 'backgndImg');
      }
      if (data?.foregndImg?.[0]?.Key) {
        setLocalLoading(true);
        loadingCount.current += 1;
        getFiles(data.foregndImg[0].Key, 'foregndImg');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isWideForPreview && openPreview) { setOpenPreview(false); }
  }, [isWideForPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (forceOpen) {
      if (tabSelected === 0) {
        setTabSelected(1);
      }
      // setForceOpen(undefined);
    }
  }, [forceOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderChildren = () => (<>
    <Typography>{msg}</Typography>
    {children}
  </>);

  const handleSave = async () => {
    lastAction.current = 'saving the data';
    setLoading(true);
    await saveOrUpdate(data, userInfo, options, frame, background, cornersData, dotsData, selected, setError, (creationDate?: string) => {
      setData((prev: DataType) => {
        const newData = {...prev, mode: 'edit'};
        if (newData.claim !== undefined) {
          delete newData.claim;
        }
        if (newData.preGenerated !== undefined) {
          delete newData.preGenerated;
        }
        if (newData.claimable !== undefined) {
          delete newData.claimable;
        }
        if (creationDate) { // @ts-ignore
          newData.createdAt = creationDate;
        }
        return newData;
      });
      setLoading(false);
    });
  };

  const handleImg = useCallback((prop: string) => {
    setForceOpen(prop);
  }, []);

  const optionsForPreview = useCallback(() => {
    const opts = {...options, background, frame, corners: cornersData, cornersDot: dotsData};
    if (!data?.isDynamic) {
      opts.data = handleDesignerString(selected, data || {...initialData});
      if (!opts.data.length) {
        opts.data = selected === 'web' ? 'https://www.example.com' : 'Example';
      }
    }
    return opts;
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const omitProfileImg = useMemo(() => !PROFILE_IMAGE.includes(selected) || !data?.isDynamic, [selected, data?.isDynamic]); // eslint-disable-line react-hooks/exhaustive-deps

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
      {userInfo ? (
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="QR name"
              required
              size="small"
              fullWidth
              margin="dense"
              value={data?.qrName || ''}
              onChange={handleValue('qrName')}
              InputProps={{
                endAdornment: (
                  !Boolean(data?.qrName?.trim().length) ? (<InputAdornment position="end">
                    <Typography color="error">{'REQUIRED'}</Typography>
                  </InputAdornment>) : null
                )
              }}
            />
            {![...NO_MICROSITE, 'web'].includes(selected) && data?.isDynamic ? (
              <Box sx={{width: '100%', position: 'relative'}}>
                <Tabs value={tabSelected} onChange={handleSelectTab} sx={{ mb: 1 }}>
                  <Tab label="Content" icon={<ArticleIcon fontSize="small"/>} iconPosition="start" sx={{ mt: '-10px', mb: '-15px'}}/>
                  <Tab label="Page Design" icon={<DesignServicesIcon fontSize="small"/>} iconPosition="start" sx={{ mt: '-10px', mb: '-15px'}}/>
                </Tabs>
                {data.mode && <RenderMode isWide={isWideForPreview} mode={data.mode} />}
                {data.claim !== undefined && (
                  <Box sx={{position: 'absolute', textAlign: 'center', top: '7px', right: 0}}>
                    <RenderClaimingInfo claim={data.claim} />
                  </Box>
                )}
                {tabSelected === 0 ? renderChildren() : (
                  <RenderQRCommons
                    isWideForPreview={isWideForPreview} handleValue={handleValue} omitPrimaryImg={omitProfileImg}
                    backgndImg={isEditOrClone ? (Array.isArray(data?.backgndImg) ? backImg || undefined : data?.backgndImg) : data?.backgndImg}
                    foregndImg={isEditOrClone ? (Array.isArray(data?.foregndImg) ? foreImg || undefined : data?.foregndImg) : data?.foregndImg}
                    micrositesImg={isEditOrClone ? (Array.isArray(data?.micrositeBackImage) ? micrositeBackImage || undefined : data?.micrositeBackImage) : data?.micrositeBackImage}
                    loading={loading} foreError={foreImg === null} backError={backImg === null}
                    data={data} releasePick={releasePick} forcePick={forceOpen} />
                )}
              </Box>
            ) : renderChildren()}
          </Box>
          {isWideForPreview && (
            <RenderSamplePreview
              code={options?.data ? options.data.slice(options.data.lastIndexOf('/') + 1) : selected}
              save={handleSave} style={{mt: 1, ml: '15px', position: 'sticky', top: '120px'}}
              saveDisabled={isWrong || !data.qrName?.trim().length} shareLink={options?.data}
              qrOptions={optionsForPreview()} step={1} data={previewQRGenerator(data, selected, omitProfileImg)}
              onlyQr={selected === 'web' || !data.isDynamic} isDynamic={data.isDynamic || false}
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
            code={options?.data ? options.data.slice(options.data.lastIndexOf('/') + 1) : selected}
            save={handleSave} saveDisabled={isWrong || !data.qrName?.trim().length} style={{mt: '-15px'}}
            data={previewQRGenerator(data, selected, omitProfileImg)} step={1} isDrawed
            onlyQr={selected === 'web' || !data.isDynamic} isDynamic={data.isDynamic || false}
            shareLink={options?.data} qrOptions={optionsForPreview()} handlePickImage={handleImg}
            backImg={isEditOrClone && backImg ? backImg : undefined}
            mainImg={isEditOrClone && foreImg ? foreImg : undefined}
            backgroundImg={isEditOrClone && micrositeBackImage ? micrositeBackImage : undefined} />
        </RenderPreviewDrawer>
      )}
    </>
  );
}

export default Common;

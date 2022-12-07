import {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import ArticleIcon from '@mui/icons-material/Article';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {alpha} from "@mui/material/styles";

import Context from "../../context/Context";
import RenderQRCommons from "../renderers/RenderQRCommons";
import {DEFAULT_COLORS, IS_DEV_ENV, NO_MICROSITE} from "../constants";
import {download} from "../../../handlers/storage";
import Notifications from "../../notifications/Notifications";
import {DataType} from "../types/types";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import RenderPreviewDrawer from "./smallpieces/RenderPreviewDrawer";
import RenderPreviewButton from "./smallpieces/RenderPreviewButton";
import RenderSamplePreview from "./smallpieces/RenderSamplePreview";

interface CommonProps {
  msg: string;
  children: ReactNode;
}

function Common({msg, children}: CommonProps) { // @ts-ignore
  const {selected, data, setData, userInfo, options, isWrong} = useContext(Context);

  const [loading, setLoading] = useState<boolean>(false);
  const [backImg, setBackImg] = useState<any>(undefined);
  const [foreImg, setForeImg] = useState<any>(undefined);
  const [error, setError] = useState<boolean>(false);
  const [tabSelected, setTabSelected] = useState<number>(0);
  const [openPreview, setOpenPreview] = useState<boolean>(false);

  const isWideForPreview = useMediaQuery("(min-width:720px)", { noSsr: true });

  const handleSelectTab = (_: any, newValue: number) => {
    setTabSelected(newValue);
  }

  const handleValue = useCallback((prop: string) => (payload: any) => {
    if (payload === undefined) {
      setData((prev: any) => {
        const tempo = {...prev};
        delete tempo[prop];
        return tempo;
      })
    } else if (!prop.startsWith('both')) {
      if (prop === 'backgndImg' && backImg !== undefined) {
        setBackImg(undefined); // @ts-ignore
        setData((prev: DataType) => ({...prev, backgndImg: payload, prevBackImg: prev.backgndImg[0].Key}));
      } else if (prop === 'foregndImg' && foreImg !== undefined) {
        setForeImg(undefined); // @ts-ignore
        setData((prev: DataType) => ({...prev, foregndImg: payload, prevForeImg: prev.foregndImg[0].Key}));
      } else if (payload.clear) {
        setData((prev: any) => {
          const tempo = {...prev};
          delete tempo[prop];
          return tempo;
        })
      } else if (prop === 'backgroundType') {
        setData((prev: any) => {
          const tempo = {...prev};
          if (tempo.backgroundColor !== undefined) { delete tempo.backgroundColor }
          if (tempo.backgroundColorRight !== undefined) { delete tempo.backgroundColorRight }
          tempo.backgroundType = payload.target.value;
          return tempo;
        })
      } else {
        setData((prev: any) => ({
          ...prev, [prop]: payload.target?.value !== undefined ? payload.target.value : payload
        }));
      }
    } else if (payload.p !== DEFAULT_COLORS.p || payload.s !== DEFAULT_COLORS.s) {
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
  }, [backImg, foreImg]); // eslint-disable-line react-hooks/exhaustive-deps

  const getFiles = useCallback(async (key: string, item: string) => {
    try {
      const fileData = await download(key);
      if (item === 'backgndImg') { // @ts-ignore
        setBackImg(fileData.content);
      } else { // @ts-ignore
        setForeImg(fileData.content);
      }
    } catch {
      if (item === 'backgndImg') {
        setBackImg(null);
      } else {
        setForeImg(null);
      }
      setError(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data.mode === 'edit') {
      if (data.backgndImg) {
        setLoading(true);
        getFiles(data.backgndImg[0].Key, 'backgndImg');
      }
      if (data.foregndImg) {
        setLoading(true);
        getFiles(data.foregndImg[0].Key, 'foregndImg');
      }
    }
  }, [data.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((backImg !== undefined && !data.foregndImg) || (foreImg !== undefined && !data.backgndImg) || (foreImg !== undefined && backImg !== undefined)) {
      setLoading(false);
    }
  }, [backImg, foreImg]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isWideForPreview && openPreview) { setOpenPreview(false); }
  }, [isWideForPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderChildren = () => (<>
    <Typography>{msg}</Typography>
    {children}
  </>);

  const handleSave = () => {}

  return (
    <>
      {error && (
        <Notifications
          title="Something went wrong"
          message="There was an error loading the background/main images"
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
            {!NO_MICROSITE.includes(selected) && data?.isDynamic ? (
              <Box sx={{ width: '100%' }}>
                <Tabs value={tabSelected} onChange={handleSelectTab} sx={{ borderBottom: theme => `1px solid ${alpha(theme.palette.text.disabled, 0.2)}`, mb: 1 }}>
                  <Tab label="Content" icon={<ArticleIcon fontSize="small"/>} iconPosition="start" sx={{ mt: '-10px', mb: '-15px'}}/>
                  <Tab label="Design" icon={<DesignServicesIcon fontSize="small"/>} iconPosition="start" sx={{ mt: '-10px', mb: '-15px'}}/>
                </Tabs>
                {tabSelected === 0 ? renderChildren() : (
                  <RenderQRCommons
                    handleValue={handleValue}
                    omitPrimaryImg={!['vcard+', 'link', 'business', 'social', 'donations'].includes(selected) || !data?.isDynamic}
                    backgndImg={data.mode === 'edit' ? (Array.isArray(data?.backgndImg) ? backImg || undefined : data?.backgndImg) : data?.backgndImg}
                    foregndImg={data.mode === 'edit' ? (Array.isArray(data?.foregndImg) ? foreImg || undefined : data?.foregndImg) : data?.foregndImg}
                    loading={loading}
                    foreError={foreImg === null}
                    backError={backImg === null}
                    data={data}/>
                )}
              </Box>
            ) : renderChildren()}
          </Box>
          {IS_DEV_ENV && isWideForPreview && !NO_MICROSITE.includes(selected) && data?.isDynamic && (
            <RenderSamplePreview code={options?.shortCode || selected} save={handleSave} style={{mt: '8px', ml: '15px'}}
                                 saveDisabled={isWrong} data={{...data, qrType: selected}} onlyQr={selected === 'web'} />
          )}
        </Box>
      ) : renderChildren()}
      {IS_DEV_ENV && !openPreview && !isWideForPreview && !NO_MICROSITE.includes(selected) && data?.isDynamic && ( // @ts-ignore
        <RenderPreviewButton setOpenPreview={setOpenPreview} message="Preview" />
      )}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer title="Preview" setOpenPreview={setOpenPreview} height={708} border={35}>
          <RenderSamplePreview code={options?.shortCode || selected} save={handleSave} isDrawed saveDisabled={isWrong}
                               data={data} onlyQr={selected === 'web'} />
        </RenderPreviewDrawer>
      )}
    </>
  );
}

export default Common;

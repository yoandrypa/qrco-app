import {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Context from "../../context/Context";
import RenderQRCommons from "../renderers/RenderQRCommons";

import {DEFAULT_COLORS} from "../constants";
import {download} from "../../../handlers/storage";
import Notifications from "../../notifications/Notifications";
import {DataType} from "../types/types";

interface CommonProps {
  msg: string;
  children: ReactNode;
}

function Common({ msg, children }: CommonProps) {
  // @ts-ignore
  const { selected, data, setData } = useContext(Context);

  const [loading, setLoading] = useState<boolean>(false);
  const [backImg, setBackImg] = useState<any>(undefined);
  const [foreImg, setForeImg] = useState<any>(undefined);
  const [error, setError] = useState<boolean>(false);

  const handleValue = useCallback((prop: string) => (payload: any) => {
    if (payload === undefined) {
      setData((prev: any) => {
        const tempo = {...prev};
        delete tempo[prop];
        return tempo;
      })
    } else if (prop !== 'both') {
      if (prop === 'backgndImg' && backImg !== undefined) {
        setBackImg(undefined); // @ts-ignore
        setData((prev: DataType) => ({...prev, backgndImg: payload, prevBackImg: prev.backgndImg[0].Key}));
      } else if (prop === 'foregndImg' && foreImg !== undefined) {
        setForeImg(undefined); // @ts-ignore
        setData((prev: DataType) => ({...prev, foregndImg: payload, prevForeImg: prev.foregndImg[0].Key}));
      } else {
        setData((prev: any) => ({ ...prev, [prop]: payload.target?.value !== undefined ? payload.target.value : payload }));
      }
    } else if (payload.p !== DEFAULT_COLORS.p || payload.s !== DEFAULT_COLORS.s) {
      setData((prev: any) => ({ ...prev, primary: payload.p, secondary: payload.s }));
    } else {
      setData((prev: any) => {
        const temp = { ...prev };
        if (temp.primary) { delete temp.primary; }
        if (temp.secondary) { delete temp.secondary; }
        return temp;
      });
    }
  }, [backImg, foreImg]); // eslint-disable-line react-hooks/exhaustive-deps

  const getFiles = useCallback(async (key: string, item: string) => {
    try {
      const fileData = await download(key);
      if (item === 'backgndImg') {
        // @ts-ignore
        setBackImg(fileData.content);
      } else {
        // @ts-ignore
        setForeImg(fileData.content);
      }
    } catch {
      setError(true);
      if ((item === 'backgndImg' && data.foregndImg && foreImg !== undefined) || (item === 'foregndImg' && data.backgndImg && backImg !== undefined)) {
        setLoading(false);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data.mode === 'edit') {
      if (data.backgndImg) {
        setLoading(true);
        getFiles(data.backgndImg[0].Key,'backgndImg');
      }
      if (data.foregndImg) {
        setLoading(true);
        getFiles(data.foregndImg[0].Key, 'foregndImg');
      }
    }
  }, [data.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((backImg && (!data?.foregndImg || foreImg)) || (foreImg && (!data?.backgndImg || backImg))) {
      setLoading(false);
    }
  }, [backImg, foreImg]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {error && (
        <Notifications
          title="Something went wrong"
          message="There was an error loading the background/main images"
          onClose={() => setError(false)}
          vertical="bottom"
          horizontal="center"
        />
      )}
      <RenderQRCommons
        handleValue={handleValue}
        qrName={data?.qrName}
        omitDesign={['web', 'facebook', 'twitter', 'whatsapp'].includes(selected) || !data?.isDynamic}
        omitPrimaryImg={!['vcard+', 'link', 'business', 'social', 'donations'].includes(selected) || !data?.isDynamic}
        backgndImg={data.mode === 'edit' ? (Array.isArray(data?.backgndImg) ? backImg || undefined : data?.backgndImg) : data?.backgndImg}
        foregndImg={data.mode === 'edit' ? (Array.isArray(data?.foregndImg) ? foreImg || undefined : data?.foregndImg) : data?.foregndImg}
        foregndImgType={data?.foregndImgType}
        primary={data?.primary}
        loading={loading}
        secondary={data.secondary} />
      <Typography>{msg}</Typography>
      {children}
    </>
  );
}

export default Common;

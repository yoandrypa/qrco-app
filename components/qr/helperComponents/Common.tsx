import {ReactNode, useCallback, useContext} from "react";
import Typography from "@mui/material/Typography";
import Context from "../../context/Context";
import RenderQRCommons from "../renderers/RenderQRCommons";

import {DEFAULT_COLORS} from "../constants";

interface CommonProps {
  msg: string;
  children: ReactNode;
}

function Common({ msg, children }: CommonProps) {
  // @ts-ignore
  const { selected, data, setData } = useContext(Context);

  const handleValue = useCallback((prop: string) => (payload: any) => {
    if (payload === undefined) {
      setData((prev: any) => {
        const tempo = {...prev};
        delete tempo[prop];
        return tempo;
      })
    } else if (prop !== 'both') {
      setData((prev: any) => ({ ...prev, [prop]: payload.target?.value !== undefined ? payload.target.value : payload}));
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <RenderQRCommons
        handleValue={handleValue}
        qrName={data?.qrName}
        omitDesign={['web', 'facebook', 'twitter', 'whatsapp'].includes(selected) || !data?.isDynamic}
        omitPrimaryImg={!['vcard+', 'link', 'business', 'social', 'donations'].includes(selected) || !data?.isDynamic}
        backgndImg={data?.backgndImg}
        foregndImg={data?.foregndImg}
        primary={data?.primary}
        secondary={data.secondary} />
      <Typography>{msg}</Typography>
      {children}
    </>
  );
}

export default Common;

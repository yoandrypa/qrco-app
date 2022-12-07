import { ChangeEvent, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import RenderIcon from './helperComponents/smallpieces/RenderIcon';

import Context from '../context/Context';
import SingleData from './renderers/SingleData';
import WhatsAppData from './renderers/WhatsAppData';
import FacebookData from './renderers/FacebookData';
import WifiData from './renderers/WifiData';
import CardData from './renderers/CardData';
import EmailData from './renderers/EmailData';
import SMSData from './renderers/SMSData';
import TwitterData from './renderers/TwitterData';
import AssetData from './renderers/AssetData';
import NotifyDynamic from "./helperComponents/smallpieces/NotifyDynamic";
import BusinessData from "./renderers/BusinessData";
import NetworksData from "./renderers/NetworksData.";
import CouponData from "./renderers/CouponData";
import DonationsData, { DonationsProps } from './renderers/DonationsData';
import CryptoData from './renderers/CryptoData';
import SendMeMoneyData from './renderers/SendMeMoneyData';

import { DataType, SocialProps } from './types/types';
import LinksData from "./renderers/LinksData";
import PleaseWait from "../PleaseWait";
import RenderNoUserWarning from "./helperComponents/smallpieces/RenderNoUserWarning";

type QrContentHandlerProps = {
  data: DataType;
  userInfo: object;
  setData: Function;
  selected?: string | null;
  setIsWrong: (isWrong: boolean) => void;
}

const QrContentHandler = () => { // @ts-ignore
  const { data, setData, selected, setIsWrong, userInfo }: QrContentHandlerProps = useContext(Context);

  const handleValues = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    const value = typeof payload !== 'string' ? payload.target.value : payload;

    if (value.length) {
      setData((prev: DataType) => ({ ...prev, [item]: value })); // @ts-ignore
    } else if (data[item]) {
      setData((prev: DataType) => {
        const temp = { ...prev }; // @ts-ignore
        delete temp[item];
        return temp;
      });
    }
  };

  const handlePayload = (payload: DataType | SocialProps) => {
    setData(payload);
  };

  const renderSel = () => {
    if (!selected) {
      return null;
    }
    switch (selected) {
      case 'web': {
        return (<SingleData
          setIsWrong={setIsWrong}
          label="Website"
          msg="Type in the website to link the QR Code."
          data={data} setData={handlePayload}
        />);
      }
      case 'text': {
        return (<SingleData
          setIsWrong={setIsWrong}
          label="Message"
          limit={300}
          msg="Type any message up to 300 characters."
          data={data} setData={handlePayload}
        />);
      }
      case 'whatsapp': {
        return <WhatsAppData data={data} setData={handlePayload} setIsWrong={setIsWrong} />;
      }
      case 'facebook': {
        return (<FacebookData data={data} setData={handlePayload} setIsWrong={setIsWrong} />);
      }
      case 'wifi': {
        return <WifiData data={data} setData={handlePayload} setIsWrong={setIsWrong} />;
      }
      case 'vcard+':
      case 'vcard': {
        return <CardData data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />;
      }
      case 'link': {
        return <LinksData data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />;
      }
      case 'coupon': {
        return <CouponData data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />;
      }
      case 'business': {
        return <BusinessData data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />;
      }
      case 'email': {
        return <EmailData data={data} setData={handlePayload} setIsWrong={setIsWrong} />;
      }
      case 'sms': {
        return <SMSData data={data} setData={handlePayload} setIsWrong={setIsWrong} />;
      }
      case 'twitter': {
        return <TwitterData data={data} setData={handlePayload} setIsWrong={setIsWrong} />;
      }
      case 'gallery':
      case 'pdf':
      case 'audio':
      case 'video': {
        return <AssetData type={selected} data={data} setData={handlePayload} handleValues={handleValues} />;
      }
      case 'donations': {
        return <DonationsData data={data} setData={(payload: DonationsProps) => setData(payload)} setIsWrong={setIsWrong} />
      }
      case 'paylink': {
        return <SendMeMoneyData data={data} setData={handlePayload} handleValues={handleValues} setIsWrong={setIsWrong} />
      }
      case 'crypto': {
        return <CryptoData data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />
      }
      default: {
        return <NetworksData data={data} setData={handlePayload} setIsWrong={setIsWrong} />
      }
    }
  };

  return (
    <>
      {selected ? (
        <>
          {!Boolean(userInfo) && <Box sx={{ mb: '10px' }}><RenderNoUserWarning /></Box>}
          <Box sx={{ display: 'inline' }}>
            <RenderIcon icon={selected} enabled adjust />
          </Box>
          <Typography sx={{ fontWeight: 'bold', display: 'inline', ml: '5px' }}>{selected?.toUpperCase() || ''}</Typography>
          <Typography sx={{ display: 'inline' }}>: Enter the QR data</Typography>
          {data.isDynamic && <NotifyDynamic />}
          <Divider sx={{ my: '10px' }} />
          <Box sx={{ textAlign: 'left', width: '100%' }}>
            {renderSel()}
          </Box>
        </>
      ) : (
        <PleaseWait redirecting hidePleaseWait />
      )}
    </>
  );
}

export default QrContentHandler;

import {ChangeEvent, useContext} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import RenderIcon from './helperComponents/RenderIcon';

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
import NotifyDynamic from "./helperComponents/NotifyDynamic";
import BusinessData from "./renderers/BusinessData";
import NetworksData from "./renderers/NetworksData.";
import CouponData from "./renderers/CouponData";
import DonationsData, { DonationsProps } from './renderers/DonationsData';

import {DataType, SocialProps} from './types/types';
import LinksData from "./renderers/LinksData";

type QrContentHandlerProps = {
  data: DataType;
  setData: Function;
  selected?: string | null;
  isWrong: boolean;
  setIsWrong: (isWrong: boolean) => void;
}

const QrContentHandler = () => {
  // @ts-ignore
  const { data, setData, selected, isWrong, setIsWrong }: QrContentHandlerProps = useContext(Context);

  const handleValues = (item: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    if (value.length) {
      setData((prev: DataType) => ({...prev, [item]: value}));
      // @ts-ignore
    } else if (data[item]) {
      setData((prev: DataType) => {
        const temp = {...prev};
        // @ts-ignore
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
          isWrong={isWrong}
          setIsWrong={setIsWrong}
          label="Website"
          msg="Type in the website to link the QR Code."
          data={data} setData={handlePayload}
        />);
      }
      case 'text': {
        return (<SingleData
          isWrong={isWrong}
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
        // @ts-ignore
        return (<FacebookData data={data} setData={handlePayload} setIsWrong={setIsWrong} isWrong={isWrong} />);
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
        return <BusinessData data={data} setData={handlePayload} isWrong={isWrong} setIsWrong={setIsWrong} handleValues={handleValues}/>;
      }
      case 'email': {
        return <EmailData data={data} setData={handlePayload} setIsWrong={setIsWrong} />;
      }
      case 'sms': {
        return <SMSData data={data} setData={handlePayload} setIsWrong={setIsWrong} />;
      }
      case 'twitter': {
        return <TwitterData data={data} setData={handlePayload} setIsWrong={setIsWrong}/>;
      }
      case 'image':
      case 'pdf':
      case 'audio':
      case 'video': {
        return <AssetData type={selected} data={data} setData={handlePayload} />;
      }
      case 'donations': {
        return <DonationsData data={data} setData={(payload: DonationsProps) => setData(payload)} setIsWrong={setIsWrong}/>
      }
      default: {
        return <NetworksData data={data} setData={handlePayload} setIsWrong={setIsWrong} />
      }
    }
  };

  return (
    <>
      <Box sx={{ display: 'inline' }}>
        <RenderIcon icon={selected || ''} enabled adjust />
      </Box>
      <Typography sx={{ fontWeight: 'bold', display: 'inline', ml: '5px' }}>{selected?.toUpperCase() || ''}</Typography>
      <Typography sx={{ display: 'inline' }}>: Enter the QR data</Typography>
      {data.isDynamic && <NotifyDynamic />}
      <Divider sx={{ my: '10px' }} />
      <Box sx={{ textAlign: 'left', width: '100%' }}>
        {renderSel()}
      </Box>
    </>
  );
}

export default QrContentHandler;

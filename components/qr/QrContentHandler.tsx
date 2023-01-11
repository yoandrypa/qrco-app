import { ChangeEvent, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RenderIcon from './helperComponents/smallpieces/RenderIcon';
import Context from '../context/Context';
import { DataType, SocialProps } from './types/types';

import dynamic from "next/dynamic";

import NotifyDynamic from "./helperComponents/smallpieces/NotifyDynamic";
import DonationsData, { DonationsProps } from './renderers/DonationsData';
import { qrNameDisplayer } from "../../helpers/qr/helpers";

const Custom = dynamic(() => import("./renderers/Custom"));
const SingleData = dynamic(() => import('./renderers/SingleData'));
const WhatsAppData = dynamic(() => import('./renderers/WhatsAppData'));
const FacebookData = dynamic(() => import('./renderers/FacebookData'));
const WifiData = dynamic(() => import('./renderers/WifiData'));
const CardData = dynamic(() => import('./renderers/CardData'));
const EmailData = dynamic(() => import('./renderers/EmailData'));
const SMSData = dynamic(() => import('./renderers/SMSData'));
const TwitterData = dynamic(() => import('./renderers/TwitterData'));
const AssetData = dynamic(() => import('./renderers/AssetData'));
const BusinessData = dynamic(() => import('./renderers/BusinessData'));
const PetIdData = dynamic(() => import('./renderers/PetIdData'));
const NetworksData = dynamic(() => import('./renderers/NetworksData'));
const CouponData = dynamic(() => import('./renderers/CouponData'));
const CryptoData = dynamic(() => import('./renderers/CryptoData'));
const SendMeMoneyData = dynamic(() => import('./renderers/SendMeMoneyData'));
const FundMe = dynamic(() => import('./renderers/FundMeData'));
const LinksData = dynamic(() => import('./renderers/LinksData'));
const PleaseWait = dynamic(() => import('../PleaseWait'));
const RenderNoUserWarning = dynamic(() => import('./helperComponents/smallpieces/RenderNoUserWarning'));
const LinkedLabelData = dynamic(() => import('./renderers/LinkedLabelData'));

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
      case 'custom': {
        return <Custom data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />;
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
      case 'donation': {
        return <DonationsData data={data} handleValues={handleValues} setData={(payload: DonationsProps) => setData(payload)} setIsWrong={setIsWrong} />
      }
      case 'paylink': {
        return <SendMeMoneyData data={data} setData={handlePayload} handleValues={handleValues} setIsWrong={setIsWrong} />
      }
      case 'crypto': {
        return <CryptoData data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />
      }
      case 'fundme': {
        return <FundMe data={data} setData={setData} handleValues={handleValues} />
      }
      case 'petId': {
        return <PetIdData data={data} handlePayload={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />
      }
      case 'linkedLabel': {
        return <LinkedLabelData data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />
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
          <Typography sx={{ fontWeight: 'bold', display: 'inline', ml: '5px' }}>{qrNameDisplayer(selected || '', data?.isDynamic || false)}</Typography>
          <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>: Enter the content</Typography>
          <NotifyDynamic isDynamic={data?.isDynamic || false} />
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

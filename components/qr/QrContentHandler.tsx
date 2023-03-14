import {ChangeEvent, useContext} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RenderIcon from './helperComponents/smallpieces/RenderIcon';
import Context from '../context/Context';
import {DataType, OptionsType, SocialProps} from './types/types';

import dynamic from "next/dynamic";

import NotifyDynamic from "./helperComponents/smallpieces/NotifyDynamic";
import {qrNameDisplayer} from "../../helpers/qr/helpers";
import {dynamicQr} from "./qrtypes";
import valuesHanlder from "./helperFunction";

const CardDataStatic = dynamic(() => import("./renderers/custom/CardDataStatic"));
const Custom = dynamic(() => import("./renderers/Custom"));
const SingleData = dynamic(() => import('./renderers/SingleData'));
const WhatsAppData = dynamic(() => import('./renderers/WhatsAppData'));
const FacebookData = dynamic(() => import('./renderers/FacebookData'));
const WifiData = dynamic(() => import('./renderers/WifiData'));
const EmailData = dynamic(() => import('./renderers/EmailData'));
const SMSData = dynamic(() => import('./renderers/SMSData'));
const TwitterData = dynamic(() => import('./renderers/TwitterData'));
const CryptoData = dynamic(() => import('./renderers/CryptoData'));
const SendMeMoneyData = dynamic(() => import('./renderers/SendMeMoneyData'));
const FundMe = dynamic(() => import('./renderers/FundMeData'));
const PleaseWait = dynamic(() => import('../PleaseWait'));
const RenderNoUserWarning = dynamic(() => import('./helperComponents/smallpieces/RenderNoUserWarning'));
const DonationsData = dynamic(() => import('./renderers/DonationsData'));

type QrContentHandlerProps = {
  data: DataType;
  userInfo: object;
  options: OptionsType;
  setData: Function;
  selected?: string | null;
  setIsWrong: (isWrong: boolean) => void;
}

const QrContentHandler = () => { // @ts-ignore
  const { data, setData, selected, setIsWrong, userInfo, options }: QrContentHandlerProps = useContext(Context);

  const handleValues = (item: string, index?: number, reversed?: boolean) => (payload: ChangeEvent<HTMLInputElement> | string | boolean | string[]) => {
    valuesHanlder(setData, item, payload, index, reversed);
  };

  const handlePayload = (payload: DataType | SocialProps) => {
    setData(payload);
  };

  const renderSel = () => {
    if (!selected) { return null; }
    switch (selected) {
      case 'web': {
        return <SingleData
          setIsWrong={setIsWrong}
          label="Website"
          msg="Type in the website to link the QR Code."
          data={data} setData={handlePayload} />;
      }
      case 'text': {
        return <SingleData
          setIsWrong={setIsWrong}
          label="Message"
          limit={300}
          msg="Type any message up to 300 characters."
          data={data} setData={handlePayload} />;
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
      case 'vcard': {
        return <CardDataStatic data={data} handleValues={handleValues} setIsWrong={setIsWrong} />;
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
      case 'donation': {
        return <DonationsData data={data} handleValues={handleValues} setData={(payload: DataType) => setData(payload)} setIsWrong={setIsWrong} />
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
      default: { // @ts-ignore
        const item = dynamicQr[selected];
        const handlePredefined = (): string[] | undefined => {
          if (data.custom?.length) { return undefined; }
          return options.mode === undefined ? item.predefined : undefined
        };

        return (
          <Custom data={data} setData={setData} handleValues={handleValues} setIsWrong={setIsWrong} selected={selected}
                  tip={item.tip} predefined={handlePredefined()} />
        );
      }
    }
  };

  return (
    <>
      {selected ? (
        <>
          {!Boolean(userInfo) && <Box sx={{ mb: '10px' }}><RenderNoUserWarning /></Box>}
          {/*<SlideQrTypeSelector />*/}
          <Box sx={{ display: 'inline' }}><RenderIcon icon={selected} enabled adjust /></Box>
          <Typography sx={{ fontWeight: 'bold', display: 'inline', ml: '5px' }}>{qrNameDisplayer(selected || '', data?.isDynamic || false)}</Typography>
          <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>{`: Enter the content${data?.isDynamic ? ' and page design' : ''}`}</Typography>
          <NotifyDynamic isDynamic={data?.isDynamic || false} />
          <Box sx={{ textAlign: 'left', width: '100%' }}>{renderSel()}</Box>
        </>
      ) : (
        <PleaseWait redirecting hidePleaseWait />
      )}
    </>
  );
}

export default QrContentHandler;

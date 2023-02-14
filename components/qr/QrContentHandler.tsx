import { ChangeEvent, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RenderIcon from './helperComponents/smallpieces/RenderIcon';
import Context from '../context/Context';
import { DataType, SocialProps, Type } from './types/types';

import dynamic from "next/dynamic";

import NotifyDynamic from "./helperComponents/smallpieces/NotifyDynamic";
import DonationsData, { DonationsProps } from './renderers/DonationsData';
import { qrNameDisplayer } from "../../helpers/qr/helpers";
import pluralize from "pluralize";
import {FILE_LIMITS} from "../../consts";
import {formatBytes} from "../../utils";

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
const LinkedLabelData = dynamic(() => import('./renderers/LinkedLabelData'));
const InventoryData = dynamic(() => import('./renderers/InventoryData'));

type QrContentHandlerProps = {
  data: DataType;
  userInfo: object;
  setData: Function;
  selected?: string | null;
  setIsWrong: (isWrong: boolean) => void;
}

const QrContentHandler = () => { // @ts-ignore
  const { data, setData, selected, setIsWrong, userInfo }: QrContentHandlerProps = useContext(Context);

  const handleValues = (item: string, index?: number) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    const value = typeof payload === 'string' || typeof payload === 'boolean' ? payload :
      (item === 'includeExtraInfo' ? payload.target.checked : payload.target.value);
    setData((prev: DataType) => {
      const newData = {...prev};
      if (index !== undefined && index !== -1) { // @ts-ignore
        const element = newData.custom[index];
        if (!element.data) { element.data = {}; }
        const elementData = element.data as Type;
        if (item === 'hideHeadLine') {
          if (element.data.hideHeadLine !== undefined && payload === false) {
            delete element.data.hideHeadLine
          } else {
            element.data.hideHeadLine = true;
          }
        } else if (item === 'easiness') {
          if (!elementData.easiness) { elementData.easiness = {}; } // @ts-ignore
          if (!elementData.easiness[payload]) { // @ts-ignore
            elementData.easiness[payload] = true;
          } else { // @ts-ignore
            delete elementData.easiness[payload];
            if (!Object.keys(elementData.easiness).length) { delete elementData.easiness; }
          }
        } else if ((typeof value === "string" && value.length) || payload) {
          if (item === 'includeExtraInfo' && !value && elementData.includeExtraInfo !== undefined) {
            delete elementData.includeExtraInfo;
          } else { // @ts-ignore
            elementData[item] = value;
          } // @ts-ignore
        } else if (elementData[item]) { // @ts-ignore
          delete elementData[item];
        }
      } else {
        if (item === 'easiness') {
          if (!newData.easiness) { newData.easiness = {}; } // @ts-ignore
          if (!newData.easiness[payload]) { // @ts-ignore
            newData.easiness[payload] = true;
          } else { // @ts-ignore
            delete newData.easiness[payload];
            if (!Object.keys(newData.easiness).length) { delete newData.easiness; }
          }
        } else if ((typeof value === "string" && value.length) || payload) { // @ts-ignore
          newData[item] = value;// @ts-ignore
        } else if (data[item]) { // @ts-ignore
          delete newData[item];
        }
      }
      return newData;
    });
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
      case 'custom': {
        return <Custom data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />;
      }
      case 'vcard+':
      case 'vcard': {
        return Boolean(data.isDynamic) ? <Custom
          data={data} setData={setData} handleValues={handleValues} setIsWrong={setIsWrong}
          tip="Your contact details. Users can store your info or contact you right away."
          predefined={['presentation', 'phones', 'organization', 'address', 'email']} /> :
          <CardDataStatic data={data} handleValues={handleValues} setIsWrong={setIsWrong} />;
      }
      case 'link': {
        return <Custom data={data} setData={setData} handleValues={handleValues} setIsWrong={setIsWrong}
          tip="Add at least one link to your websites." predefined={['title', 'links', 'socials']} selected={selected}/>;
      }
      case 'coupon': {
        return <Custom data={data} setData={setData} handleValues={handleValues} setIsWrong={setIsWrong}
          tip="Share a coupon for promotion." predefined={['couponInfo', 'couponData', 'address']} selected={selected}/>;
      }
      case 'business': {
        return <Custom data={data} setData={setData} handleValues={handleValues} setIsWrong={setIsWrong}
          tip="Your business or company details. Users can contact your business or company right away."
          predefined={['company', 'action', 'address', 'opening', 'easiness', 'socials']} selected={selected}/>;
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
        return <Custom data={data} setData={setData} handleValues={handleValues}
          setIsWrong={setIsWrong} predefined={['title', selected]} selected={selected}
          tip={`You can upload a maximum of ${pluralize("file", FILE_LIMITS[selected].totalFiles, true)} of size ${formatBytes(FILE_LIMITS[selected].totalMbPerFile * 1048576)}.`}
        />
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
        return <Custom data={data} setData={setData} handleValues={handleValues} setIsWrong={setIsWrong} tip="Your pet information."
          predefined={['petId', 'presentation', 'phones', 'address', 'keyvalue', 'links', 'socials']} selected={selected}/>;
      }
      case 'linkedLabel': {
        return <LinkedLabelData data={data} setData={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />
      }
      case 'findMe':{
        return <Custom data={data} handleValues={handleValues} setIsWrong={setIsWrong} setData={setData} selected={selected}
          tip="Information to make easy to find you" predefined={['presentation', 'keyvalue', 'links', 'socials']}/>;
      }
      case 'inventory': {
        // return <InventoryData data={data} handlePayload={handlePayload} setIsWrong={setIsWrong} handleValues={handleValues} />
        return <Custom data={data} handleValues={handleValues} setIsWrong={setIsWrong} selected={selected} setData={setData}
           tip="Inventory tracking information" predefined={['title', 'gallery', 'sku', 'keyvalue']}/>;
      }
      default: {
        return <Custom data={data} setData={setData} handleValues={handleValues} setIsWrong={setIsWrong} selected={selected}
          tip="Your social networks. Users can reach you using the social networks." predefined={['title', 'socials']}/>
      }
    }
  };

  return (
    <>
      {selected ? (
        <>
          {!Boolean(userInfo) && <Box sx={{ mb: '10px' }}><RenderNoUserWarning /></Box>}
          <Box sx={{ display: 'inline' }}><RenderIcon icon={selected} enabled adjust /></Box>
          <Typography sx={{ fontWeight: 'bold', display: 'inline', ml: '5px' }}>{qrNameDisplayer(selected || '', data?.isDynamic || false)}</Typography>
          <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>: Enter the content</Typography>
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

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { QrDataModel } from "../../models/qr/QrDataModel";

import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import DangerousIcon from '@mui/icons-material/Dangerous';
import EngineeringIcon from '@mui/icons-material/Engineering';

import VCard from "../../components/qr/microsites/VCard";
import Web from "../../components/qr/microsites/Web";
import Business from "../../components/qr/microsites/Business";
import Coupons from "../../components/qr/microsites/Coupons";
import SocialInfo from "../../components/qr/microsites/SocialInfo";
import FileMicro from "../../components/qr/microsites/FileMicro";
import Images from "../../components/qr/microsites/Images";
import Donations from "../../components/qr/microsites/Donations"
import LinksMicro from "../../components/qr/microsites/LinksMicro";
import {generateShortLink} from "../../utils";
import {handleDesignerString} from "../../helpers/qr/helpers";

// @ts-ignore
export default function Handler({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (data === "NO DATA") {
    return (
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <DangerousIcon color="error" sx={{mx: 'auto', fontSize: '50px'}}/>
          <Typography>{'Ops! Something went wrong and we are unable to process your request at this time.'}</Typography>
          <Typography sx={{color: theme => theme.palette.text.disabled, mx: 'auto'}}>
            {'Please, contact support by clicking '}
            <a target="_blank" href="mailto:info@ebanux.com" rel="noopener noreferrer" style={{color: 'royalblue'}}>{'here'}</a>
            {'.'}
          </Typography>
        </Box>
      </Box>
    );
  }

  const newData = JSON.parse(data);

  if (newData.qrType === "vcard+") {
    return (<VCard newData={newData} />);
  }

  if (newData.qrType === "image") {
    return (<Images newData={newData} />);
  }

  if (newData.qrType === 'business') {
    return (<Business newData={newData} />);
  }

  if (newData.qrType === 'coupon') {
    return (<Coupons newData={newData} />);
  }

  if (newData.qrType === 'social') {
    return (<SocialInfo newData={newData} />);
  }

  if (['web', 'twitter', 'whatsapp', 'facebook'].includes(newData.qrType)) {
    return (<Web urlString={handleDesignerString(newData.qrType, newData)}/>);
  }

  if (['pdf', 'audio', 'video'].includes(newData.qrType)) {
    return (<FileMicro newData={newData} />);
  }

  if (newData.qrType === 'donations') {
    return (<Donations newData={newData} />);
  }

  if (newData.qrType === 'link') {
    return (<LinksMicro newData={newData} />);
  }

  return (
    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <EngineeringIcon color="primary" sx={{mx: 'auto', fontSize: '50px'}}/>
        <Typography sx={{mx: 'auto'}}>{'Work in progress.'}</Typography>
        <Typography sx={{color: theme => theme.palette.text.disabled, mx: 'auto'}}>{'This is going to be ready very soon.'}</Typography>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // @ts-ignore
  const {code } = params;
  const data = await QrDataModel.get({ id: code });
  if (!data) {
    return { props: { data: "NO DATA" } };
  }

  const sl = await data.populate({properties: 'shortLinkId'});

  if (!sl) {
    return { props: { data: JSON.stringify(data) } };
  }

  // @ts-ignore
  return { props: { data: JSON.stringify({...data, shortlinkurl: generateShortLink(sl.shortLinkId.address, sl.domain || process.env.REACT_APP_SHORT_URL_DOMAIN) }) } };
};

import { useContext, useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import Context from "../../context/Context";
import { DataType } from "../types/types";

import dynamic from "next/dynamic";

import { IS_DEV_ENV, ONLY_QR } from "../constants";
import RenderProDesc from "./smallpieces/RenderProDesc";
import RenderFreeDesc from "./smallpieces/RenderFreeDesc";
import RenderSamplePreview from "./smallpieces/RenderSamplePreview";
import TypeSelector from "./TypeSelector";
import { MyBadge } from "./looseComps/StyledComponents";
import { areEquals } from "../../helpers/generalFunctions";
import initialOptions, { initialData } from "../../../helpers/qr/data";
import { dynamicQrTypes, staticQrTypes } from "../qrtypes";
import { IQrSetting } from "../components/commons/types";


const RenderMode = dynamic(() => import("./looseComps/RenderMode"));
const RenderClaimingInfo = dynamic(() => import("./smallpieces/RenderClaimingInfo"));
const RenderLoseDataConfirm = dynamic(() => import('./smallpieces/RenderLoseDataConfirm'));
const RenderPreviewDrawer = dynamic(() => import('./smallpieces/RenderPreviewDrawer'));
const RenderPreviewButton = dynamic(() => import('./smallpieces/RenderPreviewButton'));

interface RenderTypeSelectorProps {
  selected?: string | null;
  handleSelect: (payload: string) => void;
  isLogged: boolean;
}

interface ContextData {
  data: DataType;
  setData: (vale: DataType) => void;
}

const RenderTypeSelector = ({selected, handleSelect}: RenderTypeSelectorProps) => { // @ts-ignore
  const {options, data, setData}: ContextData = useContext(Context);

  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [displayConfirm, setDisplayConfirm] = useState<{select: number} | null>(null);

  const isWide = useMediaQuery("(min-width:600px)", {noSsr: true});
  const isWideForPreview = useMediaQuery("(min-width:925px)", {noSsr: true});
  const isWideForThreeColumns = useMediaQuery("(min-width:1045px)", {noSsr: true});

  const isDynamic = useMemo(() => data.isDynamic || false, [data.isDynamic]);

  const proceed = (selection: number) => {
    const dynamic = selection === 0;
    if (dynamic) { // @ts-ignore
      setData((prev: DataType) => ({...prev, isDynamic: dynamic}));
    } else if (data.isDynamic !== undefined) { // @ts-ignore
      setData((prev: DataType) => {
        const tempoData = {...prev};
        delete tempoData.isDynamic;
        return tempoData;
      });
    }
  }

  const handleClick = (selection: number) => {
    if (data?.isDynamic) {
      const compareWith = {...initialOptions, data: options.data}; // @ts-ignore
      if (options.id) { compareWith.id = options.id; } // @ts-ignore
      if (options.shortCode) { compareWith.shortCode = options.shortCode; }

      const dataComp = structuredClone(data);
      const initialDataCpy = structuredClone(initialData) as any;

      if (initialDataCpy.isDynamic !== undefined) {
        dataComp.isDynamic = initialDataCpy.isDynamic;
      }

      if (dataComp.claim !== undefined) { // @ts-ignore
        originalData.claim = dataComp.claim;
      }

      if (dataComp.claimable !== undefined) { // @ts-ignore
        originalData.claimable = dataComp.claimable;
      }

      if (dataComp.preGenerated !== undefined) { // @ts-ignore
        originalData.preGenerated = dataComp.preGenerated;
      }

      // if (dataComp.custom?.length && !dataComp.custom.some(x => Object.keys(x.data || {}).length)) {
      //   initialDataCpy.custom = dataComp.custom;
      // }

      if (!areEquals(dataComp, initialDataCpy) || !areEquals(options, compareWith)) {
        setDisplayConfirm({select: selection});
      } else {
        proceed(selection);
      }
    } else if (Object.keys(data || {}).length > 0) {
      setDisplayConfirm({select: selection});
    } else {
      proceed(selection);
    }
  };

  const renderTypeSelector = (typeId: string, qrType: IQrSetting<any>, enabled: boolean) => {
    qrType.id ??= typeId;  // Set id in legacy qr-types

    return (
      <Grid id={`card${typeId}`} item
            lg={!selected ? 3 : isWideForThreeColumns ? 4 : 6}
            md={!selected ? 4 : (isWideForThreeColumns ? 4 : 6)} sm={6} xs={12}>
        <TypeSelector isDynamic={isDynamic} enabled={enabled} qrType={qrType} selected={selected === typeId}
          handleSelect={handleSelect} />
      </Grid>
    );
  };

  const renderTypes = (items: object) => {
    const keys = Object.keys(items);
    return keys.map((x: string) => { // @ts-ignore
      const qrType = items[x];
      if (IS_DEV_ENV || !qrType.devOnly) return renderTypeSelector(qrType.id || x, qrType, true);
      return null;
    })
  };

  useEffect(() => {
    if (isWideForPreview && openPreview) {
      setOpenPreview(false);
    }
  }, [isWideForPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{display: 'flex'}}>
      <Grid container spacing={1} sx={{height: 'fit-content'}}>
        <Grid item xs={12}>
          <Box sx={{width: '100%', position: 'relative'}}>
            <Tabs value={isDynamic ? 0 : 1} onChange={(_, newSel: number) => handleClick(newSel)}>
              <Tab sx={{pr: '37px', mr: '3px'}} label={
                <MyBadge badgeContent={
                  <Tooltip title={<RenderProDesc/>} arrow>
                    <span>Pro</span>
                  </Tooltip>
                } color="primary" pro>
                  <Typography>{isWide ? "Dynamic QR Codes" : "Dynamic"}</Typography>
                </MyBadge>
              }/>
              <Tab sx={{pr: '39px'}} disabled={data.claim !== undefined} label={
                <MyBadge badgeContent={
                  <Tooltip title={<RenderFreeDesc />} arrow>
                    <span>Free</span>
                  </Tooltip>} color="success" disabled={data.claim !== undefined}>
                  <Typography>{isWide ? "Static QR Codes" : "Static"}</Typography>
                </MyBadge>
              }/>
            </Tabs>
            {data.claim !== undefined && (<Box sx={{position: 'absolute', textAlign: 'center', top: '7px', right: 0}}>
              <RenderClaimingInfo claim={data.claim} />
            </Box>)}
            {data.mode && <RenderMode isWide={isWide} sx={{top: '17px'}} mode={data.mode} />}
          </Box>
        </Grid>
        {renderTypes(isDynamic ? dynamicQrTypes : staticQrTypes)}
      </Grid>
      {isWideForPreview && selected && (
        <RenderSamplePreview selected={selected} style={{ml: '15px', mt: '56px', width: '287px', position: 'sticky', top: '120px'}}
                             isDynamic={data.isDynamic || false} onlyQr={ONLY_QR.includes(selected) || !data.isDynamic}
                             showSampleMessage step={0} />
      )}
      {!openPreview && !isWideForPreview && selected && ( // @ts-ignore
        <RenderPreviewButton setOpenPreview={setOpenPreview} message="Sample"/>
      )}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer setOpenPreview={setOpenPreview} border={35} height={!data.isDynamic ? 425 : 700} > {/* @ts-ignore */}
          <RenderSamplePreview onlyQr={[...ONLY_QR, 'web'].includes(selected) || !data.isDynamic} selected={selected}
                               isDrawed style={{mt: '-15px'}} step={0} isDynamic={data.isDynamic || false} showSampleMessage />
        </RenderPreviewDrawer>
      )}
      {displayConfirm && (
        <RenderLoseDataConfirm
          handleOk={() => { proceed(displayConfirm.select); setDisplayConfirm(null); }}
          handleCancel={() => setDisplayConfirm(null)} />
      )}
    </Box>
  );
};

export default RenderTypeSelector;

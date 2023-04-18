import {useContext, useState} from 'react';

import Context from '../context/Context';
import RenderTypeSelector from "./helperComponents/RenderTypeSelector";
import {areEquals} from "../helpers/generalFunctions";
import initialOptions, {initialData} from "../../helpers/qr/data";
import {DataType, OptionsType} from "./types/types";

import dynamic from "next/dynamic";
const RenderLoseDataConfirm = dynamic(() => import("./helperComponents/smallpieces/RenderLoseDataConfirm"));

interface QrTypeSelectorProps {
  setSelected: Function;
  selected?: string | null;
  userInfo: string;
  options: OptionsType;
  data: DataType;
}

const QrTypeSelector = () => { // @ts-ignore
  const {data, options, setSelected, selected, userInfo}: QrTypeSelectorProps = useContext(Context);
  const [displayConfirm, setDisplayConfirm] = useState<string | null>(null);

  const proceedWithSelection = (payload: string): void => {
    if (selected !== payload) {
      setSelected(payload);
    }
  };

  const handleOk = () => {
    proceedWithSelection(displayConfirm || '');
    setDisplayConfirm(null);
  };

  const handleSelect = (payload: string): void => {
    if (data?.isDynamic) {
      const compareWith = {...initialOptions, data: options.data}; // @ts-ignore
      if (options.id) { compareWith.id = options.id; } // @ts-ignore
      if (options.shortCode) { compareWith.shortCode = options.shortCode; }

      const dataComp = structuredClone(data);
      const originalData = structuredClone(initialData) as any;

      if (originalData.isDynamic !== undefined) {
        dataComp.isDynamic = originalData.isDynamic;
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
      //   originalData.custom = dataComp.custom;
      // }

      if (!areEquals(dataComp, originalData) || !areEquals(options, compareWith)) {
        setDisplayConfirm(payload);
      } else {
        proceedWithSelection(payload);
      }
    } else if (Object.keys(data || {}).length > 0) {
      setDisplayConfirm(payload);
    } else {
      proceedWithSelection(payload);
    }
  };

  return (
    <>
      <RenderTypeSelector selected={selected} handleSelect={handleSelect} isLogged={Boolean(userInfo)}/>
      {displayConfirm !== null && (
        <RenderLoseDataConfirm handleOk={handleOk} handleCancel={() => setDisplayConfirm(null)} />
      )}
    </>
  );
}

export default QrTypeSelector;

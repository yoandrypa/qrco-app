import {useContext, useState} from 'react';

import Context from '../context/Context';
import RenderTypeSelector from "./helperComponents/RenderTypeSelector";
import {areEquals} from "../helpers/generalFunctions";
import initialOptions from "../../helpers/qr/data";
import {OptionsType} from "./types/types";

import dynamic from "next/dynamic";
const RenderLoseDataConfirm = dynamic(() => import("./helperComponents/smallpieces/RenderLoseDataConfirm"));

interface QrTypeSelectorProps {
  setSelected: Function;
  selected?: string | null;
  userInfo: string;
  options: OptionsType;
}

const QrTypeSelector = () => { // @ts-ignore
  const {options, setSelected, selected, userInfo}: QrTypeSelectorProps = useContext(Context);
  const [displayConfirm, setDisplayConfirm] = useState<string | null>(null);

  const proceedWithSelection = (payload: string): void => {
    setSelected((prev: string) => prev === payload ? null : payload);
  };

  const handleOk = () => {
    proceedWithSelection(displayConfirm || '');
    setDisplayConfirm(null);
  };

  const handleSelect = (payload: string): void => {
    const compareWith = {...initialOptions, data: options.data}; // @ts-ignore
    if (options.id) {compareWith.id = options.id;} // @ts-ignore
    if (options.shortCode) {compareWith.shortCode = options.shortCode;}
    if (!areEquals(options, compareWith)) {
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

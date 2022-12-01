import {useContext} from 'react';

import Context from '../context/Context';
import RenderTypeSelector from "./helperComponents/RenderTypeSelector";

interface QrTypeSelectorProps {
  setSelected: Function;
  selected?: string | null;
  userInfo: string;
}

const QrTypeSelector = () => {
  // @ts-ignore
  const {setSelected, selected, userInfo}: QrTypeSelectorProps = useContext(Context);

  const handleSelect = (payload: string): void => {
    setSelected((prev: string) => prev === payload ? null : payload);
  };

  return (
    <RenderTypeSelector selected={selected} handleSelect={handleSelect} isLogged={Boolean(userInfo)}/>
  );
}

export default QrTypeSelector;

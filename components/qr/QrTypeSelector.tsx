import {useContext, useMemo} from 'react';

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

  const isLogged = useMemo(() => Boolean(userInfo), [userInfo]);

  return (
    <RenderTypeSelector selected={selected} handleSelect={handleSelect} isLogged={isLogged}/>
  );
}

export default QrTypeSelector;

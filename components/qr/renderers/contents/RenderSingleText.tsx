import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";

interface SingleTextProps {
  text: string;
  index: number;
  handleValues: Function;
}

export default function RenderSingleText({text, handleValues, index}: SingleTextProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  };

  return <RenderTextFields item="text" label="" value={text} handleValues={beforeSend} multiline index={index} />;
}

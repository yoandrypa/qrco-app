import {ChangeEvent} from "react";
import TextField from "@mui/material/TextField";
import Common from "../helperComponents/Common";
import {isValidUrl} from "../../../utils";

type FacebookDataProps = {
  data: { message: string; };
  setData: Function;
  isWrong: boolean;
  setIsWrong: (isWrong: boolean) => void;
};

function FacebookData({ isWrong, setIsWrong, data, setData }: FacebookDataProps) {
  const handleValues = (item: 'message') => (event: ChangeEvent<HTMLInputElement>) => {
    let wrong = false;
    const { value } = event.target;
    const tempo = { ...data };
    if (value.length) {
      tempo[item] = value;
      if (!isValidUrl(value)) {
        wrong = true;
      }
    } else if (tempo[item]) {
      // @ts-ignore
      delete tempo[item];
      wrong = true;
    }
    setIsWrong(wrong);
    setData(tempo);
  };

  return (
    <Common msg="URL to be shared in your wall.">
      <TextField
        rows={3}
        multiline={true}
        label="Post"
        size="small"
        fullWidth
        margin="dense"
        error={isWrong}
        value={data?.message || ''}
        onChange={handleValues('message')} />
    </Common>
  );
}

export default FacebookData;

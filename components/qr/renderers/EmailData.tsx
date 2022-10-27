import {ChangeEvent, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Common from '../helperComponents/Common';
import MultiLineDetails from '../helperComponents/MultiLineDetails';
import {EMAIL} from "../constants";

type EmailDataProps = {
  data: {
    email?: string;
    subject?: string;
    body?: string;
  };
  setData: Function;
  setIsWrong: (isWrong: boolean) => void;
};

export default function EmailData({ data, setData, setIsWrong }: EmailDataProps) {
  const handleValues = (item: 'email' | 'subject' | 'body') => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const tempo = { ...data };
    if (value.length) {
      tempo[item] = item === 'subject' ? value.slice(0, 50) : item === 'body' ? value.slice(0, 200) : value;
    } else if (tempo[item]) {
      delete tempo[item];
    }
    setData(tempo);
  };

  useEffect(() => {
    let isWrong = false;
    if ((!data.email?.trim().length || !EMAIL.test(data.email)) || (!data.subject?.trim().length && !data.body?.trim().length)) {
      isWrong = true;
    }
    setIsWrong(isWrong);
  }, [data.email, data.subject, data.body]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="You can send emails in the addresss you provide. Also you can enter a short subject and a message up to 200 characters.">
      <>
        <TextField
          label="Email"
          size="small"
          fullWidth
          required
          margin="dense"
          value={data?.email || ''}
          // @ts-ignore
          error={data?.email && !EMAIL.test(data.email)}
          onChange={handleValues('email')} />
        <TextField
          label="Subject"
          size="small"
          fullWidth
          margin="dense"
          value={data?.subject || ''}
          onChange={handleValues('subject')} />
        <MultiLineDetails top={50} data={data?.subject || ''} />
        <TextField
          rows={3}
          multiline={true}
          label="Body"
          size="small"
          fullWidth
          margin="dense"
          value={data?.body || ''}
          onChange={handleValues('body')} />
        <MultiLineDetails top={200} data={data?.body || ''} />
      </>
    </Common>);
};

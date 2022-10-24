import { useEffect } from 'react';
import PleaseWait from '../../PleaseWait';

interface WebProps {
  urlString: string;
}

export default function Web({urlString}: WebProps) {
  useEffect(() => {
    window.location.replace(urlString);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PleaseWait redirecting />
  );
}

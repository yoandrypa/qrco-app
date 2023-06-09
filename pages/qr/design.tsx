import Generator from '../../components/qr/Generator';
import QrWizard from "../../components/qr/QrWizard";
import {useContext, useEffect} from "react";
import Context from "../../components/context/Context";
import {useRouter} from "next/router";
import {handleVerifier} from "../../handlers/helpers";

export default function QrDesigner() { // @ts-ignore
  const {selected, data, userInfo, setLoading} = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (data.mode !== 'secret') {
      handleVerifier(router, data?.isDynamic || false, Boolean(userInfo), selected, setLoading);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QrWizard>
      <Generator/>
    </QrWizard>
  );
};

import QrContentHandler from "../../components/qr/QrContentHandler";
import QrWizard from "../../components/qr/QrWizard";
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import Context from "../../components/context/Context";
import {handleVerifier} from "../../handlers/helpers";

export default function QrContent() { // @ts-ignore
  const {step, setStep, selected, data, userInfo, setLoading} = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    handleVerifier(router, data?.isDynamic || false, Boolean(userInfo), selected, setLoading, setStep, step, 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QrWizard>
      <QrContentHandler/>
    </QrWizard>
  );
};

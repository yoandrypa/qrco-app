import QrTypeSelector from '../../components/qr/QrTypeSelector';
import QrWizard from '../../components/qr/QrWizard';
import {useContext, useEffect} from "react";
import Context from "../../components/context/Context";
import {useRouter} from "next/router";

export default function QrGen() { // @ts-ignore
  const { options, clearData, userInfo, step, setStep, selected } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (step !== 0 && selected) {
      setStep(0);
    } else if (options?.mode !== "edit" && router.query.mode !== "edit") {
      if (step === 2) {
        clearData(true, userInfo !== undefined || undefined, true);
      } else if (!router.query.login && step !== 0) {
        setStep(0);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QrWizard>
      <QrTypeSelector/>
    </QrWizard>
  );
};

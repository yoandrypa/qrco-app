import QrContentHandler from "../../components/qr/QrContentHandler";
import QrWizard from "../../components/qr/QrWizard";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Context from "../../components/context/Context";
import { handleVerifier } from "../../handlers/helpers";

export default function QrContent () {
  // @ts-ignore
  const { setStep, setSelected, data, userInfo, setLoading } = useContext(
    Context);
  // @ts-ignore
  let { step, selected } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (!selected) {
      selected = router.query.selected;
      setSelected(selected);
    }
    handleVerifier(router, data?.isDynamic || false, Boolean(userInfo),
      selected, setLoading, setStep, step || 0, 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QrWizard>
      <QrContentHandler/>
    </QrWizard>
  );
};

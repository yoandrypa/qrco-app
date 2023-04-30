import QrContentHandler from "../../components/qr/QrContentHandler";
import QrWizard from "../../components/qr/QrWizard";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Context from "../../components/context/Context";
import { handleVerifier } from "../../handlers/helpers";

export default function QrContent () {
  // @ts-ignore
  const { doNotClear, setSelected, data, userInfo, setLoading } = useContext(Context);
  // @ts-ignore
  let { selected } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (!selected) {
      doNotClear();
      selected = router.query.selected; // eslint-disable-line react-hooks/exhaustive-deps
      setSelected(selected);
    }
    if (data.mode !== 'secret') {
      handleVerifier(router, data?.isDynamic || false, Boolean(userInfo), selected, setLoading);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QrWizard>
      <QrContentHandler/>
    </QrWizard>
  );
};

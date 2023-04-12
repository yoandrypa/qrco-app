import {MouseEvent, useCallback, useState} from "react";
import LinkIcon from "@mui/icons-material/Link";

import dynamic from "next/dynamic";
const EditCustomLinkCode = dynamic(() => import("./EditCustomLinkCode"));

interface LinkItemProps {
  step: number;
  code: string;
}

export default function RenderLinkItem({step, code}: LinkItemProps) {
  const [anchor, setAnchor] = useState<undefined | HTMLElement>(undefined);

  const handleEdit = useCallback((event: MouseEvent<HTMLElement>) => {
    if (step === 1) { setAnchor(event.currentTarget); }
  }, [step]);

  const renderIcon = useCallback((cursor: boolean) => (
    <LinkIcon sx={{
      color: theme => theme.palette.primary.dark,
      mt: '12px', mr: '-7px', cursor: cursor ? 'pointer' : 'inherit',
      '&:hover': cursor ? {background: '#f5f5f5', borderRadius: '50%'} : undefined
    }} />
  ), []);

  return (
    <>
      {step === 1 ? <div onClick={handleEdit}>{renderIcon(true)}</div> : renderIcon(false)}
      {anchor && <EditCustomLinkCode setAnchor={setAnchor} anchor={anchor} current={code} />}
    </>
  );
}

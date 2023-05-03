import {memo, useCallback} from "react";
import LinkIcon from "@mui/icons-material/Link";
import Box from "@mui/material/Box";
// import EditIcon from '@mui/icons-material/Edit';
import RenderIcon from "./RenderIcon";

// import dynamic from "next/dynamic";
// import IconButton from "@mui/material/IconButton";

// const EditCustomLinkCode = dynamic(() => import("./EditCustomLinkCode"));

interface LinkItemProps {
  // step: number;
  // code: string;
  // selected: string;
  onlyQr: boolean;
  urlData: string;
}

// function RenderLinkItem({step, code, onlyQr, selected, urlData}: LinkItemProps) {
function RenderLinkItem({onlyQr, urlData}: LinkItemProps) {
  // const [anchor, setAnchor] = useState<undefined | HTMLElement>(undefined);

  // const handleEdit = useCallback((event: MouseEvent<HTMLElement>) => {
  //   if (step === 1) { setAnchor(event.currentTarget); }
  // }, [step]);

  const renderIcon = useCallback((cursor: boolean) => (
    <LinkIcon sx={{
      color: theme => theme.palette.primary.dark,
      mt: '12px', mr: '-7px', cursor: cursor ? 'pointer' : 'inherit',
      '&:hover': cursor ? {background: '#f5f5f5', borderRadius: '50%'} : undefined
    }} />
  ), []);

  const renderUrlData = () => {
    const index = urlData.lastIndexOf('/') + 1;
    return (
      <Box sx={{display: 'flex', width: !onlyQr ? '190px' : '200px', justifyContent: 'space-between'}}>
        <Box sx={{
          mt: '14px', ml: !onlyQr ? '10px' : 0, fontSize: '13px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: 'rtl', textAlign: 'left'
        }}>
          <span>{!onlyQr ? urlData.slice(0, index) : urlData}</span>
          {!onlyQr && <span style={{color: '#2196f3'}}>{urlData.slice(index)}</span>}
        </Box>
        {/*{!onlyQr && step === 1 && (*/}
        {/*  <IconButton size="small" sx={{height: '28px', width: '28px', mt: '9px', mr: '-5px'}} onClick={handleEdit}>*/}
        {/*    <EditIcon fontSize="small"/>*/}
        {/*  </IconButton>*/}
        {/*)}*/}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', width: !onlyQr ? '208px' : '231px' }}>
      {/*{!onlyQr ? (
        <>
          {step === 1 ? <div onClick={handleEdit}>{renderIcon(true)}</div> : renderIcon(false)}
          {anchor && <EditCustomLinkCode setAnchor={setAnchor} anchor={anchor} current={code}/>}
        </>
      ) : <Box sx={{mt: '12px', mr: '5px'}}><RenderIcon icon={selected || ''} enabled/></Box>}*/}
      {renderUrlData()}
    </Box>
  );
}

export default memo(RenderLinkItem);

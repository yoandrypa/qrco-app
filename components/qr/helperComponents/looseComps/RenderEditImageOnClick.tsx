import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import {memo} from "react";

interface Props {
  left?: boolean,
  shape?: string,
  handleEdit?: (prop: string) => void;
}

const RenderEditImageOnClick = ({left, shape, handleEdit}: Props) => {
  const handler = (prop: string) => () => {
    if (handleEdit) {
      handleEdit(prop);
    }
  }

  return (
    <>
      <Tooltip title="Edit banner image" followCursor>
        <Box sx={{
          position: 'absolute', width: '256px', height: '108px', borderRadius: '16px 16px 0 0', cursor: 'pointer'
        }}
        onClick={handler('banner')} />
      </Tooltip>
      <Tooltip title="Edit main image" followCursor>
        <Box sx={{
          position: 'absolute',
          width: '54px',
          height: '54px',
          cursor: 'pointer',
          borderRadius: !shape || shape === 'circle' ? '50%' : shape === 'smooth' ? '12px' : '2px',
          top: '81px',
          left: !left ? '100px' : '11px'
        }}
        onClick={handler('profile')} />
      </Tooltip>
    </>
  );
}

export default memo(RenderEditImageOnClick, (current: Props, next: Props) => current.left === next.left && current.shape === next.shape);

import {memo} from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import IconButton from "@mui/material/IconButton";
import {styled} from "@mui/material/styles";

interface Props {
  left?: boolean,
  shape?: string,
  handleEdit?: (prop: string) => void;
  renderFloating?: boolean;
}

export const Icon = styled(IconButton)(() => ({
  position: 'absolute',
  width: '24px',
  height: '24px',
  background: '#eef1f563',
  '&:hover': {background: '#eef1f5c7'}
}));

const RenderEditImageOnClick = ({left, shape, handleEdit, renderFloating}: Props) => {
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
        onClick={handler('banner')}>
          <Icon sx={{right: '5px', top: '3px'}} onClick={handler('banner')}>
            <EditIcon fontSize="small" />
          </Icon>
        </Box>
      </Tooltip>
      <Tooltip title="Edit profile image" followCursor>
        <Box sx={{
          position: 'absolute',
          width: '54px',
          height: '54px',
          cursor: 'pointer',
          background: renderFloating ? '#0a3e6c6e' : 'unset',
          borderRadius: !shape || shape === 'circle' ? '50%' : shape === 'smooth' ? '12px' : '2px',
          top: '81px',
          left: !left ? '100px' : '11px'
        }}
        onClick={handler('profile')}>
          <Icon sx={{right: '-7px', top: '-5px'}} onClick={handler('profile')}>
            <PhotoCameraIcon fontSize="small" />
          </Icon>
        </Box>
      </Tooltip>
    </>
  );
}

export default memo(RenderEditImageOnClick, (current: Props, next: Props) =>
  current.left === next.left && current.shape === next.shape && current.renderFloating === next.renderFloating
);

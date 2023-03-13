import {memo} from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import IconButton from "@mui/material/IconButton";
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {styled} from "@mui/material/styles";

interface Props {
  left?: boolean,
  shape?: string,
  hideBannerSelection?: boolean,
  handleEdit?: (prop: string) => void;
  renderFloating?: boolean;
  pos?: string;
  size?: string;
}

export const Icon = styled(IconButton)(() => ({
  position: 'absolute',
  width: '24px',
  height: '24px',
  background: '#eef1f563',
  '&:hover': {background: '#eef1f5c7'}
}));

const RenderEditImageOnClick = ({left, shape, handleEdit, renderFloating, hideBannerSelection, pos, size}: Props) => {
  const handler = (prop: string) => () => {
    if (handleEdit) {
      handleEdit(prop);
    }
  }

  const renderProfile = () => {
    let top: string;

    let imgSize = '54px';

    if (size === 'small') {
      top = !pos || pos === 'default' ? '0px' : (pos === 'upper' ? '-18px' : '-75px');
      imgSize = '45px';
    } else if (size === 'medium') {
      top = !pos || pos === 'default' ? '-10px' : (pos === 'upper' ? '-45px' : '-75px');
      imgSize = '60px';
    } else if (size === 'large') {
      top = !pos || pos === 'default' ? '-20px' : (pos === 'upper' ? '-65px' : '-75px');
      imgSize = '70px';
    } else {
      top = !pos || pos === 'default' ? 'unset' : (pos === 'upper' ? '-30px' : '-75px');
    }

    return (
      <Box sx={{
        position: 'absolute',
        width: imgSize,
        height: imgSize,
        background: renderFloating ? '#0a3e6c6e' : 'unset',
        borderRadius: !shape || shape === 'circle' ? '50%' : shape === 'smooth' ? '12px' : '2px',
        top: '81px',
        left: !left ? '100px' : '11px'
      }}>
        <Tooltip title="Edit profile image" followCursor>
          <Icon sx={{right: '-7px', top}} onClick={handler('profile')}>
            <PhotoCameraIcon fontSize="small" />
          </Icon>
        </Tooltip>
      </Box>
    );
  }

  return (
    <>
      {!hideBannerSelection && (<Tooltip title="Edit banner image" followCursor>
        <Icon sx={{right: '5px', top: '5px', position: 'absolute'}} onClick={handler('banner')}>
          <EditIcon fontSize="small" />
        </Icon>
      </Tooltip>)}
      <Tooltip title="Edit background image" followCursor>
        <Icon sx={{left: '5px', top: '5px', position: 'absolute'}} onClick={handler('background')}>
          <WallpaperIcon fontSize="small" />
        </Icon>
      </Tooltip>
      {renderProfile()}
    </>
  );
}

export default memo(RenderEditImageOnClick, (current: Props, next: Props) =>
  current.left === next.left && current.shape === next.shape && current.renderFloating === next.renderFloating &&
  current.hideBannerSelection === next.hideBannerSelection && current.pos === next.pos &&
  current.size === next.size
);

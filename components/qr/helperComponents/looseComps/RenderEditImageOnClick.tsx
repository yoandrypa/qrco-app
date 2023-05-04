import {memo} from "react";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import IconButton from "@mui/material/IconButton";
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {styled} from "@mui/material/styles";

interface Props {
  hideBannerSelection?: boolean;
  hideBannerAndProfile?: boolean;
  handleEdit?: (prop: string) => void;
}

export const Icon = styled(IconButton)(() => ({
  position: 'absolute',
  width: '24px',
  height: '24px',
  background: '#eef1f563',
  '&:hover': {background: '#eef1f5c7'}
}));

const RenderEditImageOnClick = ({handleEdit, hideBannerSelection, hideBannerAndProfile}: Props) => {
  const handler = (prop: string) => () => {
    if (handleEdit) {
      handleEdit(prop);
    }
  }

  return (
    <>
      {!hideBannerSelection && !hideBannerAndProfile && (<Tooltip title="Edit banner image" followCursor>
        <Icon sx={{right: '5px', top: '5px', position: 'absolute'}} onClick={handler('banner')}>
          <EditIcon fontSize="small" />
        </Icon>
      </Tooltip>)}
      <Tooltip title="Edit background image" followCursor>
        <Icon sx={{left: '5px', top: '5px', position: 'absolute'}} onClick={handler('background')}>
          <WallpaperIcon fontSize="small" />
        </Icon>
      </Tooltip>
      {!hideBannerAndProfile && (<Tooltip title="Edit profile image" followCursor>
        <Icon sx={{right: '5px', top: !hideBannerSelection ? '32px' : '5px'}} onClick={handler('profile')}>
          <PhotoCameraIcon fontSize="small"/>
        </Icon>
      </Tooltip>)}
    </>
  );
}

export default memo(RenderEditImageOnClick, (current: Props, next: Props) =>
  current.hideBannerSelection === next.hideBannerSelection && current.hideBannerAndProfile === next.hideBannerAndProfile
);

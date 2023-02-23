import Box from "@mui/material/Box";
import {dynamicQrTypes} from "../../qrtypes";
import RenderIcon from "../smallpieces/RenderIcon";
import {grey} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import {qrNameDisplayer} from "../../../../helpers/qr/helpers";

const SlideQrTypeSelector = () => {
  const renderSection = (x: string, description: string, noMore?: boolean) => {
    return (
      <Box sx={{width: '137px', mr: !noMore ? '5px' : 0, border: `solid 1px ${grey[500]}`, borderRadius: '5px', p: 1, textAlign: 'center'}}>
        <RenderIcon icon={x} enabled />
        <Typography sx={{fontWeight: 'bold', color: theme => theme.palette.primary.dark, ml: '5px'}}>
          {qrNameDisplayer(x, true)}
        </Typography>
        <Typography sx={{fontSize: '15px'}}>
          {description}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{width: '100%', overflow: 'auto', display: 'flex'}}>
      {Object.keys(dynamicQrTypes).slice(0, 5).map((x: string) => {
        // @ts-ignore
        return renderSection(x, dynamicQrTypes[x].description);
      })}
      {renderSection('more', 'More options', true)}
    </Box>
  );
}

export default SlideQrTypeSelector;

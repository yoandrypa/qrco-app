import Typography from "@mui/material/Typography";
import {FONTS} from "../../constants";
import Box from "@mui/material/Box";
import {grey} from "@mui/material/colors";

import SectionSelector from "../SectionSelector";
import {DataType, FontTypes} from "../../types/types";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

interface RenderFontsHandlerProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderFontsHandler({data, handleValue}: RenderFontsHandlerProps) {
  const before = (payload: string): void => {
    handleValue('globalFont')(payload);
  }

  const renderFontType = (font: FontTypes) => {
    return ( // @ts-ignore
      <SectionSelector selected={(!data.globalFont && font.name === 'Default') || data.globalFont === font.name}
                       handleSelect={before} property={font.name} h={'50px'} w={'190px'} separate>
        <Box sx={{width: '100%', textAlign: 'left'}}>
          <Typography sx={{fontFamily: font.type, fontWeight: 'bold', color: grey[800]}}>{font.name}</Typography>
          <Typography sx={{fontFamily: font.type, textTransform: 'none', mb: '-5px', color: grey[700]}}>{'AaBbCc...Zz, 123'}</Typography>
        </Box>
      </SectionSelector>
    );
  }

  return (
    <>
      <Paper elevation={2} sx={{ p: '8px 0 0 8px', width: '100%', pb: '-5px' }}>
        <Typography sx={{fontWeight: 'bold', mb: '5px'}}>{'Global microsite\'s font family'}</Typography>
        {FONTS.map(x => renderFontType(x))}
      </Paper>
    </>
  );
}

// @ts-nocheck

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import SectionSelector from '../helperComponents/SectionSelector';

interface LogosProps {
  image: string | null;
  handleMainData: Function;
}

const Logos = ({ image, handleMainData }: LogosProps) => (
  <Box sx={{ width: '100%', overflow: 'auto' }}>
    <Stack direction="row" spacing={2} sx={{margin: '3px'}}>
      <SectionSelector
        label="No logo"
        icon={null}
        selected={!image}
        handleSelect={handleMainData} />
      <SectionSelector
        icon="/scan/scan.png"
        label="Scan"
        selected={image === '/scan/scan.png'}
        handleSelect={handleMainData} />
      <SectionSelector
        icon="/scan/scan1.png"
        label="Scan me"
        selected={image === '/scan/scan1.png'}
        handleSelect={handleMainData} />
      <SectionSelector
        icon="/scan/scan2.png"
        label="Scan me"
        selected={image === '/scan/scan2.png'}
        handleSelect={handleMainData} />
      <SectionSelector
        isUpload
        icon={image}
        label="Upload"
        selected={Boolean(image) && !image.startsWith('/scan/scan')}
        handleSelect={handleMainData} />
    </Stack>
  </Box>
);

export default Logos;

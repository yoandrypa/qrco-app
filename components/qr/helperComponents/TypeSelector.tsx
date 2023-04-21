import React, { useState, ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { grey } from "@mui/material/colors";
import { useTheme } from "@mui/system";
import { qrNameDisplayer } from "../../../helpers/qr/helpers";
import { ISettingQr } from "../components/commons/types";
import { renderQrIcon } from "../components/commons/helpers";

interface TypeSelectorProps {
  handleSelect: (payload: string) => void;
  qrType: ISettingQr<any>;
  selected: boolean;
  enabled?: boolean;
  isDynamic?: boolean;
}

const TypeSelector = ({ isDynamic, handleSelect, qrType, selected, enabled = true }: TypeSelectorProps) => {
  const [over, setOver] = useState<boolean>(selected);
  const theme = useTheme();

  const { id: qrTypeId, name: qrName, description, renderIcon } = qrType;

  const beforeHandle = (event: any) => {
    if (enabled && !['svg', 'BUTTON'].includes(event.target.tagName)) {
      handleSelect(qrTypeId);
    }
  };

  const handleOver = (): void => {
    setOver((prev: boolean) => !prev);
  }

  return (
    <Box
      sx={{
        position: 'relative',
        cursor: enabled ? 'pointer' : 'default',
        width: '100%',
        height: '130px',
        borderRadius: '5px',
        border: `solid 1px ${grey[500]}`,
        backgroundColor: enabled ? '#fff' : grey[300],
        boxShadow: enabled && selected ? '0 0 5px 2px #286ED6' : 'none',
        '&:hover': enabled ? {
          boxShadow: !selected ? '0 0 3px 2px #849abb' : '0 0 3px 2px #286ED6',
        } : grey[100]
      }}
      onMouseEnter={handleOver}
      onMouseLeave={handleOver}
      onClick={beforeHandle}
    >
      <Box sx={{ display: 'flex', p: 1 }}>
        <Box sx={{ mt: '3px' }}>
          {renderQrIcon(qrType, { enabled, color: !selected && !over ? grey[800] : undefined })}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', ml: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <Typography sx={{
              width: '100%',
              fontWeight: 'bold',
              color: !enabled ? grey[500] : (selected || over ? theme.palette.primary.dark : grey[800])
            }} variant="h6">
              {qrName || qrNameDisplayer(qrTypeId, isDynamic || false)}
            </Typography>
          </Box>
          <Typography sx={{ width: '100%', color: !enabled ? grey[500] : grey[selected || over ? 800 : 700] }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TypeSelector;

import { Theme } from '@mui/system'

export function parseFormFieldSx(sx: any, theme: Theme) {
  return {
    '& .MuiFormLabel-root': {
      px: 1,
      ml: -0.5,
      borderRadius: 1,
      bgcolor: 'background.paper',
      '&.Mui-focused': {
        borderColor: 'primary.main',
        borderWidth: 1,
        borderStyle: 'solid',
      },
    },
    ...sx
  }
}

export function parseFormFieldInputSx(sx: any, theme: Theme) {
  return { bgcolor: 'background.paper', color: 'text.main' }
}
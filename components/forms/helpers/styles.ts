import { Theme } from '@mui/system'

export function parseFormFieldLabelSx(sx: any, theme: Theme) {
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
  }
}

export function parseFormFieldSx(sx: any, theme: Theme) {
  return {
    ...parseFormFieldLabelSx(sx, theme),
    ...sx
  }
}

export function parseFormSelectFieldSx(sx: any, theme: Theme) {
  return {
    mt: 1,
    '& .MuiSelect-select': {
      py: theme.spacing(1.1),
    },
    ...parseFormFieldSx(sx, theme),
  }
}

export function parseFormFieldInputSx(sx: any, theme: Theme) {
  return { bgcolor: 'background.paper', color: 'text.main' }
}
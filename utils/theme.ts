import { THEMES_VARIANTS, PRIMARY_LIGHT_COLOR, PRIMARY_DARK_COLOR, HEADER_HEIGHT } from "../consts";
import { Theme } from "@mui/material/styles";

interface IBaseProps {
  ownerState: any;
  theme: Theme;
}

export const themeConfig = (mode = THEMES_VARIANTS.light) => {
  const primaryColor = mode === THEMES_VARIANTS.light ? PRIMARY_LIGHT_COLOR : PRIMARY_DARK_COLOR;

  return {
    palette: {
      mode,
      primary: {
        main: primaryColor
      }
    },
    components: {
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: `${HEADER_HEIGHT}px !important`
          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          standard: {
            borderStyle: 'solid',
            borderWidth: '1px',
          },
          standardWarning: {
            borderColor: '#ff9800',
          },
          standardError: {
            borderColor: '#ef5350',
          },
          standardInfo: {
            borderColor: '#03a9f4',
          },
          standardSuccess: {
            borderColor: '#4caf50',
          },
        },
      },

      MuiFormLabel: {
        styleOverrides: {
          root: ({ theme }: IBaseProps) => ({
            paddingLeft: theme.spacing(0.5),
            paddingRight: theme.spacing(0.5),
            marginLeft: theme.spacing(-0.5),
            borderRadius: theme.spacing(1),
            backgroundColor: theme.palette.background.default,
          }),
        }
      },

    }
  };
};

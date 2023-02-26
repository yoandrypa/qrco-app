import { THEMES_VARIANTS, PRIMARY_LIGHT_COLOR, PRIMARY_DARK_COLOR, HEADER_HEIGHT } from "../consts";

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
    }
  };
};

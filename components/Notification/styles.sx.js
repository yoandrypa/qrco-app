import { keyframes } from "@emotion/react";

const kframes = keyframes({
  '0%': { left: '-35%', right: '100%' },
  '100%': { left: '0%', right: '0%' }
});

const styles = {
  progress: (time) => ({
    mt: 1,

    '& .MuiLinearProgress-bar1Indeterminate': {
      width: 'auto',
      animation: `${kframes} ${time / 1000}s linear forwards`
    },

    '& .MuiLinearProgress-bar2Indeterminate': {
      display: 'none'
    }
  }),
};

export default styles;

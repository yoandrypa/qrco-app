const styles = {
  iconSmall: {
    width: 22,
    height: 22,
    color: 'primary.main'
  },

  iconFree: {
    width: 22,
    height: 22,
    color: 'warning.main'
  },

  navButton: {
    height: { sm: '28px', xs: '50px' },
    my: 'auto',
  },

  paperSx: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
};

export default styles;

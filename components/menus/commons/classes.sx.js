const styles = {
  iconSmall: {
    width: 22,
    height: 22,
    color: 'primary.main'
  },

  navButton: {
    height: 28,
    my: 'auto',
    mr: '5px',
    textTransform: 'none',
  },

  profile: {
    backgroundColor: 'primary.light',

    '&.Mui-disabled': {
      opacity: 1,
    },

    '& .MuiSvgIcon-root': {
      color: 'white',
    },

    '& .MuiListItemText-root': {
      color: 'white',
      textAlign: 'center',
      mr: 4
    }
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

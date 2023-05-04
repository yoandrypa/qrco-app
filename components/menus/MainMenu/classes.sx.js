import baseStyles from '../commons/classes.sx'

const styles = {
  ...baseStyles,

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
};

export default styles;

const styles = {
  sxCenterBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  },

  sxMsgBox: {
    borderStyle: 'solid',
    borderColor: 'info.light',
    borderWidth: 1,
    borderRadius: 2,
    p: 2.5,
  },

  sxMsgText: {
    color: 'info.light',
    fontWeight: 'bold',
  },

  sxRow: {
    width: "100%",
    overflow: "hidden",
    '&:hover': {
      boxShadow: '0 0 3px 2px #849abb'
    }
  },

  sxQrName: {
    fontWeight: "bold",
    mb: "-2px",
    width: { sm: '350px', xs: '200px' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  sxIcon: {
    width: 18,
    height: 18,
    ml: '2px',
  },

  sxQrTypeName: {
    mb: '-7px',
    display: 'flex',
    alignItems: 'center'
  },

  sxPaginator: {
    p: 1,
  },

  sxFlexStart: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  sxFlexEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

};

export default styles;

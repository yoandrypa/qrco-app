import Typography from "@mui/material/Typography";

export default function RenderClaimingInfo({claim}: {claim: string;}) {
  return (
    <>
      <Typography sx={{fontSize: 'small', color: theme => theme.palette.text.disabled}}>CLAIMING</Typography>
      <Typography sx={{fontWeight: 'bold', mt: '-7px', color: theme => theme.palette.text.disabled}}>{claim}</Typography>
    </>
  );
}

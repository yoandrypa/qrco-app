import Typography from "@mui/material/Typography";

interface TopicProps {
  message: string;
  notBold?: boolean;
}

const Topics = ({message, notBold}: TopicProps) => {
  return (<Typography sx={{fontWeight: !notBold ? 'bold' : 'normal', mb: '3px'}}>{message}</Typography>);
}

export default Topics;

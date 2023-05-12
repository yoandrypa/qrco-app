import SvgIcon from '@mui/material/SvgIcon';

interface TikTokProps {
  color?: string;
  sx?: object;
  size?: string;
}

const Twitch = ({ color, sx, size }: TikTokProps) => (
  <SvgIcon
    viewBox="0 0 24 24"
    sx={{
      color: theme => color || theme.palette.primary.dark,
      userSelect: 'none',
      width: size || '1em',
      height: size || '1em',
      display: 'inline-block',
      flexShrink: 0,
      transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      fontSize: '1.5rem',
      ...sx
    }}
  >
    <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z"/>
  </SvgIcon>
);

export default Twitch;

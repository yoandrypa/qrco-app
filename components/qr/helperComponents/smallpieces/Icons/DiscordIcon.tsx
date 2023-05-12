import SvgIcon from '@mui/material/SvgIcon';

interface TikTokProps {
  color?: string;
  sx?: object;
  size?: string;
}

const DiscordIcon = ({ color, sx, size }: TikTokProps) => (
  <SvgIcon
    viewBox="105 65 115 115"
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
    <path d="M202.4,81.9c-7.3-3.3-14.9-5.7-22.8-7c-1,1.8-2.1,4.1-2.9,6c-8.4-1.3-16.9-1.3-25.3,0c-0.9-2.1-1.9-4.1-3-6
			c-7.9,1.3-15.6,3.7-22.8,7.1c-14.4,21.5-18.3,42.4-16.4,63.1c8.5,6.3,17.9,11.1,28,14.1c2.3-3.1,4.3-6.3,6-9.7
			c-3.3-1.2-6.4-2.7-9.4-4.5c0.8-0.6,1.5-1.2,2.3-1.8c17.7,8.4,38.3,8.4,56,0c0.8,0.6,1.5,1.2,2.3,1.8c-3,1.8-6.2,3.3-9.5,4.5
			c1.7,3.4,3.7,6.6,6,9.7c10.1-3.1,19.6-7.8,28-14.1C221.1,121.1,214.9,100.3,202.4,81.9z M145.6,132.3c-5.5,0-9.9-5-9.9-11.1
			s4.4-11.2,9.9-11.2c5.6,0,10,5,10,11.2C155.5,127.3,151.2,132.3,145.6,132.3z M182.4,132.3c-5.5,0-9.9-5-9.9-11.1
			s4.4-11.2,9.9-11.2c5.6,0,10,5,9.9,11.2S187.9,132.3,182.4,132.3z"/>
  </SvgIcon>
);

export default DiscordIcon;

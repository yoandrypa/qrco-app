import SvgIcon from '@mui/material/SvgIcon';

interface TikTokProps {
  color?: string;
  sx?: object;
  size?: string;
}

const QuoraIcon = ({ color, sx, size }: TikTokProps) => (
  <SvgIcon
    viewBox="0 0 125 125"
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
    <path d="M68.34,105.81a54.73,54.73,0,0,1-14.06,1.87C26.86,107.7,0,85.81,0,54,0,21.87,26.86,0,54.28,0c27.87,0,54.43,21.74,54.43,54A52.29,52.29,0,0,1,88.19,96c3.75,5.89,8,9.81,13.62,9.81,6.15,0,8.62-4.76,9.06-8.49h8v2.88c-.59,7.43-5.12,22.72-24.4,22.72-13.57,0-20.75-7.87-26.13-17.09v0Zm-5.1-10C59,87.44,54,79,44.23,79A14.1,14.1,0,0,0,38.61,80L35.29,73.4c4-3.47,10.56-6.19,18.75-6.19,13,0,19.71,6.28,25,14.3,3.15-6.84,4.64-16.08,4.64-27.55,0-28.6-8.93-43.11-29.83-43.11C33.27,10.85,24.4,25.55,24.4,54s8.91,43,29.49,43a32,32,0,0,0,9-1.16l.39,0Z" />
  </SvgIcon>
);

export default QuoraIcon;

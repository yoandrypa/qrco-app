import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import Image from 'next/image';

type ImageType = { label: string; value: string; image?: boolean | undefined };

interface OptionsSelProps {
  handleData: Function;
  label: string;
  property: string;
  selected: string;
  options: ImageType[];
}

const imageLoader = (src: string) => {
  let source = src;
  if (src === 'extra-rounded') {
    source = 'smooth';
  } else if (src === 'classy-rounded') {
    source = 'elegant';
  } else if (src === 'dot') {
    source = 'dots';
  }
  return `/qr/${source}.png`;
};

const OptionsSelector = ({ handleData, options, label, property, selected }: OptionsSelProps) => {
  const id = `${property}id`;

  return (
    <FormControl sx={{ m: 0, width: '100%' }} size="small">
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        id={id}
        fullWidth
        value={selected}
        label={label}
        onChange={handleData(property)}
        renderValue={(value: string) => {
          // @ts-ignore
          const d:ImageType | undefined = options.find((x: string) => x.value === value);
          return (<Typography>{d?.label || ''}</Typography>)}
        }
      >
        {options.map((x: ImageType) => (
          <MenuItem key={`${id}${x.value}`} value={x.value}>
            {x.image && (
              <ListItemIcon>
                {x.value !== '-1' ? <Image
                  src={imageLoader(x.value)}
                  alt="/"
                  width={22}
                  height={22}
                /> : <QuestionMarkIcon fontSize="small" />}
              </ListItemIcon>
            )}
            <ListItemText><Typography>{x.label}</Typography></ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default OptionsSelector;

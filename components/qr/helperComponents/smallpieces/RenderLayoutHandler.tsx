import Box from "@mui/material/Box";
import {blueGrey} from "@mui/material/colors";
import {DataType} from "../../types/types";

interface RenderLayoutProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderLayoutHandler({data, handleValue}: RenderLayoutProps) {
  const handle = (prop: string) => () => {
    handleValue('layout')(prop);
  }

  const renderLayout = (kind: string, noMore?: boolean) => {
    const isBorder = kind.includes('border');
    const selected = (!data?.layout && kind === 'default') || data?.layout === kind;
    return (
      <Box
        onClick={handle(kind)}
        sx={{
          display: 'inline-block',
          mr: !noMore ? 2 : 0,
          cursor: 'pointer',
          width: '120px',
          height: '200px',
          background: blueGrey[50],
          borderRadius: '8px',
          border: `solid 1px ${blueGrey[400]}`,
          boxShadow: selected ? '0 0 4px 3px #286ED6' : 'none',
          '&:hover': {boxShadow: !selected ? '0 0 2px 2px #849abb' : '0 0 2px 2px #286ED6'}
      }}>
        <Box sx={{
          width: `calc(100% - ${!isBorder ? 0 : '10px'})`,
          height: !isBorder ? '65px' : '60px',
          mt: !isBorder ? 0 : '5px',
          mx: 'auto',
          background: blueGrey[300],
          borderRadius: '8px 8px 0 0'
        }}/>
        <Box sx={{
          width: '48px',
          height: '48px',
          background: blueGrey[500],
          mx: 'auto',
          transform: `translate(${!kind.includes('Left') ? 0 : '-25px'}, -50%)`,
          border: 'solid 2px #fff',
          borderRadius: '50%'
        }}/>
      </Box>
    )
  };

  return (
    <Box>
      {renderLayout('default')}
      {renderLayout('defLeft')}
      {renderLayout('border')}
      {renderLayout('borderLeft', true)}
    </Box>
  );
}

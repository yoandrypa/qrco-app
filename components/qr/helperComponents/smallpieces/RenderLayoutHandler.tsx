import Box from "@mui/material/Box";
import {indigo} from "@mui/material/colors";

export default function RenderLayoutHandler() {
  const renderLayout = (kind: string, noMore?: boolean) => {
    const isBorder = kind.includes('border');
    return (
      <Box sx={{
        display: 'inline-block',
        mr: !noMore ? 2 : 0,
        width: '120px',
        height: '200px',
        background: indigo[50],
        borderRadius: '8px',
        border: `solid 1px ${indigo[200]}`
      }}>
        <Box sx={{
          width: `calc(100% - ${!isBorder ? 0 : '10px'})`,
          height: !isBorder ? '65px' : '60px',
          mt: !isBorder ? 0 : '5px',
          mx: 'auto',
          background: indigo[300],
          borderRadius: '8px 8px 0 0'
        }}/>
        <Box sx={{
          width: '48px',
          height: '48px',
          background: indigo[500],
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

// @ts-nocheck

import { useCallback, useContext, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import UploadIcon from '@mui/icons-material/Upload';
import TuneIcon from '@mui/icons-material/Tune';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Context from '../../context/Context';
import { BackgroundType, OptionsType } from '../types/types';
import ColorSelector from '../helperComponents/ColorSelector';
import OptionsSelector from '../helperComponents/OptionsSelector';
import Settings from '../helperComponents/Settings';
import DistinctColorsSettings from '../helperComponents/DistinctColorsSettings';

interface CodeProps {
  options: OptionsType;
  handleData: Function;
  handleUpload: Function;
  handleBackground: Function;
  handleReset: Function;
  background: BackgroundType;
}

const Code = ({ options, handleData, background, handleBackground, handleReset, handleUpload }: CodeProps) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [editColor, setEditColors] = useState<string | null>(null);
  const { cornersData, dotsData, setCornersData, setDotsData } = useContext(Context);

  const handleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const handler = (item: string) => () => {
    const isCorners = item === 'corners';
    let mainObj = isCorners ? { ...cornersData } : { ...dotsData };
    if (!Object.keys(mainObj).length) {
      const { color } = (isCorners ? options.cornersSquareOptions : options.cornersDotOptions);
      mainObj = { topL: color, topR: color, bottom: color };
    } else {
      mainObj = null;
    }
    if (isCorners) {
      setCornersData(mainObj);
    } else {
      setDotsData(mainObj);
    }
  };

  const renderSwitches = (isCorners: boolean | false) => (
    <FormControlLabel
      control={<Switch size="small" checked={(isCorners ? cornersData : dotsData) !== null} onChange={handler(`${isCorners ? 'corners' : 'dots'}`)} />}
      label="Distinct color" />
  );

  const renderEditButtons = useCallback((handler: string) => {
    const handleEdit = () => {
      if (editColor !== handler) {
        setEditColors(handler);
      } else {
        setEditColors(null);
      }
    };
    return (
      <Button onClick={handleEdit} sx={{ mt: '8.5px', mb: '7px', width: '100%' }} color="primary" variant="contained">
        {editColor !== handler ? handler : `Close ${handler}`}
      </Button>
    );
  }, [editColor]);

  return (
    <Grid container spacing={1}>
      {!showSettings ? (<>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 2, m: '1px', height: { xs: 'auto', sm: background.type === 'solid' ? 'auto' : '132px' } }}>
            <OptionsSelector
              label="Code"
              property="dotsOptions.type"
              handleData={handleData}
              selected={options.dotsOptions?.type || 'square'}
              options={[
                { label: 'Squares', value: 'square', image: true },
                { label: 'Rounded', value: 'rounded', image: true },
                { label: 'Smooth', value: 'extra-rounded', image: true },
                { label: 'Elegant', value: 'classy-rounded', image: true },
                { label: 'Dots', value: 'dots', image: true }
              ]}
            />
            <ColorSelector
              label="Code color"
              color={options.dotsOptions?.color || '#000000'}
              handleData={handleData}
              property="dotsOptions.color"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 2, m: '1px' }}>
            <OptionsSelector
              label="Background type"
              property="type"
              handleData={handleBackground}
              selected={background?.type}
              options={[
                { label: 'Solid', value: 'solid' },
                { label: 'Image', value: 'image' }
              ]}
            />
            {background.type === 'solid' ? (
              <ColorSelector
                label="Background color"
                color={options.backgroundOptions.color}
                handleData={handleData}
                property="backgroundOptions.color"
              />
            ) : (
              <ButtonGroup orientation="vertical" aria-label="vertical_buttons" sx={{ width: '100%', mt: '5px' }}>
                <Button sx={{ height: '28px' }} variant="contained" onClick={handleUpload} startIcon={<UploadIcon />}>
                  {'Pick image'}
                </Button>
                <Button sx={{ height: '28px' }} disabled={!background?.file?.length} variant="outlined" onClick={handleSettings} click startIcon={<TuneIcon />}>
                  {'Settings'}
                </Button>
              </ButtonGroup>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 2, m: '1px' }}>
            <OptionsSelector
              label="Corner"
              property="cornersSquareOptions.type"
              handleData={handleData}
              selected={options.cornersSquareOptions?.type || '-1'}
              options={[
                { label: 'Squares', value: 'square', image: true },
                { label: 'Smooth', value: 'extra-rounded', image: true },
                { label: 'Dots', value: 'dot', image: true },
                { label: 'Same as code', value: '-1', image: true }
              ]}
            />
            {renderSwitches(true)}
            {!cornersData ? (<ColorSelector
              label="Corner color"
              color={options.cornersSquareOptions?.color || '#000000'}
              handleData={handleData}
              property="cornersSquareOptions.color"
            />) : renderEditButtons('corners')}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 2, m: '1px' }}>
            <OptionsSelector
              label="Dot"
              property="cornersDotOptions.type"
              handleData={handleData}
              selected={options.cornersDotOptions?.type || '-1'}
              options={[
                { label: 'Squares', value: 'square', image: true },
                { label: 'Dots', value: 'dot', image: true },
                { label: 'Same as code', value: '-1', image: true }
              ]}
            />
            {renderSwitches(false)}
            {!dotsData ? (<ColorSelector
              label="Dot color"
              color={options.cornersDotOptions?.color}
              handleData={handleData}
              property="cornersDotOptions.color"
            />) : renderEditButtons('dots')}
          </Paper>
        </Grid>
        {editColor && <DistinctColorsSettings editKind={editColor} setClose={() => setEditColors(null) } />}
      </>) : (
        <Grid item xs={12}>
          <Settings background={background} handleBackground={handleBackground} handleReset={handleReset} setClose={handleSettings} />
        </Grid>
      )}
    </Grid>
  )
};

export default Code;

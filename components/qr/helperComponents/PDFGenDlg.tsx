// @ts-nocheck

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';

import { PDFViewer, Page, View, Image as Img, PDFDownloadLink, Document, StyleSheet } from '@react-pdf/renderer';

interface PDFGenDlgProps {
  handleClose: () => void;
  data: any;
  isFramed: boolean;
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  }
});

const size = 750;

type PageSetting = {
  pageSize: string; orientation: string; amount: number; separation: number; different: boolean; size: number;
};

const PDFGenDlg = ({ handleClose, data, isFramed }: PDFGenDlgProps) => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [settings, setSettings] = useState<PageSetting>({
    pageSize: 'A4', orientation: 'portrait', amount: 1, separation: 25, different: false, size
  });

  const handleData = (item: string) => (event: { target: { value: string } | { checked: boolean; }; }) => {
    const { value, checked } = event.target as { value: string | undefined; checked: boolean | string | undefined };
    if (item !== 'different') {
      setSettings({ ...settings, [item]: item !== 'amount' ? value : +(value || 0) });
    } else {
      setSettings({ ...settings, [item]: checked });
    }
  };

  const generatePdf = () => {
    const dataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(typeof data === 'string' ? data : data.outerHTML)}`;
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const img: HTMLImageElement = new Image();
    const canvasW: number = settings.size;
    const canvasH: number = isFramed ? Math.round(330 * settings.size / size) : settings.size;
    img.onload = () => {
      canvas.setAttribute('width', `${canvasW}`);
      canvas.setAttribute('height', `${canvasH}`);
      const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvasW, canvasH);

      const height = !isFramed ? settings.size : Math.round(settings.size * 330 / 280); // 884;
      const width = settings.size;

      setPdfDocument(
        <Document title="Ready to print QR" author="Ebanux">
          <Page size={settings.pageSize} orientation={settings.orientation} dpi={300} style={styles.body}>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              {[...Array(settings.amount)].map((_: any, index: number) => (
                <Img key={`imgKey${index}`} src={canvas.toDataURL('image/png', 1)} style={{ width, height, margin: settings.separation }} />
              ))}
            </View>
          </Page>
        </Document>
      );

      canvas.remove();
    }
    img.src = dataURL;
  };

  useEffect(() => {
    generatePdf();
  }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog onClose={handleClose} open={true} maxWidth="md">
      <DialogContent dividers="paper">
        <Typography sx={{ fontWeight: 'bold' }}>PDF Settings</Typography>
        <Box sx={{ p: 1, width: { md: '650px', sm: '100%', xs: '100%' }, display: 'flex', flexDirection: { md: 'row', sm: 'column', xs: 'column' } }}>
          <Box sx={{ width: '100%', pr: {md: 2, sm: 0, xs: 0} }}>
            <Paper sx={{ p: 1 }} elevation={2}>
              <Typography>Page Settings</Typography>
              <FormControl sx={{ m: 0, mt: 1, width: '100%' }} size="small">
                <InputLabel id="pageSize">Page size</InputLabel>
                <Select
                  labelId="pageSize"
                  id="pageSize"
                  fullWidth
                  value={settings.pageSize}
                  label="Page size"
                  onChange={handleData('pageSize')}
                >
                  <MenuItem value="A4">A4 (595.28 x 841.89 pixels)</MenuItem>
                  <MenuItem value="LETTER">Letter (612.00 x 792.00 pixels)</MenuItem>
                  <MenuItem value="LEGAL">Legal (612.00 x 1008.00 pixels)</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 0, mt: 1, width: '100%' }} size="small">
                <InputLabel id="orientation">Orientation</InputLabel>
                <Select
                  labelId="orientation"
                  id="orientation"
                  fullWidth
                  value={settings.orientation}
                  label="Orientation"
                  onChange={handleData('orientation')}
                >
                  <MenuItem value="portrait">Portrait (Vertical)</MenuItem>
                  <MenuItem value="landscape">Landscape (Horizontal)</MenuItem>
                </Select>
              </FormControl>
            </Paper>
            <Paper sx={{ p: 1, mt: 2 }} elevation={2}>
              <Typography>Image Settings</Typography>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  size="small"
                  label="Repetitions"
                  type="number"
                  disabled={settings.different}
                  sx={{ width: '100%' }}
                  onKeyDown={evt =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                  margin="dense"
                  value={settings.amount}
                  onChange={handleData('amount')}
                  variant="outlined"
                  InputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]+',
                    inputProps: { min: 1 }
                  }}
                />
                {settings.amount > 1 ? <TextField
                  sx={{ ml: '5px', width: '100%' }}
                  size="small"
                  label="Separation"
                  type="number"
                  onKeyDown={evt =>
                    ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                  }
                  margin="dense"
                  value={settings.separation}
                  onChange={handleData('separation')}
                  variant="outlined"
                  InputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]+',
                    inputProps: { min: 10, max: 50 }
                  }}
                /> : null}
              </Box>
              <Typography>Size</Typography>
              <Slider
                sx={{ mx: '5px', width: 'calc(100% - 13px)' }}
                value={settings.size}
                onChange={handleData('size')}
                step={50}
                valueLabelDisplay="off"
                size="small"
                marks
                min={500}
                max={1150}
              />
            </Paper>
          </Box>
          <Paper elevation={2} sx={{ p: 1, mt: {md: 0, sm: 1, xs: 1} }}>
            <Typography>Preview</Typography>
            {pdfDocument ? (
              <PDFViewer width="100%" height="100%" showToolbar={false}>
                {pdfDocument}
              </PDFViewer>
            ) : <Typography>...</Typography>}
          </Paper>
        </Box>
      </DialogContent >
      <DialogActions>
        <PDFDownloadLink document={pdfDocument} fileName="ebanuxQr.pdf" style={{ textDecoration: 'none' }}>
          {({ loading }) => (<Button variant="contained" disabled={loading} sx={{ mr: '5px' }}>Download PDF</Button>)}
        </PDFDownloadLink>
        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PDFGenDlg;

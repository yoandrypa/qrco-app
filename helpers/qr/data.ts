export const initialBackground = {
  type: 'solid',
  opacity: 50,
  size: 1,
  file: null,
  x: 0,
  y: 0,
  imgSize: 1
};

export const initialFrame = {
  type: null,
  text: 'SCAN ME',
  color: '#000000',
  textColor: '#000000'
};

export const originalDimensions = 280;

export const initialData = {
  isDynamic: true,
  custom: [],
}

const initialOptions = {
  width: originalDimensions,
  height: originalDimensions,
  type: 'svg',
  data: 'Ebanux',
  image: null,
  margin: 15,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'H'
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.3,
    margin: 2,
    crossOrigin: 'anonymous'
  },
  dotsOptions: {
    color: '#000000',
    type: 'square'
  },
  backgroundOptions: {
    color: '#ffffff'
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'square'
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'square'
  }
};

export default initialOptions;

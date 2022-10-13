import QrScanner from 'qr-scanner';
import frame0 from '../../components/qr/frames/frame0';
import frame1 from '../../components/qr/frames/frame1';
import frame2 from '../../components/qr/frames/frame2';
import frame3 from '../../components/qr/frames/frame3';
import frame4 from '../../components/qr/frames/frame4';
import frame5 from '../../components/qr/frames/frame5';
import frame6 from '../../components/qr/frames/frame6';
import frame7 from '../../components/qr/frames/frame7';
import { DataType, FramesType } from '../../components/qr/types/types';
import {originalDimensions} from "./data";

export const handleDesignerString = (selected: string | null | undefined, data: DataType): string => {
  let designerString = '';
  switch (selected) {
    case 'text':
    case 'web': {
      designerString = data.value || '';
      break;
    }
    case 'sms': {
      designerString = `SMSTO:${data.number || ''}:${data.message}`;
      break;
    }
    case 'email': {
      const params: { subject?: string; body?: string; } = {};
      if (data.subject) { params.subject = data.subject; }
      if (data.body) { params.body = data.body; }
      designerString = `mailto:${data?.email || ''}${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ''}`;
      break;
    }
    case 'wifi': {
      designerString = `WIFI:S:${data.name};P:${data.password || ''}`;
      if (data.encription && data.encription !== 'none') { designerString += `;T:${data.encription}`; }
      designerString += `;${data.hidden ? 'H:true' : ';'}`;
      designerString += ';'
      break;
    }
    case 'vcard':
    case 'vcard+': {
      designerString = 'BEGIN:VCARD\n';
      if (data.prefix || data.lastName || data.firstName) {
        designerString += `N:${data.lastName || ''};${data.prefix ? `${data.prefix};` : ''}${data.firstName || ''};\n`;
      }
      if (data.cell) { designerString += `TEL;TYPE=work,VOICE:${data.cell}\n`; }
      if (data.phone) { designerString += `TEL;TYPE=home,VOICE:${data.phone}\n`; }
      if (data.fax) { designerString += `TEL;TYPE=fax,VOICE:${data.phone}\n`; }
      if (data.organization) { designerString += `ORG:${data.organization}\n`; }
      if (data.position) { designerString += `TITLE:${data.position}\n`; }
      if (data.address || data.city || data.zip || data.state || data.country) {
        designerString += `ADR;TYPE=WORK,PREF:;;${data.address || ''};${data.city || ''};${data.state || ''};${data.zip || ''};${data.country || ''}\n`;
      }
      if (data.email) { designerString += `EMAIL:${data.email}\n`; }
      if (data.web) { designerString += `URL:${data.web}\n`; }
      designerString += 'VERSION:3.0\nEND:VCARD\n';
      if (data.facebook) { designerString += `facebook:${data.facebook}\n` }
      if (data.twitter) { designerString += `twitter:${data.twitter}\n` }
      if (data.instagram) { designerString += `instagram:${data.instagram}\n` }
      if (data.youtube) { designerString += `youtube:${data.youtube}\n` }
      if (data.whatsapp) { designerString += `whatsapp:${data.whatsapp}\n` }
      if (data.linkedin) { designerString += `linkedin:${data.linkedin}\n` }
      if (data.pinterest) { designerString += `pinterest:${data.pinterest}\n` }
      if (data.telegram) { designerString += `facebook:${data.telegram}\n` }
      break;
    }
    case 'twitter': {
      designerString += `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text || '')}`;
      designerString += `${data.url ? encodeURIComponent(` ${data.url}`) : ''}`;
      designerString += `${data.hashtags ? encodeURIComponent(` ${data.hashtags.split(',').map((x: string) => `#${x}`).join(' ')}`) : ''}`;
      designerString += `${data.via ? encodeURIComponent(` @${data.via}`) : ''}`;
      break;
    }
    case 'whatsapp': {
      designerString += `https://wa.me/${data.number}`;
      if (data.message) { designerString += `?text=${encodeURIComponent(data.message)}`; }
      break;
    }
    case 'facebook': {
      designerString += `https://www.facebook.com/sharer.php?u=${encodeURIComponent(data.message || '')}`;
      break;
    }
  }
  return designerString;
};

export const convertBase64 = (file: Blob): object => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = error => {
      reject(error);
    };
  });
};

export const checkForAlpha = (file: Blob): Promise<{ depth: number; type: string; buffer: ArrayBuffer; hasAlpha: boolean; } | null> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {
      // @ts-ignore
      const view = new DataView(fileReader.result);
      if (view.getUint32(0) === 0x89504E47 && view.getUint32(4) === 0x0D0A1A0A) {
        const depth = view.getUint8(8 + 8 + 8);
        const type = view.getUint8(8 + 8 + 9);
        const result = {
          depth: depth,
          type: ["G", "", "RGB", "Indexed", "GA", "", "RGBA"][type],
          buffer: view.buffer,
          hasAlpha: type === 4 || type === 6
        };
        resolve(result);
      }
      resolve(null);
    };
    fileReader.onerror = () => {
      reject(null);
    };
  });
};

const getRGB = (hex: string): number[] => {
  const color = parseInt(hex.startsWith('#') ? hex.substring(1) : hex, 16);
  const r = color >> 16;
  const g = (color - (r << 16)) >> 8;
  const b = color - (r << 16) - (g << 8);
  return [r, g, b];
};

const rgbLab = (rgb: number[]): number[] => {
  let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722);
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
};

const delta = (rgbA: number[], rgbB: number[]): number => {
  const labA = rgbLab(rgbA);
  const labB = rgbLab(rgbB);
  const deltaL = labA[0] - labB[0];
  const deltaA = labA[1] - labB[1];
  const deltaB = labA[2] - labB[2];
  const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  const deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  const sc = 1.0 + 0.045 * c1;
  const sh = 1.0 + 0.015 * c1;
  const deltaLKlsl = deltaL / (1.0);
  const deltaCkcsc = deltaC / (sc);
  const deltaHkhsh = deltaH / (sh);
  const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

export const downloadAsSVGOrVerify = (qrImageData: { outerHTML: string; }, verify: Function | undefined, contrast: {color1?: string; color2: string} | undefined): void => {
  const svgData = qrImageData.outerHTML.replaceAll(' href', ' xlink:href');
  const data = new Blob([svgData], { type: 'image/svg+xml' });
  if (verify) {
    // @ts-ignore
    if (contrast && delta(getRGB(contrast.color1), getRGB(contrast.color2)) <= 45) {
      verify({ readable: false });
    } else {
      QrScanner.scanImage(data, { returnDetailedScanResult: true })
        .then(() => { verify({ readable: true }); })
        .catch(() => { verify({ readable: false }); });
    }
  } else {
    const element = document.createElement('a');
    element.href = URL.createObjectURL(data);
    element.download = 'ebanuxQr.svg';
    document.body.appendChild(element);
    element.click();
    element.remove();
  }
};

export const downloadAsPNG = async (svgData: { outerHTML: string | number | boolean; }, frame: FramesType | { type: string; }, verify: Function | undefined, contrast: any | undefined): Promise<void> => {
  const base64doc = window.btoa(decodeURIComponent(encodeURIComponent(svgData.outerHTML)));
  const imageToHandle = document.createElement('img');
  imageToHandle.src = 'data:image/svg+xml;base64,' + base64doc;
  const canvas = document.createElement('canvas');
  imageToHandle.onload = () => {
    const w: number = 280;
    const h: number = frame.type !== '' && frame.type !== '/frame/frame0.svg' ? 330 : 280;
    // @ts-ignore
    canvas.setAttribute('width', w);
    // @ts-ignore
    canvas.setAttribute('height', h);
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    // @ts-ignore
    context.drawImage(imageToHandle, 0, 0, w, h);
    const data = canvas.toDataURL('image/png', 1);
    if (!verify) {
      const anchor = document.createElement('a');
      anchor.download = 'ebanuxQr.png';
      anchor.href = data;
      anchor.click();
      anchor.remove();
    } else {
      // @ts-ignore
      if (contrast && delta(getRGB(contrast.color1), getRGB(contrast.color2)) <= 45) {
        verify({ readable: false });
      } else {
        QrScanner.scanImage(data, { returnDetailedScanResult: true })
          .then(() => { verify({ readable: true }); })
          .catch(() => { verify({ readable: false }); });
      }
    }
    imageToHandle.remove();
    canvas.remove();
  }
};

export const getFrame = (frame: FramesType): string => {
  let result = null;
  const defaultText:string = 'SCAN ME';
  const defaultColor:string = '#000000'

  if (frame.type === '/frame/frame0.svg') {
    result = frame0(frame.color);
  } else if (frame.type === '/frame/frame1.svg') {
    result = frame1(frame.color, frame.text || defaultText, frame.textColor || '#ffffff', frame.textUp);
  } else if (frame.type === '/frame/frame2.svg') {
    result = frame2(frame.color, frame.text || defaultText, frame.textColor || defaultColor, frame.textUp);
  } else if (frame.type === '/frame/frame3.svg') {
    result = frame3(frame.color, frame.text || defaultText, frame.textColor || defaultColor, frame.textUp);
  } else if (frame.type === '/frame/frame4.svg') {
    result = frame4(frame.color, frame.text || defaultText, frame.textColor || defaultColor, frame.textUp);
  } else if (frame.type === '/frame/frame5.svg') {
    result = frame5(frame.color);
  } else if (frame.type === '/frame/frame6.svg') {
    result = frame6(frame.color, frame.text || defaultText, frame.textColor || defaultColor);
  } else {
    result = frame7(frame.color);
  }
  return result;
}

export function getUuid(): string {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt/16);
    return (c === 'x' ? r :(r&0x3|0x8)).toString(16);
  });
}

export const getFrameObject = (qrDesign: any) => (
  qrDesign.frame?.type ? {
    type: qrDesign.frame?.type,
    text: qrDesign.frame?.text,
    color: qrDesign.frame?.color,
    textColor: qrDesign.frame?.textColor,
    textUp: qrDesign?.textUp || false
  } : null
);

export const getOptionsObject = (qrDesign: any) => {
  const object = {
    width: qrDesign.width,
    height: qrDesign.height,
    type: qrDesign.type,
    data: qrDesign.data,
    image: qrDesign.image,
    margin: qrDesign.margin,
    qrOptions: qrDesign.qrOptions,
    imageOptions: qrDesign.imageOptions,
    dotsOptions: qrDesign.dotsOptions,
    backgroundOptions: qrDesign.backgroundOptions,
    cornersSquareOptions: qrDesign.cornersSquareOptions,
    cornersDotOptions: qrDesign.cornersDotOptions
  };

  if (object.cornersDotOptions.type === '') {
    object.cornersDotOptions.type = null;
  }
  if (object.cornersSquareOptions.type === '') {
    object.cornersSquareOptions.type = null;
  }
  return object;
};

export const getBackgroundObject = (qrDesign: any) => (
  !qrDesign.background?.type ? null : {
  type: qrDesign.background?.type,
  opacity: qrDesign.background?.opacity,
  size: qrDesign.background?.size,
  file: qrDesign.background?.file,
  x: qrDesign.background?.x,
  y: qrDesign.background?.y,
  imgSize: qrDesign.background?.imgSize || 1,
  invert: qrDesign.background?.invert || false,
  backColor: qrDesign.background?.backColor || null
});

export const getCornersAndDotsObject = (qrDesign: any, item: string) => (
  qrDesign[item] ? {
    topL: qrDesign[item].topL,
    topR: qrDesign[item].topR,
    bottom: qrDesign[item].bottom
  } : null
);

export const dataCleaner = (options: any, mainObj?: boolean) => {
  const data = {...options};

  const base = ['backgroundOptions', 'cornersDotOptions', 'cornersSquareOptions', 'dotsOptions', 'imageOptions',
    'qrOptions', 'margin', 'type', 'width', 'height', 'image', 'data'] as string[];

  if (!mainObj) {
    [...base, 'qrOptionsId', 'shortLinkId'].forEach((x: string) => {
      if (data[x]) {
        delete data[x];
      }
    });
  } else {
    const checkFor = [...base, 'id', 'userId', 'shortCode', 'qrType', 'mode'] as string[];
    Object.keys(data).forEach((x: string) => {
      if (!checkFor.includes(x)) {
        delete data[x];
      }
    });
  }

  return data;
}


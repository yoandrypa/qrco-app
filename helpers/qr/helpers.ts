import QrScanner from 'qr-scanner';
import frame0 from '../../components/qr/frames/frame0';
import frame1 from '../../components/qr/frames/frame1';
import frame2 from '../../components/qr/frames/frame2';
import frame3 from '../../components/qr/frames/frame3';
import frame4 from '../../components/qr/frames/frame4';
import frame5 from '../../components/qr/frames/frame5';
import frame6 from '../../components/qr/frames/frame6';
import frame7 from '../../components/qr/frames/frame7';
import {DataType, FramesType} from '../../components/qr/types/types';
import initialOptions from "./data";
import {capitalize} from "@mui/material";

export const handleDesignerString = (selected: string | null | undefined, data: DataType): string => {
  let designerString = '';
  switch (selected) {
    case 'text':
    case 'web': { return data.value || ''; }
    case 'sms': { return `SMSTO:${data.number || ''}:${data.message}`; }
    case 'email': {
      const params: { subject?: string; body?: string; } = {};
      if (data.subject) { params.subject = data.subject; }
      if (data.body) { params.body = data.body; }
      return `mailto:${data?.email || ''}${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ''}`;
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
        designerString += `ADR;TYPE=WORK,PREF:;;${data.address || ''}${data.address2 ? `${data.address ? ', ' : ''}${data.address2}` : ''};${data.city || ''};${data.state || ''};${data.zip || ''};${data.country || ''}\n`;
      }
      if (data.email) { designerString += `EMAIL:${data.email}\n`; }
      if (data.web) { designerString += `URL:${data.web}\n`; }
      designerString += 'VERSION:3.0\nEND:VCARD\n';
      break;
    }
    case 'twitter': {
      designerString = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text || '')}`;
      designerString += `${data.url ? encodeURIComponent(` ${data.url}`) : ''}`;
      designerString += `${data.hashtags ? encodeURIComponent(` ${data.hashtags.split(',').map((x: string) => `#${x}`).join(' ')}`) : ''}`;
      designerString += `${data.via ? encodeURIComponent(` @${data.via}`) : ''}`;
      break;
    }
    case 'whatsapp': {
      designerString = `https://wa.me/${data.number || ''}`;
      if (data.message) { designerString += `?text=${encodeURIComponent(data.message)}`; }
      break;
    }
    case 'facebook': { return `https://www.facebook.com/sharer.php?u=${encodeURIComponent(data.message || '')}`; }
    case 'crypto': { return `Blockchain: ${data.urlOptionLabel || 'btc'},to: ${data.subject} info: ${data.message || ''}`; }
  }
  return designerString;
};

export const getBase64FromUrl = async (url: string) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setTimeout(() => {
        resolve(base64data);
      }, 200);
    }
  });
};

export const convertBase64 = (file: File) => {
  const newFile = new File([file], file.name, { type: file.type });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(newFile);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const blobUrlToFile = (url: string, name: string) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], name);
        resolve(file);
      })
      .catch(e => reject(e));
  })
};

export const getImageData = async (imageData?: File | string | {Key: string; name: string;}[]) => {
  if (!imageData) {
    return undefined;
  }
  if (Array.isArray(imageData)) {
    return imageData;
  }
  if (typeof imageData === 'string') {
    return imageData.startsWith('blob:http') ? await getBase64FromUrl(imageData) : imageData
  }
  return await convertBase64(imageData);
};

export const checkForAlpha = (file: Blob | File): Promise<{ depth: number; type: string; buffer: ArrayBuffer; hasAlpha: boolean; } | null> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => { // @ts-ignore
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

export async function compressImage(file: File, callback: (newFile: File) => void, resizingFactor: number, quality: number) {
  const img: HTMLImageElement = new Image(); // @ts-ignore
  img.src = await convertBase64(file);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  img.onload = () => {
    const originalWidth = img.width;
    const originalHeight = img.height;

    const canvasWidth = originalWidth * resizingFactor;
    const canvasHeight = originalHeight * resizingFactor;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // @ts-ignore
    context.drawImage(img, 0, 0, originalWidth * resizingFactor, originalHeight * resizingFactor);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const result = new File([blob], file.name, {type: file.type});
          callback(result);
        }
      },
      "image/jpeg",
      quality
    );
  }
}

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

export const downloadAsSVGOrVerify = (qrImageData: string | { outerHTML: string; }, verify: Function | undefined, contrast: { color1?: string; color2: string } | undefined): void => {
  const svgData = (typeof qrImageData === 'string' ? qrImageData : qrImageData.outerHTML).replaceAll(' href', ' xlink:href');
  const data = new Blob([svgData], { type: 'image/svg+xml' });
  if (verify) { // @ts-ignore
    if (contrast && delta(getRGB(contrast.color1), getRGB(contrast.color2)) <= 45) {
      verify({ readable: false });
    } else {
      QrScanner.scanImage(data, { returnDetailedScanResult: true })
        .then(() => verify({ readable: true })).catch(() => verify({ readable: false }));
    }
  } else {
    const element = document.createElement('a');
    element.href = URL.createObjectURL(data);
    element.download = 'qrLynk.svg';
    document.body.appendChild(element);
    element.click();
    element.remove();
  }
};

export const downloadAsImg = async (svgData: string | { outerHTML: string | number | boolean; }, frame: FramesType | { type: string; }, verify: Function | undefined, contrast: any | undefined, asJpg?: boolean): Promise<void> => {
  const base64doc = window.btoa(decodeURIComponent(encodeURIComponent(typeof svgData === 'string' ? svgData : svgData.outerHTML)));
  const imageToHandle = document.createElement('img');
  imageToHandle.src = 'data:image/svg+xml;base64,' + base64doc;
  const canvas = document.createElement('canvas');
  imageToHandle.onload = () => {
    const w: number = 280 * 5;
    const h: number = (frame.type !== '' && frame.type !== '/frame/frame0.svg' ? 330 : 280) * 5; // @ts-ignore
    canvas.setAttribute('width', w); // @ts-ignore
    canvas.setAttribute('height', h);
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    context?.clearRect(0, 0, w, h); // @ts-ignore
    context.drawImage(imageToHandle, 0, 0, w, h);
    const data = canvas.toDataURL( `image/${!asJpg ? 'png' : 'jpeg'}`, 1);
    if (!verify) {
      const anchor = document.createElement('a');
      anchor.download = `qrLynk.${!asJpg ? 'png' : 'jpg'}`;
      anchor.href = data;
      anchor.click();
      anchor.remove();
    } else { // @ts-ignore
      if (contrast && delta(getRGB(contrast.color1), getRGB(contrast.color2)) <= 45) {
        verify({ readable: false });
      } else {
        QrScanner.scanImage(data, { returnDetailedScanResult: true })
          .then(() => verify({ readable: true })).catch(() => verify({ readable: false }));
      }
    }
    imageToHandle.remove();
    canvas.remove();
  }
};

export const getFrame = (frame: FramesType): string => {
  let result: string;
  const defaultColor: string = '#000000';
  const renderFrameText = () => frame.text !== undefined ? frame.text : 'SCAN ME' as string;
  if (frame.type === '/frame/frame0.svg') {
    result = frame0(frame.color);
  } else if (frame.type === '/frame/frame1.svg') {
    result = frame1(frame.color, renderFrameText(), frame.textColor || '#ffffff', frame.textUp);
  } else if (frame.type === '/frame/frame2.svg') {
    result = frame2(frame.color, renderFrameText(), frame.textColor || defaultColor, frame.textUp);
  } else if (frame.type === '/frame/frame3.svg') {
    result = frame3(frame.color, renderFrameText(), frame.textColor || defaultColor, frame.textUp);
  } else if (frame.type === '/frame/frame4.svg') {
    result = frame4(frame.color, renderFrameText(), frame.textColor || defaultColor, frame.textUp);
  } else if (frame.type === '/frame/frame5.svg') {
    result = frame5(frame.color);
  } else if (frame.type === '/frame/frame6.svg') {
    result = frame6(frame.color, renderFrameText(), frame.textColor || defaultColor);
  } else {
    result = frame7(frame.color);
  }
  return result;
}

export function getUuid(): string {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export const getFrameObject = (qrDesign: any) => (
  qrDesign?.frame?.type ? {
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

  if (object.cornersDotOptions?.type === '') {
    object.cornersDotOptions.type = null;
  }
  if (object.cornersSquareOptions?.type === '') {
    object.cornersSquareOptions.type = null;
  }
  return object;
};

export const getBackgroundObject = (qrDesign: any) => (
  !qrDesign?.background?.type ? null : {
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
  qrDesign?.[item] ? {
    topL: qrDesign[item].topL,
    topR: qrDesign[item].topR,
    bottom: qrDesign[item].bottom
  } : null
);

export const handleInitialData = (value: string | null | undefined) => {
  if (!value) {
    return JSON.parse(JSON.stringify(initialOptions));
  }
  const opts = JSON.parse(JSON.stringify(initialOptions));
  opts.data = value;
  return opts;
};

export const dataCleaner = (options: any, mainObj?: boolean) => {
  const data = structuredClone(options);
  const base = ['backgroundOptions', 'cornersDotOptions', 'cornersSquareOptions', 'dotsOptions', 'imageOptions',
    'qrOptions', 'margin', 'type', 'width', 'height', 'image', 'data'] as string[];

  if (!mainObj) {
    [...base, 'qrOptionsId', 'shortLinkId', 'qrData', 'qrDesign', 'id', 'qrType', 'userId'].forEach((x: string) => {
      if (data[x]) { delete data[x]; }
    });
    data?.custom?.forEach((x: any) => { x.expand = getUuid(); });
  } else {
    const checkFor = [...base, 'id', 'userId', 'shortCode', 'qrType', 'mode', 'custom'] as string[];
    Object.keys(data).forEach((x: string) => {
      if (!checkFor.includes(x)) { delete data[x]; }
    });
  }
  return data;
};

export const qrNameDisplayer = (name: string, isDynamic: boolean): string => {
  const types = {
    vcard: 'vCard', sms: 'SMS', wifi: 'WiFi', whatsapp: 'WhatsApp', crypto: 'Crypto Payment', 'vcard+': 'vCard Plus',
    social: 'Social Networks', link: 'Link-In-Bio', donations: 'Donation', fundme: 'Fund me', paylink: 'Send Me Money',
    pdf: 'PDF File', audio: 'Audio File', video: 'Video Files',petId: 'Pet Tag Id', linkedLabel: 'Smart Label', findMe:"Find Me"
  } // @ts-ignore
  if (types[name] !== undefined) { return types[name]; }
  if (name === 'web') { return isDynamic ? 'Short URL' : 'Website'; }
  return capitalize(name);
}

const clearItem = (item: string): string => {
  if (item === 'vcard+') { return 'vcard'; }
  if (item === 'link') { return 'links'; }
  if (item === 'donations') { return 'donation'; }
  return item;
};

export const cleanSelectionForMicrositeURL = (item: string, isDynamic: boolean, forSrc?: boolean): string => {
  if (item === 'web') { return 'https://a-qr.link/zDexu6'; }

  // if (!forSrc) {
  //   switch (item) {
  //     case 'business' : { return 'https://a-qr.link/uLDANI'; }
  //     case 'vcard+' : { return 'https://a-qr.link/OPLGC3'; }
  //     case 'social' : { return 'https://a-qr.link/nIF867'; }
  //     case 'link' : { return 'https://a-qr.link/DOBwac'; }
  //     case 'coupon' : { return 'https://a-qr.link/jaJws0'; }
  //     case 'donation' : { return 'https://a-qr.link/KiajsU'; }
  //     case 'pdf' : { return 'https://a-qr.link/5iuiJf'; }
  //     case 'audio' : { return 'https://a-qr.link/ao4ZUe'; }
  //     case 'gallery' : { return 'https://a-qr.link/DyhL4H'; }
  //     case 'video' : { return 'https://a-qr.link/AD3yLH'; }
  //   }
  // }

  if (isDynamic) {
    return `${process.env.MICRO_SITES_BASE_URL}/sample/${clearItem(item)}`;
  }

  return `sample qr ${clearItem(item)}`;
};

export const getSx = (theme: any) => ({
  border: `solid 1px ${theme.palette.primary.main}`, borderRadius: '100%', width: '40px', height: '40px', my: 'auto', p: '5px', color: theme.palette.primary.main
});

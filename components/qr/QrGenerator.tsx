import {forwardRef, useEffect, useState} from 'react';

import parse from 'html-react-parser';

// @ts-ignore
import {renderToString} from "react-dom/server";

import {originalDimensions} from '../../helpers/qr/data';
import {BackgroundType, CornersAndDotsType, FramesType, OptionsType} from './types/types';
import {getFrame} from '../../helpers/qr/helpers';
import {QrGeneratorProps} from "./auxFunctions";
import RenderLogoBack from "./qrHelp/RenderLogoBack";
import RenderLogo from "./qrHelp/RenderLogo";

export const handleQrData = (qrObject: OptionsType, overrideValue?: string) => {
  const opts = structuredClone(qrObject) as any;

  if (Boolean(opts.image)) { // @ts-ignore
    opts.image = null;
  }

  if (Boolean(overrideValue)) { // @ts-ignore
    opts.data = overrideValue;
  }

  if (Boolean(opts.qrOptions) && Boolean(opts.data)) {
    opts.qrOptions.typeNumber = opts.data.length > 24 ? 0 : 3;

    if (typeof window !== 'undefined') {
      const QRCodeStyling = require('qr-code-styling');
      return new QRCodeStyling(opts);
    }
  }

  return null;
};

export const generateSVGObj = (
  qrCode?: any, frame?: FramesType | null, background?: BackgroundType | null, cornersData?: CornersAndDotsType | null,
  dotsData?: CornersAndDotsType | null, command?: () => void, hidden?: boolean | false, ref?: HTMLDivElement, logo?: string | null) => {

  if (qrCode?._svg?.outerHTML) {
    let qrData = qrCode._svg.outerHTML;

    let posXY = 0;
    let sizeWH = originalDimensions;

    const isFramed = Boolean(frame?.type);

    if (isFramed) {
      posXY = 10;
      sizeWH = originalDimensions - 20;
    }

    const isFrm6 = Boolean(frame?.type === '/frame/frame6.svg');
    const isFrm7 = Boolean(frame?.type === '/frame/frame7.svg');
    if (isFrm6) {
      sizeWH -= 20;
    } else if (isFrm7) {
      sizeWH -= 45;
    }

    // @ts-ignore
    const parsed = { ...parse(qrData) }; // these clones are meant to avoid a "object is not extensible" error

    const posX = posXY + (isFrm6 ? 27 : 0) + (isFrm7 ? 37 : 0);
    const posY = posXY + (frame?.textUp && ['/frame/frame1.svg', '/frame/frame2.svg', '/frame/frame3.svg', '/frame/frame4.svg'] // @ts-ignore
      .includes(frame.type) ? 47 : 0) + (isFrm6 ? 72 : 0) + (isFrm7 ? 47 : 0);

    parsed.props = {
      ...parsed.props,
      x: posX,
      y: posY,
      height: sizeWH,
      width: sizeWH,
      viewBox: `0 0 ${originalDimensions} ${originalDimensions}`
    };

    const updtColor = (item: number | string, fillColor: string): void => {
      parsed.props.children = [...parsed.props.children];

      parsed.props.children[item] = { ...parsed.props.children[item] };
      parsed.props.children[item].props = { ...parsed.props.children[item].props, fill: fillColor };
    };

    if (cornersData) {
      updtColor(3, cornersData.topL);
      updtColor(5, cornersData.topR);
      updtColor(7, cornersData.bottom);
    }

    if (dotsData) {
      updtColor(4, dotsData.topL);
      updtColor(6, dotsData.topR);
      updtColor(8, dotsData.bottom);
    }

    let backSize = sizeWH;
    let imageSize = backSize;
    let imgPosX = posXY;
    let imgPosY = posXY;

    const back = background?.file;
    if (back) {
      if (background.size < 1) {
        backSize = sizeWH * background.size;
        posXY = Math.round((originalDimensions - backSize) / 2);
      } else if (background.size > 1) {
        const dimensions = originalDimensions - (Boolean(frame?.type) ? 20 : 0);
        const newSize = Math.round(dimensions / background.size);
        const newPos = Math.round((originalDimensions - newSize) / 2);
        parsed.props.x = newPos;
        parsed.props.y = newPos;
        parsed.props.width = newSize;
        parsed.props.height = newSize;
      }
      imageSize *= background.imgSize;

      const basePos = Math.round((backSize - imageSize) / 2);
      const adjustment = isFramed ? 10 : 0;
      imgPosX = basePos + Math.round(background.x * backSize / 100) + adjustment;
      imgPosY = basePos - Math.round(background.y * backSize / 100) + adjustment;
    }

    if (command !== undefined) {
      command();
    }

    const logoIsAvailable = logo !== undefined && logo !== null && logo?.trim()?.length > 0;

    return ( // @ts-ignore
      <svg viewBox={`0 0 ${originalDimensions} ${!isFramed || frame.type === '/frame/frame0.svg' ? originalDimensions : '330'}`} // @ts-ignore
           xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" ref={ref} id="qrCodeReferenceId">
        {back && background.invert && (
          <filter id="inverse-difference" colorInterpolationFilters="sRGB">
            <feComponentTransfer result="invert">
              <feFuncR type="table" tableValues="1 0" />
              <feFuncG type="table" tableValues="1 0" />
              <feFuncB type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feImage xlinkHref="#background" result="base" x="0" y="0" width={sizeWH} height={sizeWH} />
            <feBlend in="invert" in2="base" mode="difference" />
          </filter>
        )}
        {(!qrCode?._options?.backgroundOptions?.color.startsWith('#ffffff') && frame && // @ts-ignore
            ['/frame/frame5.svg', '/frame/frame6.svg', '/frame/frame7.svg'].includes(frame.type)) && (
              <rect width={280} height={330} x={0} y={0} fill={qrCode._options.backgroundOptions.color} />
        )}
        <g id="background">
          <rect width={backSize}
                height={backSize}
                x={posXY}
                y={posXY}
                fill={background?.backColor || '#ffffff'}
          />
          {back && (
            <image
              xlinkHref={back}
              width={imageSize}
              height={imageSize}
              x={imgPosX}
              y={imgPosY}
              opacity={background.opacity / 100} />
          )}
        </g>
        {!hidden && <g filter={background?.invert ? "url(#inverse-difference)" : undefined}>
          {parsed}
        </g>}
        {logoIsAvailable && <RenderLogoBack sizeWH={sizeWH} posX={posX} posY={posY} />}
        {logoIsAvailable && <RenderLogo sizeWH={sizeWH} posX={posX} posY={posY} logo={logo} />}
        {/* @ts-ignore */}
        {isFramed && parse(getFrame(frame))}
      </svg>
    );
  }
  return null;
};

const QrGenerator = ({hidden, options, frame, background, cornersData, dotsData, overrideValue, command}: QrGeneratorProps, ref: HTMLDivElement) => {
  const [qrCode, setQrCode] = useState(handleQrData(options, overrideValue));

  const generateSVG = () => {
    return generateSVGObj(qrCode, frame, background, cornersData, dotsData, command, hidden, ref, options.image);
  };

  useEffect(() => {
    if (qrCode) {
      setQrCode(handleQrData(options, overrideValue));
    }
  }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

  return generateSVG();
}

// @ts-ignore
export default forwardRef(QrGenerator);

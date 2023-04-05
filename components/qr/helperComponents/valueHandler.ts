import {DEFAULT_COLORS} from "../constants";
import {CustomType} from "../types/types";

export default function valueHanler(prop: string, data: any, payload: any, foreImg: any, backImg: any,
                                    micrositeBackImage: any, setData: Function, setBackImg: Function,
                                    setForeImg: Function, setMicrositeBackImage: Function) {
  if (payload === undefined) {
    setData((prev: any) => {
      const newData = {...prev};
      if (prop === 'backgndImg' && prev?.backgndImg?.[0]?.Key) { newData.prevBackImg = prev.backgndImg[0].Key; }
      if (prop === 'foregndImg') {
        if (prev?.foregndImg?.[0]?.Key) { newData.prevForeImg = prev.foregndImg[0].Key; }
        if (newData.profileImageVertical !== undefined) { delete newData.profileImageVertical; }
        if (newData.profileImageSize !== undefined) { delete newData.profileImageSize; }
        if (newData.foregndImgType !== undefined) { delete newData.foregndImgType; }
      }
      if (prop === 'micrositeBackImage') {
        if (prev?.micrositeBackImage?.[0]?.Key) { newData.prevMicrositeImg = prev.micrositeBackImage[0].Key; }
        if (newData.micrositeBackImageBlurness !== undefined) { delete newData.micrositeBackImageBlurness; }
        if (newData.micrositeBackImageOpacity !== undefined) { delete newData.micrositeBackImageOpacity; }
      }
      delete newData[prop];
      return newData;
    });
    if (prop === 'micrositeBackImage' && micrositeBackImage) { setMicrositeBackImage(undefined); }
    if (prop === 'backgndImg' && backImg) { setBackImg(undefined); }
    if (prop === 'foregndImg' && foreImg) { setForeImg(undefined); }
  } else if (!prop.startsWith('both')) {
    if (prop === 'micrositeBackImage' && micrositeBackImage !== undefined) {
      setMicrositeBackImage(undefined);
      setData((prev: any) => ({...prev, micrositeBackImage: payload, prevMicrositeImg: prev.micrositeBackImage[0].Key}));
    } else if (prop === 'backgndImg' && backImg !== undefined) {
      setBackImg(undefined);
      setData((prev: any) => ({...prev, backgndImg: payload, prevBackImg: prev.backgndImg[0].Key}));
    } else if (prop === 'foregndImg' && foreImg !== undefined) {
      setForeImg(undefined);
      setData((prev: any) => ({...prev, foregndImg: payload, prevForeImg: prev.foregndImg[0].Key}));
    } else if (payload.clear || (((prop === "globalFont" && payload === "Default") ||
        (['buttonsFont', 'titlesFont', 'messagesFont', 'titlesFontSize', 'messagesFontSize', 'buttonsFontSize',
            'subtitlesFontSize', 'subtitlesFont', 'layout'].includes(prop) && (['none', 'default'].includes(payload))
        )) && data[prop] === payload) || (prop === 'buttonShape' && payload === '1') ||
      (prop === 'buttonBack' && payload === 'default') || (prop === 'autoOpen' && !payload)) {
      setData((prev: any) => {
        const newData = {...prev};
        delete newData[prop];
        if (prop === 'buttonBack' && payload === 'default' && newData.buttonBackColor !== undefined) {
          delete newData.buttonBackColor;
        }
        return newData;
      });
    } else if (prop === 'backgroundType') {
      setData((prev: any) => {
        const newData = {...prev};
        if (newData.backgroundColor !== undefined) { delete newData.backgroundColor; }
        if (newData.backgroundColorRight !== undefined) { delete newData.backgroundColorRight; }
        if (newData.backgroundDirection !== undefined) { delete newData.backgroundDirection; }
        newData.backgroundType = payload?.target?.value || payload;
        if (newData.backgroundType !== 'image' && newData.micrositeBackImage !== undefined) {
          setMicrositeBackImage(undefined);
          delete newData.micrositeBackImage;
          if (newData.micrositeBackImageOpacity) { delete newData.micrositeBackImageOpacity; }
          if (newData.micrositeBackImageBlurness) { delete newData.micrositeBackImageBlurness; }
        }
        return newData;
      });
    } else if (prop === 'buttonBack') {
      setData((prev: any) => {
        const newData = {...prev, buttonBackColor: payload === 'solid' ? DEFAULT_COLORS.p : 'unset'};
        newData[prop] = payload.target?.value !== undefined ? payload.target.value : payload;
        if (payload === 'gradient' && newData.buttonsOpacity !== undefined) { delete newData.buttonsOpacity; }
        if (payload === 'solid' && newData.custom?.length) {
          newData.custom.forEach((x: CustomType) => {
            if (x.component === 'socials' && x.data?.invertIconColors !== undefined) {
              delete x.data.invertIconColors;
            }
          });
        }
        return newData;
      });
    } else if (prop === 'buttonShape') {
      setData((prev: any) => {
        const newData = {...prev, [prop]: payload};
        if (newData.flipHorizontal !== undefined) { delete newData.flipHorizontal; }
        if (newData.flipVertical !== undefined && !['5', '6', '7'].includes(payload)) { delete newData.flipVertical; }
        if (newData.alternate !== undefined && !['5', '6', '7'].includes(payload)) { delete newData.alternate; }
        if (payload !== '4' && newData.buttonBorders !== undefined) { delete newData.buttonBorders; }
        return newData;
      });
    } else if (prop === 'buttonShadowDisplacement') {
      setData((prev: any) => {
        const newData = {...prev, buttonShadowDisplacement: payload};
        if (newData.buttonShadow !== undefined) { delete newData.buttonShadow; }
        if (newData.buttonsOpacity !== undefined) { delete newData.buttonsOpacity; }
        if (newData.buttonBorderWeight === 'weight') { newData.buttonShadowDisplacement = 'downRight'; }
        return newData;
      });
    } else if (prop === 'layout' && typeof payload === 'string') {
      setData((prev: any) => {
        const newData = {...prev};
        let newPayload = `${payload}`;
        if (!newPayload.includes('empty') && newData.upperHeight === 'narrow') { delete newData.upperHeight; }
        if (!newPayload.includes('entire') && !newPayload.includes('sections')) {
          let index = newPayload.indexOf('#');
          if (index !== -1) { newPayload = newPayload.slice(0, index); }
          index = newPayload.indexOf('%');
          if (index !== -1) { newPayload = newPayload.slice(0, index); }
        }

        newData.layout = newPayload;
        if (payload.startsWith('empty') && payload.includes('Left')) { newData.layout = 'empty'; }
        return newData;
      });
    } else {
      setData((prev: any) => {
        const newData = {...prev};
        newData[prop] = payload.target?.value !== undefined ? payload.target.value : payload;
        if (['micrositeBackImage','backgndImg','foregndImg'].includes(prop)) { newData.forceChange = !Boolean(newData.forceChange); }
        if (prop === 'footerKind') {
          if (payload === 'default') { delete newData.footerKind; }
          if (payload !== 'custom' && newData.customFooter !== undefined) { delete newData.customFooter; }
        }
        if (prop === 'micrositeBackImageBlurness' && newData.micrositeBackImageBlurness && payload === 0) {
          delete newData.micrositeBackImageBlurness;
        }
        if (prop === 'micrositeBackImageOpacity' && newData.micrositeBackImageOpacity && payload === 0) {
          delete newData.micrositeBackImageOpacity;
        }
        if (prop.toUpperCase().includes('FONT') && payload === 'default') {
          delete newData[prop];
        }
        if (prop === 'buttonBorderWeight' && newData.buttonShadowDisplacement !== undefined && payload === 'weight') {
          newData.buttonShadowDisplacement = 'downRight';
        }
        if (['profileImageVertical', 'profileImageSize', 'buttonsSeparation', 'upperHeight', 'sharerPosition'].includes(prop) && payload === 'default') {
          delete newData[prop];
        } else if (['flipHorizontal', 'flipVertical', 'buttonShadow', 'buttonCase'].includes(prop) && !payload && newData[prop] !== undefined) {
          delete newData[prop];
        } else if (prop === 'buttonBorderStyle') {
          if (payload !== 'two' && newData.buttonBorderColors !== undefined) { newData.buttonBorderColors = undefined; }
          if (payload === 'noBorders') {
            newData.buttonBorderStyle = undefined;
            if (newData.buttonBorderWeight !== undefined) { newData.buttonBorderWeight = undefined; }
            if (newData.buttonBorderType !== undefined) { newData.buttonBorderType = undefined; }
            if (newData.buttonShadowDisplacement !== undefined) { newData.buttonShadowDisplacement = undefined; }
          }
        }
        return newData;
      });
    }
  } else if ((prop === 'both' && (payload.p !== DEFAULT_COLORS.p || payload.s !== DEFAULT_COLORS.s)) ||
    (prop === 'both-gradient' && (payload.p !== DEFAULT_COLORS.s || payload.s !== DEFAULT_COLORS.p) )) {
    const isMain = prop === 'both';
    setData((prev: any) => ({...prev, [isMain ? 'primary' : 'backgroundColor']: payload.p, [isMain ? 'secondary' : 'backgroundColorRight']: payload.s}));
  } else {
    setData((prev: any) => {
      const newData = {...prev};
      if (prop === 'both') {
        if (newData.primary) { delete newData.primary; }
        if (newData.secondary) { delete newData.secondary; }
      } else {
        if (newData.backgroundColor) { delete newData.backgroundColor; }
        if (newData.backgroundColorRight) { delete newData.backgroundColorRight; }
      }
      return newData;
    });
  }
}

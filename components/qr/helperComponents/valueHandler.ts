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
        if (newData.profileImageVertical !== undefined) { newData.profileImageVertical = undefined; }
        if (newData.profileImageSize !== undefined) { newData.profileImageSize = undefined; }
        if (newData.foregndImgType !== undefined) { newData.foregndImgType = undefined; }
      }
      if (prop === 'micrositeBackImage') {
        if (prev?.micrositeBackImage?.[0]?.Key) { newData.prevMicrositeImg = prev.micrositeBackImage[0].Key; }
        if (newData.micrositeBackImageBlurness !== undefined) { newData.micrositeBackImageBlurness = undefined; }
        if (newData.micrositeBackImageOpacity !== undefined) { newData.micrositeBackImageOpacity = undefined; }
      }
      if (prop === 'secret' && newData.secretOps !== undefined) { newData.secretOps = undefined; }
      newData[prop] = undefined;
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
        newData[prop] = undefined;
        if (prop === 'buttonBack' && payload === 'default' && newData.buttonBackColor !== undefined) {
          newData.buttonBackColor = undefined;
        }
        return newData;
      });
    } else if (prop === 'backgroundType') {
      setData((prev: any) => {
        const newData = {...prev};
        if (newData.backgroundColor !== undefined) { newData.backgroundColor = undefined; }
        if (newData.backgroundColorRight !== undefined) { newData.backgroundColorRight = undefined; }
        if (newData.backgroundDirection !== undefined) { newData.backgroundDirection = undefined; }
        newData.backgroundType = payload?.target?.value || payload;
        if (newData.backgroundType !== 'image' && newData.micrositeBackImage !== undefined) {
          setMicrositeBackImage(undefined);
          newData.micrositeBackImage = undefined;
          if (newData.micrositeBackImageOpacity) { newData.micrositeBackImageOpacity = undefined; }
          if (newData.micrositeBackImageBlurness) { newData.micrositeBackImageBlurness = undefined; }
        }
        return newData;
      });
    } else if (prop === 'buttonBack') {
      setData((prev: any) => {
        const newData = {...prev, buttonBackColor: payload === 'solid' ? DEFAULT_COLORS.p : 'unset'};
        newData[prop] = payload.target?.value !== undefined ? payload.target.value : payload;
        if (payload === 'gradient' && newData.buttonsOpacity !== undefined) { newData.buttonsOpacity = undefined; }
        if (payload === 'solid' && newData.custom?.length) {
          newData.custom.forEach((x: CustomType) => {
            if (x.component === 'socials' && x.data?.invertIconColors !== undefined) { x.data.invertIconColors = undefined; }
          });
        }
        return newData;
      });
    } else if (prop === 'buttonShape') {
      setData((prev: any) => {
        const newData = {...prev, [prop]: payload};
        if (newData.flipHorizontal !== undefined) { newData.flipHorizontal = undefined; }
        if (newData.flipVertical !== undefined && !['5', '6', '7'].includes(payload)) { newData.flipVertical = undefined; }
        if (newData.alternate !== undefined && !['5', '6', '7'].includes(payload)) { newData.alternate = undefined; }
        if (payload !== '4' && newData.buttonBorders !== undefined) { newData.buttonBorders = undefined; }
        return newData;
      });
    } else if (prop === 'buttonShadowDisplacement') {
      setData((prev: any) => {
        const newData = {...prev, buttonShadowDisplacement: payload};
        if (newData.buttonShadow !== undefined) { newData.buttonShadow = undefined; }
        if (newData.buttonsOpacity !== undefined) { newData.buttonsOpacity = undefined; }
        if (newData.buttonBorderWeight === 'weight') { newData.buttonShadowDisplacement = 'downRight'; }
        return newData;
      });
    } else if (prop === 'layout' && typeof payload === 'string') {
      setData((prev: any) => {
        const newData = {...prev};
        let newPayload = `${payload}`;
        if (!newPayload.includes('empty') && ['narrow', 'small'].includes(newData.upperHeight)) { newData.upperHeight = undefined; }
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
    } else if (prop === 'hideQrForSharing') {
      setData((prev: any) => {
        const newData = {...prev, hideQrForSharing: payload};
        if (!payload && newData.hideQrForSharing !== undefined) { newData.hideQrForSharing = undefined; }
        return newData;
      });
    } else if (prop === 'secretOps') {
      setData((prev: any) => {
        const newData = {...prev};

        const handler = (opType: 'e' | 'l') => {
          if (!newData.secretOps?.includes(opType)) {
            if (newData.secretOps === undefined) { newData.secretOps = ''; }
            newData.secretOps += opType;
          } else {
            newData.secretOps = newData.secretOps.replace(opType, '');
          }
        }

        if (payload === 'edit') { handler('e'); }
        if (payload === 'lock') { handler('l'); }
        if (!Boolean(newData.secretOps?.length)) { delete newData.secretOps; }
        return newData;
      });
    } else {
      setData((prev: any) => {
        const newData = {...prev};
        newData[prop] = payload.target?.value !== undefined ? payload.target.value : payload;
        if (prop === 'sharerPosition' && payload === 'no' && !newData.hideQrForSharing) {
          newData.hideQrForSharing = true;
        }
        if (['micrositeBackImage','backgndImg','foregndImg'].includes(prop)) { newData.forceChange = !Boolean(newData.forceChange); }
        if (prop === 'footerKind') {
          if (payload === 'default') { newData.footerKind = undefined; }
          if (payload !== 'custom' && newData.customFooter !== undefined) { newData.customFooter = undefined; }
        }
        if (prop === 'micrositeBackImageBlurness' && newData.micrositeBackImageBlurness && payload === 0) {
          newData.micrositeBackImageBlurness = undefined;
        }
        if (prop === 'micrositeBackImageOpacity' && newData.micrositeBackImageOpacity && payload === 0) {
          newData.micrositeBackImageOpacity = undefined;
        }
        if (prop.toUpperCase().includes('FONT') && payload === 'default') {
          newData[prop] = undefined;
        }
        if (prop === 'buttonBorderWeight' && newData.buttonShadowDisplacement !== undefined && payload === 'weight') {
          newData.buttonShadowDisplacement = 'downRight';
        }
        if (['profileImageVertical', 'profileImageSize', 'buttonsSeparation', 'upperHeight', 'sharerPosition'].includes(prop) && payload === 'default') {
          newData[prop] = undefined;
        } else if (['flipHorizontal', 'flipVertical', 'buttonShadow', 'buttonCase'].includes(prop) && !payload && newData[prop] !== undefined) {
          newData[prop] = undefined;
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
        if (newData.primary) { newData.primary = undefined; }
        if (newData.secondary) { newData.secondary = undefined; }
      } else {
        if (newData.backgroundColor) { newData.backgroundColor = undefined; }
        if (newData.backgroundColorRight) { newData.backgroundColorRight = undefined; }
      }
      return newData;
    });
  }
}

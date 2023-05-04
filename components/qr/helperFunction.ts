import {ChangeEvent} from "react";
import {DataType, Type} from "./types/types";

const valuesHanlder = (setData: Function, item: string, payload: ChangeEvent<HTMLInputElement> | any, index?: number) => {
  const value = payload?.target ? (item === 'includeExtraInfo' ? payload.target.checked : payload.target.value) : payload;

  setData((prev: DataType) => {
    const newData = {...prev};
    if (index !== undefined && index !== -1) { // @ts-ignore
      const element = newData.custom[index];
      if (!element.data) { element.data = {}; }
      const elementData = element.data as Type;
      if (item.includes('.')) {
        const data = item.split('.');
        const obj = data[0];
        const prop = data[1];
        if ((typeof payload === 'boolean' && payload) || (typeof payload === 'string' && payload.trim().length)) { // @ts-ignore
          if (!elementData[obj]) { elementData[obj] = {} as any; } // @ts-ignore
          elementData[obj][prop] = payload;
        } else { // @ts-ignore
          delete elementData[obj][prop]; // @ts-ignore
          if (elementData[obj][`${prop}Icon`]) { delete elementData[obj][`${prop}Icon`]; } // @ts-ignore
          if (!Object.keys(elementData[obj]).length) { delete elementData[obj]; }  // @ts-ignore
          Object.keys(elementData).forEach(x => { if (x.endsWith('_Custom')) { delete elementData[x]; } });
        }
      } else if (item === 'tags') {
        if (Array.isArray(payload)) {
          if (payload.length) {
            elementData.tags = payload;
          } else if (elementData.tags !== undefined) {
            delete elementData.tags;
          }
        } else if (typeof payload === 'string') {
          elementData.tags?.push(payload);
        }
      } else if (['hideHeadLine', 'centerHeadLine', 'hideHeadLineIcon'].includes(item)) { // @ts-ignore
        if (elementData[item] !== undefined && payload === false) { // @ts-ignore
          delete elementData[item];
        } else { // @ts-ignore
          element.data[item] = true;
          if (item === 'hideHeadLine') {
            if (elementData.centerHeadLine !== undefined) { delete elementData.centerHeadLine; }
            if (elementData.hideHeadLineIcon !== undefined) { delete elementData.hideHeadLineIcon; }
            if (elementData.customFont !== undefined) { delete elementData.customFont; }
            if (elementData.headLineFontStyle !== undefined) { delete elementData.headLineFontStyle; }
            if (elementData.headlineFont !== undefined) { delete elementData.headlineFont; }
            if (elementData.headlineFontSize !== undefined) { delete elementData.headlineFontSize; }
            if (elementData.sectionArrangement !== undefined) { delete elementData.sectionArrangement; }
          }
        }
      } else if (item === 'easiness') {
        if (!elementData.easiness) { elementData.easiness = {}; } // @ts-ignore
        if (!elementData.easiness[payload]) { // @ts-ignore
          elementData.easiness[payload] = true;
        } else { // @ts-ignore
          delete elementData.easiness[payload];
          if (!Object.keys(elementData.easiness).length) { delete elementData.easiness; }
        }
      } else if ((typeof value === "string" && value.length) || payload) {
        if ((['topSpacing', 'bottomSpacing', 'headlineFontSize', 'headlineFont'].includes(item) &&
          typeof value === "string" && value.toLowerCase() === 'default') ||
          (item === 'headlineFont' && value === 'none') || (item === 'headLineFontStyle' && value === '')) { // @ts-ignore
          delete elementData[item];
        } else if (item === 'includeExtraInfo' && !value && elementData.includeExtraInfo !== undefined) {
          delete elementData.includeExtraInfo;
        } else if (item === 'reset' && payload==='reset') {
          if (elementData.headlineFont !== undefined) { delete elementData.headlineFont; }
          if (elementData.headlineFontSize !== undefined) { delete elementData.headlineFontSize; }
          if (elementData.headLineFontStyle !== undefined) { delete elementData.headLineFontStyle; }
          if (elementData.topSpacing !== undefined) { delete elementData.topSpacing; }
          if (elementData.bottomSpacing !== undefined) { delete elementData.bottomSpacing; }
          if (elementData.customFont !== undefined) { delete elementData.customFont; }
          if (elementData.sectionArrangement !== undefined) { delete elementData.sectionArrangement; }
          if (elementData.hideHeadLine !== undefined) { delete elementData.hideHeadLine; }
          if (elementData.centerHeadLine !== undefined) { delete elementData.centerHeadLine; }
          if (elementData.hideHeadLineIcon !== undefined) { delete elementData.hideHeadLineIcon; }
        } else if (item === 'sectionArrangement' && value === 'default') {
          delete elementData.sectionArrangement;
        } else {
          if (typeof value === "string" && !value.trim().length) { // @ts-ignore
            delete elementData[item]; // @ts-ignore
            if (elementData[`${item}_Custom`] !== undefined) { delete elementData[`${item}_Custom`]; }
          } else { // @ts-ignore
            elementData[item] = value;
          }
        } // @ts-ignore
      } else if (elementData[item]) {
        if (item === 'customFont') {
          if (elementData.headlineFont !== undefined) { delete elementData.headlineFont; }
          if (elementData.headlineFontSize !== undefined) { delete elementData.headlineFontSize; }
          if (elementData.headLineFontStyle !== undefined) { delete elementData.headLineFontStyle; }
        } // @ts-ignore
        delete elementData[item];
      }
    } else {
      if (item === 'easiness') {
        if (!newData.easiness) { newData.easiness = {}; } // @ts-ignore
        if (!newData.easiness[payload]) { // @ts-ignore
          newData.easiness[payload] = true;
        } else { // @ts-ignore
          delete newData.easiness[payload];
          if (!Object.keys(newData.easiness).length) { delete newData.easiness; }
        }
      } else if ((typeof value === "string" && value.length) || payload) { // @ts-ignore
        newData[item] = value;// @ts-ignore
      } else if (data[item]) { // @ts-ignore
        delete newData[item];
      }
    }
    return newData;
  });
}

export default valuesHanlder;

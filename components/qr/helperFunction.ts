import {ChangeEvent} from "react";
import {DataType, Type} from "./types/types";

const valuesHanlder = (setData: Function, item: string, payload: ChangeEvent<HTMLInputElement> | string | boolean | string[], index?: number) => {
  const value = Array.isArray(payload) || typeof payload === 'string' || typeof payload === 'boolean' ? payload :
    (item === 'includeExtraInfo' ? payload.target.checked : payload.target.value);

  setData((prev: DataType) => {
    const newData = {...prev};
    if (index !== undefined && index !== -1) { // @ts-ignore
      const element = newData.custom[index];
      if (!element.data) { element.data = {}; }
      const elementData = element.data as Type;
      if (item === 'tags') {
        if (Array.isArray(payload)) {
          if (payload.length) {
            elementData.tags = payload;
          } else if (elementData.tags !== undefined) {
            delete elementData.tags;
          }
        } else if (typeof payload === 'string') {
          elementData.tags?.push(payload);
        }
      } else if (['hideHeadLine', 'centerHeadLine'].includes(item)) { // @ts-ignore
        if (elementData[item] !== undefined && (payload === false || reversed)) { // @ts-ignore
          delete elementData[item];
        } else { // @ts-ignore
          element.data[item] = true;
          if (item === 'hideHeadLine' && elementData.centerHeadLine !== undefined) { delete elementData.centerHeadLine; }
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
        if (['topSpacing', 'bottomSpacing'].includes(item) && value === 'default') { // @ts-ignore
          delete elementData[item];
        } else if (item === 'includeExtraInfo' && !value && elementData.includeExtraInfo !== undefined) {
          delete elementData.includeExtraInfo;
        } else {
          if (typeof value === "string" && !value.trim().length) { // @ts-ignore
            delete elementData[item];
          } else { // @ts-ignore
            elementData[item] = value;
          }
        } // @ts-ignore
      } else if (elementData[item]) { // @ts-ignore
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

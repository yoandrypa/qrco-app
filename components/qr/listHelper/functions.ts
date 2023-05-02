import {DataType} from "../types/types";

export const dateHandler = (date: string): string => `${date.startsWith('Yesterday') || date.startsWith('Today') ? ':' : ' at:'} ${date}`;

export const handleProceedWithStatic = (data: DataType) => {
  const newData = structuredClone(data || {});
  if (newData.custom !== undefined && newData.custom.length === 0) {
    delete newData.custom;
  }
  return Object.keys(newData).length > 0;
}

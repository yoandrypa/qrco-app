export const dateHandler = (date: string): string => `${date.startsWith('Yesterday') || date.startsWith('Today') ? ':' : ' at:'} ${date}`;

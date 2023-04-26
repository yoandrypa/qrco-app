import {CustomType} from "./types/types";
import {EMAIL, PHONE, YEAR, ZIP} from "./constants";
import {isValidUrl} from "../../utils";
import {components} from "./renderers/custom/helperFuncs";
import {capitalize} from "@mui/material";

// @ts-ignore
const exists = (x: CustomType, item: string) => x.data?.[item] !== undefined && !x.data[item].trim().length !== 0;

const isEmpty = (x: CustomType) => !Object.keys(x.data || {}).length;

const handlePhones = (x: CustomType, index: number, other?: string, company?: boolean) => {
  const errors = [] as string[];
  const getItem = (item: string): string => `${!company ? '' : 'company'}${!company ? item : capitalize(item)}`; // @ts-ignore
  if (exists(x, getItem('cell')) && !PHONE.test(x.data?.[getItem('cell')] || '')) {
    errors.push(`Enter a valid cell number in ${other ? `${other} ` : ''}section ${index + 1}`);
  } // @ts-ignore
  if (exists(x, getItem('phone')) && !PHONE.test(x.data?.[getItem('phone')] || '')) {
    errors.push(`Enter a valid phone number in ${other ? `${other} ` : ''}section ${index + 1}`);
  }
  if (exists(x, 'whatsapp') && !PHONE.test(x.data?.whatsapp || '')) {
    errors.push(`Enter a valid whatsapp number in ${other ? `${other} ` : ''}section ${index + 1}`);
  } // @ts-ignore
  if (exists(x,  getItem('fax')) && !PHONE.test(x.data?.[getItem('fax')] || '')) {
    errors.push(`Enter a valid fax number in ${other ? `${other} ` : ''}section ${index + 1}`);
  }
  return errors;
}

const handleEmailWeb = (x: CustomType, index: number, other?: string) => {
  const errors = [] as string[];
  if (exists(x, 'email') && !EMAIL.test(x.data?.email || '')) {
    errors.push(`Enter a valid email address in ${other ? `${other} ` : ''}section ${index + 1}`);
  }
  if (exists(x, 'web') && !isValidUrl(x.data?.web || '')) {
    errors.push(`Enter a valid website link in ${other ? `${other} ` : ''}section ${index + 1}`);
  }
  return errors;
}

const handleAction = (x: CustomType, index: number, other?: string) => {
  const errors = [] as string[];
  if (!exists(x, 'urlOptionLabel') || !x.data?.urlOptionLabel?.trim().length) {
    errors.push(`Enter a label for the action button in ${other ? `${other} ` : ''}section ${index + 1}`);
  }
  if (!exists(x, 'urlOptionLink') || !x.data?.urlOptionLink?.trim().length) {
    errors.push(`Enter a website link for the action button in ${other ? `${other} ` : ''}section ${index + 1}`);
  } else if (!isValidUrl(x.data?.urlOptionLink || '')) {
    errors.push(`Enter a valid website link for the action button in ${other ? `${other} ` : ''}section ${index + 1}`);
  }
  return errors;
}

const validator = (custom: CustomType[], forceExtra: boolean, ignore?: boolean) => {
  if (ignore) {
    return [];
  }
  let errors = [] as string[];
  if (!custom.length) {
    errors.push('Add at least one section');
  } else {
    custom.forEach((x: CustomType, index: number) => {
      if (x.component !== 'date' && isEmpty(x)) { // @ts-ignore
        errors.push(`Make sure the ${components[x.component]?.name.toLowerCase() || x.component} section ${index + 1} is not empty`);
      } else { // @ts-ignore
        if (x.component === 'address' && exists(x, 'zip') && !ZIP.test(x.data.zip)) {
          errors.push(`The zip code is not valid in address section ${index + 1}`);
        }
        if (x.component === 'company') {
          if (!exists(x, 'company')) {
            errors.push(`Enter the company name in section ${index + 1}`);
          }
          if (exists(x, 'companyWebSite') && !isValidUrl(x.data?.companyWebSite || '')) {
            errors.push(`Enter a valid company website link in section ${index + 1}`);
          }
          if (exists(x, 'companyEmail') && !EMAIL.test(x.data?.companyEmail || '')) {
            errors.push(`Enter a valid company email address in section ${index + 1}`);
          }
          if (exists(x, 'companyCell') && !PHONE.test(x.data?.companyCell || '')) {
            errors.push(`Enter a valid company cell number in section ${index + 1}`);
          }
          if (exists(x, 'companyPhone') && !PHONE.test(x.data?.companyPhone || '')) {
            errors.push(`Enter a valid company phone number in section ${index + 1}`);
          }
          if (exists(x, 'companyFax') && !PHONE.test(x.data?.companyFax || '')) {
            errors.push(`Enter a valid company fax number in section ${index + 1}`);
          }
        }
        if (x.component === 'justEmail' && !EMAIL.test(x.data?.email || '')) {
          errors.push(`Enter a valid email address in section ${index + 1}`);
        }
        if (x.component === 'web' && !isValidUrl(x.data?.web || '')) {
          errors.push(`Enter a valid website link in section ${index + 1}`);
        }
        if (x.component === 'email') {
          const errorsWebEmail = handleEmailWeb(x, index);
          if (errorsWebEmail.length) { errors = [...errors, ...errorsWebEmail]; }
        }
        if (x.component === 'easiness' && !Object.keys(x.data?.easiness || {}).length) {
          errors.push(`Select at least an easiness in section ${index + 1}`);
        }
        if (['links', 'buttons'].includes(x.component)) {
          let name = x.component.slice(0, -1);
          if (!x.data?.links?.length) {
            errors.push(`Enter at least one ${name} in section ${index + 1} (${x.component})`);
          } else {
            if (!x.data?.linksOnlyLinks && x.data.links.some(xx => !xx.label?.trim().length)) {
                errors.push(`Missing at least one ${name} label in section ${index + 1} (${x.component})`);
              }
            if (x.data?.links.some(xx => !xx.link?.trim().length)) {
              errors.push(`Missing at least one ${name === 'link' ? 'link' : 'item'} in section ${index + 1} (${x.component})`);
            } else {
              if (x.data?.links.some(xx => (xx.type === undefined || xx.type === 'link') && !isValidUrl(xx.link))) {
                errors.push(`There is at least one invalid link in section ${index + 1} (${x.component})`);
              }
              if (x.data?.links.some(xx => xx.type === 'email' && !EMAIL.test(xx.link))) {
                errors.push(`There is at least one invalid button email in section ${index + 1} (${x.component})`);
              }
              if (x.data?.links.some(xx => ['call', 'sms', 'whatsapp'].includes(xx.type || '') && !PHONE.test(xx.link))) {
                errors.push(`There is at least one invalid button phone or whatsapp number in section ${index + 1} (${x.component})`);
              }
            }
          }
        }
        if (x.component === 'phones') {
          const phoneErrors = handlePhones(x, index);
          if (phoneErrors.length) { errors = [...errors, ...phoneErrors]; }
        }
        if (['gallery', 'pdf', 'audio', 'video'].includes(x.component) && !x.data?.files?.length) {
          errors.push(`Enter at least one asset in section ${x.component.toUpperCase()} ${index + 1}`);
        }
        if (x.component === 'presentation') {
          if (!exists(x, 'firstName')) {
            errors.push(`Enter the first name in section ${index + 1}`);
          }
          if (x.data?.includeExtraInfo || forceExtra) {
            const phoneErrors = handlePhones(x, index, 'presentation');
            if (phoneErrors.length) { errors = [...errors, ...phoneErrors]; }
            const webEmailErrors = handleEmailWeb(x, index, 'presentation');
            if (webEmailErrors.length) { errors = [...errors, ...webEmailErrors]; }
            if (exists(x, 'zip') && !ZIP.test(x.data?.zip || '')) {
              errors.push(`The zip code is not valid in presentation section ${index + 1}`);
            }
          }
        }
        if (x.component === 'opening' && !Object.keys(x.data?.openingTime || {}).length) {
          errors.push(`Enter at least one opening time in section ${index + 1}`);
        }
        if (x.component === 'socials') {
          if (!x.data?.socials?.length) {
            errors.push(`Enter at least one social network in section ${index + 1}`);
          } else {
            if (x.data.socials.some(xx => !xx.value?.trim().length)) {
              errors.push(`There is at least one missing social network in section ${index + 1}`);
            } else {
              const ind = x.data.socials.findIndex(xx => xx.network === 'whatsapp');
              if (ind !== -1 && !PHONE.test(x.data.socials[ind].value || '')) {
                errors.push(`Whatsapp number is not valid in section ${index + 1}`);
              }
            }
          }
        }
        if (x.component === 'action') {
          const actionErros = handleAction(x, index);
          if (actionErros.length) { errors = [...errors, ...actionErros]; }
        }
        if (x.component === 'single' && !x.data?.text?.trim().length) {
          errors.push(`Enter any text in section ${index + 1}`);
        }
        if (x.component === 'keyvalue') {
          if (!x.data?.keyValues?.length) {
            errors.push(`Enter at least one detail (key value pair) in section ${index + 1}`);
          } else {
            if (!x.data.keyValues.some(xx => xx.key?.trim().length)) {
              errors.push(`There is at least one missing label in details in section ${index + 1}`);
            }
            if (!x.data.keyValues.some(xx => xx.value?.trim().length)) {
              errors.push(`There is at least one missing value in details in section ${index + 1}`);
            }
          }
        }
        if (x.component === 'contact') {
          if (!exists(x, 'email')) {
            errors.push(`Enter an email address for the receipt in section ${index + 1}`);
          } else if (!EMAIL.test(x.data?.email || '')) {
            errors.push(`Enter a valid email address for the receipt in section ${index + 1}`);
          }
        }
        if (x.component === 'sms') {
          if (!exists(x, 'cell')) {
            errors.push(`Enter a cell phone number for the receipt in section ${index + 1}`);
          } else if (!PHONE.test(x.data?.cell || '')) {
            errors.push(`Enter a valid cell phone number for the receipt in section ${index + 1}`);
          }
        }
        if (x.component === 'tags' && !x.data?.tags?.length) {
          errors.push(`Enter at least one tag in section ${index + 1}`);
        }
        if (x.component === 'couponInfo') {
          if (!exists(x, 'title')) { errors.push(`Enter the promotion title in section ${index + 1}`); }
          const actionErros = handleAction(x, index, 'coupon info');
          if (actionErros.length) { errors = [...errors, ...actionErros]; }
        }
        if (x.component === 'couponData' && !exists(x, 'name')) {
          errors.push(`Enter the coupon code in section ${index + 1}`);
        }
        if (x.component === 'title' && !exists(x, 'titleAbout') && !exists(x, 'descriptionAbout')) {
          errors.push(`Enter at least one of these title or description in section ${index + 1}`);
        }
        if (x.component === 'petId') {
          if (!exists(x, 'petName')) { errors.push(`Enter the pet name in section ${index + 1}`); }
          if (!YEAR.test(x.data?.petYearOfBirth || '')) {
            errors.push(`Check the pet's year of birth ${index + 1}`);
          }
        }
        if (x.component === 'sku' && !exists(x, 'sku')) {
          errors.push(`Enter the product SKU in section ${index + 1}`);
        }
      }
    });
  }

  return errors;
}

export default validator;

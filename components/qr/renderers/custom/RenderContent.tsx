import dynamic from "next/dynamic";

import { FILE_LIMITS, FORCE_EXTRA } from "../../../../consts";
import { sectionsQrTypes } from "../../components";
import { THandleValues } from "../../components/commons/types";

const RenderSmsForm = dynamic(() => import("../contents/RenderSmsForm"));
const RenderAddressData = dynamic(() => import("../contents/RenderAddressData"));
const RenderCompanyData = dynamic(() => import("../contents/RenderCompanyData"));
const RenderDateSelector = dynamic(() => import("../contents/RenderDateSelector"));
const RenderEmailWeb = dynamic(() => import("../contents/RenderEmailWeb"));
const RenderEasiness = dynamic(() => import("../contents/RenderEasiness"));
const RenderEmail = dynamic(() => import("../contents/RenderEmail"));
const RenderLinks = dynamic(() => import("../contents/RenderLinks"));
const RenderOrganization = dynamic(() => import("../contents/RenderOrganization"));
const RenderPhones = dynamic(() => import("../contents/RenderPhones"));
const RenderAssetsData = dynamic(() => import("../contents/RenderAssetsData"));
const RenderPresentation = dynamic(() => import("../contents/RenderPresentation"));
const RenderOpeningTime = dynamic(() => import("../contents/RenderOpeningTime"));
const RenderSocials = dynamic(() => import("../contents/RenderSocials"));
const RenderTitleDesc = dynamic(() => import("../contents/RenderTitleDesc"));
const RenderActionButton = dynamic(() => import("../contents/RenderActionButton"));
const RenderSingleText = dynamic(() => import("../contents/RenderSingleText"));
const RenderKeyValue = dynamic(() => import("../contents/RenderKeyValue"));
const RenderContactForm = dynamic(() => import("../contents/RenderContactForm"));
const RenderWeb = dynamic(() => import("../contents/RenderWeb"));
const RenderTags = dynamic(() => import("../contents/RenderTags"));
const RenderCouponInfo = dynamic(() => import("../contents/RenderCouponInfo"));
const RenderCouponData = dynamic(() => import("../contents/RenderCouponData"));
const RenderPetDesc = dynamic(() => import("../contents/RenderPetDesc"));
const RenderSku = dynamic(() => import("../contents/RenderSku"));

interface RenderContentProps {
  component: string;
  handleValues: THandleValues;
  setData: Function;
  index: number;
  predefined?: string[];
  selected?: string;
  data: any;
  isSolidButton?: boolean;
}

const RenderContent = ({ component, handleValues, index, data, setData, predefined, selected, isSolidButton }: RenderContentProps) => {

  const sQrType = sectionsQrTypes[component];
  if (sQrType?.renderForm) return sQrType.renderForm({ data, handleValues, index });

  return (
    <>
      {component === 'address' && <RenderAddressData data={data} handleValues={handleValues} index={index} />}
      {component === 'company' && <RenderCompanyData data={data} handleValues={handleValues} index={index} />}
      {component === 'date' &&
      <RenderDateSelector data={data} handleValues={handleValues} label="Date" index={index} />}
      {component === 'justEmail' && <RenderEmail data={data} handleValues={handleValues} index={index} />}
      {component === 'email' && <RenderEmailWeb data={data} handleValues={handleValues} index={index} />}
      {component === 'easiness' && <RenderEasiness data={data} handleValues={handleValues} index={index} />}
      {component === 'links' && <RenderLinks data={data} setData={setData} index={index} />}
      {component === 'organization' && <RenderOrganization data={data} handleValues={handleValues} index={index} />}
      {component === 'phones' && <RenderPhones data={data} handleValues={handleValues} index={index} />}
      {component === 'gallery' && <RenderAssetsData data={data} setData={setData} type="gallery" index={index}
                                                    totalFiles={selected === 'inventory' ? 3 : FILE_LIMITS['gallery'].totalFiles} />}
      {component === 'presentation' && <RenderPresentation data={data} handleValues={handleValues} index={index}
                                                           forceExtra={FORCE_EXTRA.includes(selected || '')} />}
      {component === 'opening' && <RenderOpeningTime data={data} setData={setData} index={index} />}
      {component === 'socials' &&
      <RenderSocials data={data} setData={setData} index={index} isSolidButton={isSolidButton} />}
      {component === 'title' &&
      <RenderTitleDesc handleValues={handleValues} title={data?.titleAbout} noPaper sx={{ mt: '5px' }}
                       description={data?.descriptionAbout} index={index}
                       noHeader={Boolean(data?.titleAbout?.trim().length) || Boolean(data?.descriptionAbout?.trim().length)}
                       header="Fill at least one of these fields" />}
      {component === 'action' &&
      <RenderActionButton index={index} setData={setData} handleValues={handleValues} data={data} />}
      {component === 'single' && <RenderSingleText text={data?.text || ''} index={index} handleValues={handleValues} />}
      {component === 'pdf' &&
      <RenderAssetsData totalFiles={predefined === undefined ? 1 : FILE_LIMITS['pdf'].totalFiles}
                        data={data} setData={setData} type="pdf" index={index} />}
      {component === 'audio' && <RenderAssetsData data={data} setData={setData} type="audio" index={index}
                                                  totalFiles={predefined === undefined ? 1 : FILE_LIMITS['audio'].totalFiles} />}
      {component === 'video' && <RenderAssetsData data={data} setData={setData} type="video" index={index}
                                                  totalFiles={predefined === undefined ? 1 : FILE_LIMITS['video'].totalFiles} />}
      {component === 'keyvalue' && <RenderKeyValue index={index} setData={setData} data={data} topics="" />}
      {component === 'web' && <RenderWeb data={data} handleValues={handleValues} index={index} />}
      {component === 'contact' && <RenderContactForm index={index} handleValues={handleValues} data={data} />}
      {component === 'tags' && <RenderTags index={index} handleValues={handleValues} data={data} />}
      {component === 'sms' && <RenderSmsForm index={index} handleValues={handleValues} data={data} />}
      {component === 'couponInfo' && <RenderCouponInfo index={index} handleValues={handleValues} data={data} />}
      {component === 'couponData' && <RenderCouponData index={index} handleValues={handleValues} data={data} />}
      {component === 'petId' && <RenderPetDesc index={index} handleValues={handleValues} data={data} />}
      {component === 'sku' && <RenderSku index={index} handleValues={handleValues} data={data} />}
    </>
  )
}

export default RenderContent;

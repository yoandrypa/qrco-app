import dynamic from "next/dynamic";

import {components} from "./helperFuncs";
import {FILE_LIMITS} from "../../../../consts";
import {Type} from "../../types/types";

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
  handleValues: Function;
  setData: Function;
  index: number;
  predefined?: string[];
  selected?: string;
  data?: Type;
}

const RenderContent = ({component, handleValues, index, data, setData, predefined, selected}: RenderContentProps) => (
  <>
    {component === components[0].type && <RenderAddressData data={data} handleValues={handleValues} index={index}/>}
    {component === components[1].type && <RenderCompanyData data={data} handleValues={handleValues} index={index}/>}
    {component === components[2].type && <RenderDateSelector data={data} handleValues={handleValues} label="Date" index={index}/>}
    {component === components[3].type && <RenderEmail data={data} handleValues={handleValues} index={index}/>}
    {component === components[4].type && <RenderEmailWeb data={data} handleValues={handleValues} index={index}/>}
    {component === components[5].type && <RenderEasiness data={data} handleValues={handleValues} index={index}/>}
    {component === components[6].type && <RenderLinks data={data} setData={setData} index={index}/>}
    {component === components[7].type && <RenderOrganization data={data} handleValues={handleValues} index={index}/>}
    {component === components[8].type && <RenderPhones data={data} handleValues={handleValues} index={index}/>}
    {component === components[9].type && <RenderAssetsData data={data} setData={setData} type="gallery" index={index}
                                                           totalFiles={predefined === undefined || selected === 'inventory' ? 3 : FILE_LIMITS['gallery'].totalFiles}/>}
    {component === components[10].type && <RenderPresentation data={data} handleValues={handleValues} index={index}
                                                              forceExtra={['vcard+', 'petId'].includes(selected || '')} />}
    {component === components[11].type && <RenderOpeningTime data={data} setData={setData} index={index}/>}
    {component === components[12].type && <RenderSocials data={data} setData={setData} index={index}/>}
    {component === components[13].type && <RenderTitleDesc handleValues={handleValues} title={data?.titleAbout} noPaper sx={{mt: '5px'}}
                                                           header="Fill at least one of these fields" description={data?.descriptionAbout} index={index}/>}
    {component === components[14].type && <RenderActionButton index={index} setData={setData} handleValues={handleValues} data={data} />}
    {component === components[15].type && <RenderSingleText text={data?.text || ''} index={index} handleValues={handleValues}/>}
    {component === components[16].type && <RenderAssetsData totalFiles={predefined === undefined ? 1 : FILE_LIMITS['pdf'].totalFiles}
                                                            data={data} setData={setData} type="pdf" index={index}/>}
    {component === components[17].type && <RenderAssetsData data={data} setData={setData} type="audio" index={index}
                                                            totalFiles={predefined === undefined ? 1 : FILE_LIMITS['audio'].totalFiles}/>}
    {component === components[18].type && <RenderAssetsData data={data} setData={setData} type="video" index={index}
                                                            totalFiles={predefined === undefined ? 1 : FILE_LIMITS['video'].totalFiles}/>}
    {component === components[19].type && <RenderKeyValue index={index} setData={setData} data={data} topics="" />}
    {component === components[20].type && <RenderWeb data={data} handleValues={handleValues} index={index} />}
    {component === components[21].type && <RenderContactForm index={index} handleValues={handleValues} data={data} />}
    {component === components[22].type && <RenderTags index={index} handleValues={handleValues} data={data} />}
    {component === components[23].type && <RenderSmsForm index={index} handleValues={handleValues} data={data} />}
    {component === components[24].type && <RenderCouponInfo index={index} handleValues={handleValues} data={data} />}
    {component === components[25].type && <RenderCouponData index={index} handleValues={handleValues} data={data} />}
    {component === components[26].type && <RenderPetDesc index={index} handleValues={handleValues} data={data} />}
    {component === components[27].type && <RenderSku index={index} handleValues={handleValues} data={data} />}
  </>
);

export default RenderContent;

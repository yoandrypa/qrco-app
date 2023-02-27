import {MouseEvent, useCallback, useEffect, useRef, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";

import Common from "../helperComponents/Common";
import DragPaper from "../helperComponents/looseComps/DragPaper";
import Expander from "./helpers/Expander";
import RenderHeadline from "./custom/RenderHeadline";
import {CustomType, DataType} from "../types/types";

import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import {getItemStyle} from "../helperComponents/looseComps/StyledComponents";
import {cleaner, components, CustomEditProps, CustomProps, getNameStr, validator} from "./custom/helperFuncs";
import {getUuid} from "../../../helpers/qr/helpers";
import {FILE_LIMITS} from "../../../consts";

import dynamic from "next/dynamic";

const RenderActionButton = dynamic(() => import("./contents/RenderActionButton"));
const RenderSingleText = dynamic(() => import("./contents/RenderSingleText"));
const RenderAssetsData = dynamic(() => import("./contents/RenderAssetsData"));
const CustomEditSection = dynamic(() => import("./custom/CustomEditSection"));
const RenderLinks = dynamic(() => import("./contents/RenderLinks"));
const RenderTitleDesc = dynamic(() => import("./contents/RenderTitleDesc"));
const CustomMenu = dynamic(() => import("./custom/CustomMenu"));
const RenderOpeningTime = dynamic(() => import("./contents/RenderOpeningTime"));
const RenderDateSelector = dynamic(() => import("./contents/RenderDateSelector"));
const RenderSocials = dynamic(() => import("./contents/RenderSocials"));
const RenderEasiness = dynamic(() => import("./contents/RenderEasiness"));
const RenderConfirmDlg = dynamic(() => import("../../renderers/RenderConfirmDlg"));
const RenderAddressData = dynamic(() => import("./contents/RenderAddressData"));
const RenderCompanyData = dynamic(() => import("./contents/RenderCompanyData"));
const RenderEmailWeb = dynamic(() => import("./contents/RenderEmailWeb"));
const RenderOrganization = dynamic(() => import("./contents/RenderOrganization"));
const RenderPhones = dynamic(() => import("./contents/RenderPhones"));
const RenderPresentation = dynamic(() => import("./contents/RenderPresentation"));
const Button = dynamic(() => import("@mui/material/Button"));
const RenderCouponData = dynamic(() => import("./contents/RenderCouponData"));
const RenderCouponInfo = dynamic(() => import("./contents/RenderCouponInfo"));
const ArrowCircleUpIcon = dynamic(() => import("@mui/icons-material/ArrowCircleUp"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const RenderPetDesc = dynamic(() => import("./contents/RenderPetDesc"));
const RenderKeyValue = dynamic(() => import("./contents/RenderKeyValue"));
const RenderEmail = dynamic(() => import("./contents/RenderEmail"));
const RenderWeb = dynamic(() => import("./contents/RenderWeb"));
const RenderSku = dynamic(() => import("./contents/RenderSku"));
const RenderTags = dynamic(() => import("./contents/RenderTags"));
const RenderContactForm = dynamic(() => import("./contents/RenderContactForm"));

export default function Custom({data, setData, handleValues, setIsWrong, predefined, tip, selected}: CustomProps) {
  const [showOptions, setShowOptions] = useState<HTMLElement | null>(null);
  const [expander, setExpander] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<{index: number, item: string} | undefined>(undefined);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [open, setOpen] = useState<CustomEditProps | null>(null); // aims to editor

  const doneFirst = useRef<boolean>(false);
  const topElement = useRef<HTMLDivElement | null>(null);

  const handleOptions = useCallback((e: MouseEvent<HTMLElement>) => {
    setShowOptions(e.currentTarget);
  }, []);

  const handleAdd = useCallback((item: string) => {
    doneFirst.current = true;
    setData((prev: DataType) => {
      const newData = {...prev};
      if (!newData.custom) { newData.custom = []; } // @ts-ignore
      const expand = getUuid(); // @ts-ignore
      newData.custom.push({component: item, expand});
      setExpander((prev: string[]) => {
        const newExpander = [...prev];
        newExpander.push(expand);
        return newExpander;
      });
      return newData;
    });
  }, [data?.custom?.length, expander]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = useCallback((index: number, item: string) => {
    setConfirm(undefined);
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      newData.custom.splice(index, 1); // @ts-ignore
      if (!newData.custom.length) { delete newData.custom; }
      cleaner(newData, item);
      return newData;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = useCallback((index: number, item: string) => () => {
    setConfirm({index, item});
  }, []);

  const handleExpander = useCallback((item: string) => {
    setExpander((prevState: string[]) => {
      const newExpander = [...prevState];
      const index = newExpander.indexOf(item);
      if (index !== -1) {
        newExpander.splice(index, 1);
      } else {
        newExpander.push(item);
      }
      return newExpander;
    });
  }, [expander]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccept = useCallback((value: string, index: number, item: string) => {
    setOpen(null);
    setData((prev: DataType) => {
      const newData = {...prev};
      const original = components.find(x => x.type === item);
      if (original?.name === value && newData?.custom?.[index]?.name !== undefined) {
        delete newData.custom[index].name;
      } else if (newData?.custom?.[index]) {
        newData.custom[index].name = value;
      }
      return newData;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = useCallback((index: number, item: string, name?: string) => (event: MouseEvent<HTMLElement>) => {
    setOpen({item, index, name, anchor: event.currentTarget});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handle = useCallback((item: string) => () => {
    handleAdd(item);
    setShowOptions(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragEnd = useCallback((result: any) => {
    if (!result?.destination) { return null; }
    setData((prev: DataType) => {
      const tempo = {...prev};
      const newPositions = prev.custom || [];
      const [removed] = newPositions.splice(result.source.index, 1);
      newPositions.splice(result.destination.index, 0, removed);
      tempo.custom = newPositions;
      return tempo;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const expand = [] as string[];

    if (predefined) {
      setData((prev: DataType) => {
        const newData = {...prev, custom: []};
        predefined.forEach((item, index) => { // @ts-ignore
          const newComponent = {component: item, expand: getUuid()}; // @ts-ignore
          if (selected === 'petId') { newComponent.data = {linksOnlyLinks: true}; } // @ts-ignore
          newData.custom.push(newComponent); // @ts-ignore
          if (index === 0) { expand.push(newData.custom[0].expand); }
        });
        return newData;
      });
    } else if (data.custom?.length && data.custom[0].expand !== undefined) {
      expand.push(data.custom[0].expand);
    }

    if (expand.length) { setExpander(expand); }

    const observer = new IntersectionObserver(
      (payload: IntersectionObserverEntry[]) => {
        setIsVisible(payload[0].isIntersecting || false);
      }, { root: document.querySelector("#scrollArea"), rootMargin: "0px", threshold: [0.3] });

      // @ts-ignore
    observer.observe(topElement.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.custom?.length && doneFirst.current) {
      setTimeout(() => window.scrollTo({behavior: 'smooth', top: document.documentElement.scrollHeight}), 100);
    }
  }, [data?.custom?.length]);

  useEffect(() => {
    setIsWrong(validator(data, selected));
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg={tip || "Create a custom QR Link on your own, using the predefined sections."}>
      <Box sx={{mt: 1, width: '100%'}}>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOptions}>{'Sections...'}</Button>
        <div ref={topElement} style={{height: '20px', width: '1px', display: 'inline-flex'}} />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: any) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {data.custom?.map((x: CustomType, index: number) => {
                  const { component } = x;
                  const expanded = expander.find(exp => exp === x.expand);

                  const isHeadline = !['title', 'action', 'sku'].includes(component) && !(component === 'gallery' && selected === 'inventory');
                  const key = x.expand || `tempo${index}`;

                  return (
                    <Draggable key={key} draggableId={key} index={index} isDragDisabled={data.custom?.length === 1}>
                      {(prov: any, snap: any) => (
                        <Box sx={{my: 4, width: '100%', ...getItemStyle(snap.isDragging, prov.draggableProps.style)}}
                             ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                          <DragPaper elevation={2} sx={{p: 1}} avoidIcon={data.custom?.length === 1} removeFunc={handleRemove(index, component)}
                                     editFunc={isHeadline ? handleEdit(index, component, x.name) : undefined}> {/* @ts-ignore */}
                            <Expander expand={expanded || null} setExpand={handleExpander} item={x.expand} multi
                                      index={index} handleValues={handleValues} checked={x?.data?.hideHeadLine}
                                      title={x.name || getNameStr(component, selected || '')}
                                      bold={Boolean(x.name)} editFunc={isHeadline ? handleEdit(index, component, x.name) : undefined}/>
                            {expanded !== undefined && (<>
                              {isHeadline && <RenderHeadline index={index} handleValues={handleValues} hideHeadLine={x?.data?.hideHeadLine} centerHeadLine={x?.data?.centerHeadLine}/>}
                              {component === components[0].type && <RenderAddressData data={x.data} handleValues={handleValues} index={index}/>}
                              {component === components[1].type && <RenderCompanyData data={x.data} handleValues={handleValues} index={index}/>}
                              {component === components[2].type && <RenderDateSelector data={x.data} handleValues={handleValues} label="Date" index={index}/>}
                              {component === components[3].type && <RenderEmail data={x.data} handleValues={handleValues} index={index}/>}
                              {component === components[4].type && <RenderEmailWeb data={x.data} handleValues={handleValues} index={index}/>}
                              {component === components[5].type && <RenderEasiness data={x.data} handleValues={handleValues} index={index}/>}
                              {component === components[6].type && <RenderLinks data={x.data} setData={setData} index={index}/>}
                              {component === components[7].type && <RenderOrganization data={x.data} handleValues={handleValues} index={index}/>}
                              {component === components[8].type && <RenderPhones data={x.data} handleValues={handleValues} index={index}/>}
                              {component === components[9].type && (
                                <RenderAssetsData data={x.data} setData={setData} type="gallery" index={index}
                                                  totalFiles={predefined === undefined || selected === 'inventory' ? 3 : FILE_LIMITS['gallery'].totalFiles}/>
                              )}
                              {component === components[10].type && (
                                <RenderPresentation data={x.data} handleValues={handleValues} index={index} showExtra={selected === 'findMe'}
                                                    forceExtra={['vcard+', 'petId'].includes(selected || '')} />)}
                              {component === components[11].type && <RenderOpeningTime data={x.data} setData={setData} index={index}/>}
                              {component === components[12].type && <RenderSocials data={x.data} setData={setData} index={index}/>}
                              {component === components[13].type && (
                                <RenderTitleDesc handleValues={handleValues} title={x.data?.titleAbout} noPaper sx={{mt: '5px'}}
                                                 header="Fill at least one of these fields" description={x.data?.descriptionAbout} index={index}/>
                              )}
                              {component === components[14].type && (
                                <RenderActionButton index={index} setData={setData} handleValues={handleValues} data={x.data} />
                              )}
                              {component === components[15].type && (
                                <RenderSingleText text={x.data?.text || ''} index={index} handleValues={handleValues}/>
                              )}
                              {component === components[16].type && (
                                <RenderAssetsData totalFiles={predefined === undefined ? 1 : FILE_LIMITS['pdf'].totalFiles}
                                                  data={x.data} setData={setData} type="pdf" index={index}/>
                              )}
                              {component === components[17].type && (
                                <RenderAssetsData data={x.data} setData={setData} type="audio" index={index}
                                                  totalFiles={predefined === undefined ? 1 : FILE_LIMITS['audio'].totalFiles}/>
                              )}
                              {component === components[18].type && (
                                <RenderAssetsData data={x.data} setData={setData} type="video" index={index}
                                                  totalFiles={predefined === undefined ? 1 : FILE_LIMITS['video'].totalFiles}/>
                              )}
                              {component === components[19].type && <RenderKeyValue index={index} setData={setData} data={x.data} topics="" />}
                              {component === components[20].type && <RenderWeb data={x.data} handleValues={handleValues} index={index} />}
                              {component === components[21].type && <RenderContactForm index={index} handleValues={handleValues} data={x.data} />}
                              {component === components[22].type && <RenderTags index={index} handleValues={handleValues} data={x.data} />}
                              {component === components[23].type && <RenderCouponInfo index={index} handleValues={handleValues} data={x.data} />}
                              {component === components[24].type && <RenderCouponData index={index} handleValues={handleValues} data={x.data} />}
                              {component === components[25].type && <RenderPetDesc index={index} handleValues={handleValues} data={x.data} />}
                              {component === components[26].type && <RenderSku index={index} handleValues={handleValues} data={x.data} />}
                            </>)}
                          </DragPaper>
                        </Box>
                      )}
                    </Draggable>
                  )
                })}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      {showOptions && <CustomMenu handle={handle} showOptions={showOptions} setShowOptions={setShowOptions} />}
      {open && (
        <CustomEditSection
          handleClose={() => setOpen(null)} anchor={open.anchor} value={open.item}
          current={open.name} handleOk={(value: string) => handleAccept(value, open.index, open.item)} />
      )}
      {confirm !== undefined && (
        <RenderConfirmDlg
          handleCancel={() => setConfirm(undefined)} handleOk={() => handleDelete(confirm.index, confirm.item)}
          title="Confirm" noMsg="No" yesMsg="Yes" message="You are going to remove the selected section."
          confirmationMsg="Are you sure?" />
      )}
      {!isVisible && (
        <IconButton color="primary" sx={{position: 'fixed', left: '10px', bottom: '25px'}} size="large" onClick={() => window.scrollTo({behavior: 'smooth', top: 0})}>
          <ArrowCircleUpIcon fontSize="large"/>
        </IconButton>
      )}
    </Common>
  );
}

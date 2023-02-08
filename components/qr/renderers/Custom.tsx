import {MouseEvent, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";

import Common from "../helperComponents/Common";
import DragPaper from "../helperComponents/looseComps/DragPaper";
import Expander from "./helpers/Expander";
import {CustomType, DataType} from "../types/types";

import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import dynamic from "next/dynamic";
import {getItemStyle} from "../helperComponents/looseComps/StyledComponents";
import {
  cleaner,
  components,
  CustomEditProps,
  CustomProps,
  getNameStr,
  isRequired,
  validator
} from "./custom/helperFuncs";
import {generateUUID} from "listr2/dist/utils/uuid";

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

export default function Custom({data, setData, handleValues, setIsWrong, predefined, tip}: CustomProps) {
  const [showOptions, setShowOptions] = useState<HTMLButtonElement | null>(null);
  const [expander, setExpander] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<{ index: number, item: string } | undefined>(undefined);
  const [open, setOpen] = useState<CustomEditProps | null>(null); // aims to editor

  const doneFirst = useRef<boolean>(false);

  const handleOptions = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    setShowOptions(e.currentTarget);
  }, []);

  const handleAdd = useCallback((item: string) => {
    if (doneFirst.current) {
      setData((prev: DataType) => {
        const newData = {...prev};
        if (!newData.custom) {
          newData.custom = [];
        } // @ts-ignore
        const expand = generateUUID();
        newData.custom.push({component: item, expand});
        setExpander((prev: string[]) => {
          const newExpander = [...prev];
          newExpander.push(expand);
          return newExpander;
        });
        return newData;
      });
    } else {
      doneFirst.current = true;
    }
  }, [data.custom?.length, expander]);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = (index: number, item: string) => {
    setConfirm(undefined);
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      newData.custom.splice(index, 1); // @ts-ignore
      if (!newData.custom.length) {
        delete newData.custom;
      }
      cleaner(newData, item);
      return newData;
    });
  }

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
  }, [expander]);  // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleEdit = useCallback((index: number, item: string, name?: string) => (event: MouseEvent<HTMLButtonElement>) => {
    setOpen({item, index, name, anchor: event.currentTarget});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handle = useCallback((item: string) => () => {
    handleAdd(item);
    setShowOptions(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragEnd = (result: any) => {
    if (!result?.destination) {
      return null;
    }
    setData((prev: DataType) => {
      const tempo = {...prev};
      const newPositions = prev.custom || [];
      const [removed] = newPositions.splice(result.source.index, 1);
      newPositions.splice(result.destination.index, 0, removed);
      tempo.custom = newPositions;
      return tempo;
    });
  }

  useEffect(() => {
    if (predefined) {
      const expand = [] as string[];
      setData((prev: DataType) => {
        const newData = {...prev, custom: []};
        predefined.forEach((item, index) => { // @ts-ignore
          newData.custom.push({component: item, expand: generateUUID()}); // @ts-ignore
          if (index === 0) { expand.push(newData.custom[0].expand); }
        })
        return newData;
      });
      setExpander(expand);
    } else {
      doneFirst.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsWrong(validator(data));
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg={tip || "Create a custom QR Link on your own, using the predefined sections."}>
      <Box sx={{mt: 1, width: '100%'}}>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOptions}>{'Sections...'}</Button>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: any) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {data.custom?.map((x: CustomType, index: number) => {
                  const { component } = x;
                  const expanded = expander.find(exp => exp === x.expand);
                  const dataInfo = x.data;
                  return (
                    <Draggable key={x.expand} draggableId={x.expand} index={index} isDragDisabled={data.custom?.length === 1}>
                      {(prov: any, snap: any) => (
                        <Box sx={{my: 4, width: '100%', ...getItemStyle(snap.isDragging, prov.draggableProps.style)}}
                             ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                          <DragPaper elevation={2} sx={{p: 1}} avoidIcon={data.custom?.length === 1} removeFunc={handleRemove(index, component)}
                                     editFunc={predefined === undefined && !['title', 'action'].includes(component) ? handleEdit(index, component, x.name) : undefined}>
                            {/* @ts-ignore */}
                            <Expander expand={expanded || null} setExpand={handleExpander} item={x.expand} title={x.name || getNameStr(component)} multi bold={Boolean(x.name)} required={isRequired(component, dataInfo)} />
                            {expanded !== undefined && (<>
                              {component === components[0].type && <RenderAddressData data={dataInfo} handleValues={handleValues} index={index}/>}
                              {component === components[1].type && <RenderCompanyData data={dataInfo} handleValues={handleValues} index={index}/>}
                              {component === components[2].type && <RenderDateSelector data={dataInfo} handleValues={handleValues} label="Date" index={index}/>}
                              {component === components[3].type && <RenderEmailWeb data={dataInfo} handleValues={handleValues} index={index}/>}
                              {component === components[4].type && <RenderEasiness data={dataInfo} handleValues={handleValues} index={index}/>}
                              {component === components[5].type && <RenderLinks data={dataInfo} setData={setData} index={index}/>}
                              {component === components[6].type && <RenderOrganization data={dataInfo} handleValues={handleValues} index={index}/>}
                              {component === components[7].type && <RenderPhones data={dataInfo} handleValues={handleValues} index={index}/>}
                              {component === components[8].type && (
                                <RenderAssetsData data={dataInfo} setData={setData} type="gallery" totalFiles={3} displayUpto index={index}/>
                              )}
                              {component === components[9].type && <RenderPresentation data={dataInfo} handleValues={handleValues} index={index}/>}
                              {component === components[10].type && <RenderOpeningTime data={dataInfo} setData={setData} index={index}/>}
                              {component === components[11].type && <RenderSocials data={dataInfo} setData={setData} index={index}/>}
                              {component === components[12].type && (
                                <RenderTitleDesc handleValues={handleValues} title={dataInfo?.titleAbout} noHeader noPaper
                                                 description={dataInfo?.descriptionAbout} sx={{mt: '5px'}} index={index}/>
                              )}
                              {component === components[13].type && (
                                <RenderActionButton index={index} setData={setData} handleValues={handleValues} data={dataInfo} />
                              )}
                              {component === components[14].type && (
                                <RenderSingleText text={dataInfo?.text || ''} index={index} handleValues={handleValues}
                                                  includeTextDescription={dataInfo?.includeTextDescription || false} />
                              )}
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
      {showOptions && <CustomMenu handle={handle} data={data} showOptions={showOptions} setShowOptions={setShowOptions} />}
      {open && (
        <CustomEditSection
          handleClose={() => setOpen(null)}
          anchor={open.anchor}
          value={open.item}
          current={open.name}
          handleOk={(value: string) => handleAccept(value, open.index, open.item)}
        />
      )}
      {confirm !== undefined && (
        <RenderConfirmDlg
          handleCancel={() => setConfirm(undefined)}
          handleOk={() => handleDelete(confirm.index, confirm.item)}
          title="Confirm" noMsg="No" yesMsg="Yes"
          message="You are going to remove the selected section."
          confirmationMsg="Are you sure?"
        />
      )}
    </Common>
  );
}

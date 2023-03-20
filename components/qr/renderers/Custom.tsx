import {MouseEvent, useCallback, useEffect, useRef, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";

import Common from "../helperComponents/Common";
import DragPaper from "../helperComponents/looseComps/DragPaper";
import Expander from "./helpers/Expander";
import {CustomType, DataType} from "../types/types";

import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {getItemStyle} from "../helperComponents/looseComps/StyledComponents";

import {
  cleaner,
  components,
  CustomEditProps,
  CustomProps,
  CustomSettingsProps,
  getNameStr,
} from "./custom/helperFuncs";
import {getUuid} from "../../../helpers/qr/helpers";

import dynamic from "next/dynamic";
import RenderContent from "./custom/RenderContent";

const CustomEditSection = dynamic(() => import("./custom/CustomEditSection"));
const CustomMenu = dynamic(() => import("./custom/CustomMenu"));
const RenderConfirmDlg = dynamic(() => import("../../renderers/RenderConfirmDlg"));
const Button = dynamic(() => import("@mui/material/Button"));
const ArrowCircleUpIcon = dynamic(() => import("@mui/icons-material/ArrowCircleUp"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const HeadlineSettings = dynamic(() => import("./custom/HeadlineSettings"));

export default function Custom({data, setData, handleValues, predefined, tip, selected}: CustomProps) {
  const [showOptions, setShowOptions] = useState<HTMLElement | null>(null);
  const [expander, setExpander] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<{index: number, item: string} | undefined>(undefined);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [open, setOpen] = useState<CustomEditProps | null>(null); // aims to editor
  const [openSettings, setOpenSettings] = useState<CustomSettingsProps | null>(null);

  const doneFirst = useRef<boolean>(false);
  const topElement = useRef<HTMLDivElement | null>(null);

  const handleOptions = useCallback((e: MouseEvent<HTMLElement>) => {
    setShowOptions(e.currentTarget);
  }, []);

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

  const handleSettings = useCallback((index: number, hideHeadlineOpts: boolean) => (event: MouseEvent<HTMLElement>) => {
    setOpenSettings({index, anchor: event.currentTarget, hideHeadlineOpts});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = useCallback((item: string) => () => {
    doneFirst.current = true;
    setData((prev: DataType) => {
      const newData = {...prev};
      if (!newData.custom) { newData.custom = []; } // @ts-ignore
      const expand = getUuid();
      const newComponent = {component: item, expand};
      if (item === 'socials') { // @ts-ignore
        newComponent.data = {socialsOnlyIcons : true, hideHeadLine: true};
      } else if (item === 'links') { // @ts-ignore
        newComponent.data = {hideHeadLine: true};
      }
      newData.custom.push(newComponent);
      setExpander((prev: string[]) => {
        const newExpander = [...prev];
        newExpander.push(expand);
        return newExpander;
      });
      return newData;
    });
    setShowOptions(null);
  }, [data?.custom?.length, expander]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (predefined) {
      setData((prev: DataType) => {
        const newData = {...prev, custom: []};
        predefined.forEach((item, index) => { // @ts-ignore
          const newComponent = {component: item, expand: getUuid()}; // @ts-ignore
          if (selected === 'petId') { newComponent.data = {linksOnlyLinks: true}; } // @ts-ignore
          newData.custom.push(newComponent); // @ts-ignore
          if (index === 0) { setExpander([newData.custom[0].expand]); }
        });
        return newData;
      });
    } else if (data.custom?.length && data.custom[0].expand !== undefined) {
      setExpander([data.custom[0].expand]);
    }

    const observer = new IntersectionObserver((payload: IntersectionObserverEntry[]) => setIsVisible(payload[0].isIntersecting || false),
      { root: document.querySelector("#scrollArea"), rootMargin: "0px", threshold: [0.3] });

    // @ts-ignore
    observer.observe(topElement.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.custom?.length && doneFirst.current) {
      setTimeout(() => window.scrollTo({behavior: 'smooth', top: document.documentElement.scrollHeight}), 100);
    }
  }, [data?.custom?.length]);

  return (
    <Common msg={tip || "Create a custom QRLynk on your own, using the predefined sections."}>
      <Box sx={{mt: 1, width: '100%'}}>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOptions}>{'Sections...'}</Button>
        <div ref={topElement} style={{height: '20px', width: '1px', display: 'inline-flex'}} />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: any) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {data.custom?.map((x: CustomType, index: number) => {
                  const {component} = x;
                  const expanded = expander.find(exp => exp === x.expand);
                  const isHeadline = !['title', 'action', 'sku'].includes(component) && !(component === 'gallery' && selected === 'inventory');
                  const key = x.expand || `tempo${index}`;

                  return (<Draggable key={key} draggableId={key} index={index} isDragDisabled={data.custom?.length === 1}>
                    {(prov: any, snap: any) => (
                      <Box sx={{my: 4, width: '100%', ...getItemStyle(snap.isDragging, prov.draggableProps.style)}}
                           ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                        <DragPaper elevation={2} sx={{p: 1}} avoidIcon={data.custom?.length === 1} removeFunc={handleRemove(index, component)}
                                   editFunc={isHeadline ? handleEdit(index, component, x.name) : undefined}
                                   settingsFunc={handleSettings(index, !isHeadline)}> {/* @ts-ignore */}
                          <Expander expand={expanded || null} setExpand={handleExpander} item={x.expand} multi
                                    index={index} handleValues={handleValues} checked={x?.data?.hideHeadLine}
                                    title={x.name || getNameStr(component, selected || '')}
                                    bold={Boolean(x.name)} editFunc={isHeadline ? handleEdit(index, component, x.name) : undefined}/>
                          {expanded !== undefined && (
                            <RenderContent component={component} handleValues={handleValues} setData={setData}
                                           index={index} data={x.data} predefined={predefined} selected={selected} />
                          )}
                        </DragPaper>
                      </Box>
                    )}
                  </Draggable>)
                })}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      {showOptions && <CustomMenu handle={handleAdd} showOptions={showOptions} setShowOptions={setShowOptions} />}
      {openSettings && <HeadlineSettings anchor={openSettings.anchor} handleValues={handleValues} index={openSettings.index}
                                         data={data?.custom?.[openSettings.index]?.data} handleClose={() => setOpenSettings(null)}
                                         hideHeadLineSettings={openSettings.hideHeadlineOpts}/>}
      {open && <CustomEditSection handleClose={() => setOpen(null)} anchor={open.anchor} value={open.item}
                                  current={open.name} handleOk={(value: string) => handleAccept(value, open.index, open.item)} />}
      {confirm !== undefined && <RenderConfirmDlg confirmationMsg="Are you sure?" title="Confirm" noMsg="No" yesMsg="Yes"
                                                  handleCancel={() => setConfirm(undefined)} handleOk={() => handleDelete(confirm.index, confirm.item)}
                                                  message="You are going to remove the selected section." />}
      {!isVisible && <IconButton color="primary" sx={{position: 'fixed', left: '10px', bottom: '25px'}} size="large" onClick={() => window.scrollTo({behavior: 'smooth', top: 0})}>
          <ArrowCircleUpIcon fontSize="large"/>
        </IconButton>}
    </Common>
  );
}

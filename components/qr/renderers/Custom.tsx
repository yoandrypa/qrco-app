import {MouseEvent, useCallback, useEffect, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";

import Common from "../helperComponents/Common";
import DragPaper from "../helperComponents/looseComps/DragPaper";
import Expander from "./helpers/Expander";
import {CustomType, DataType} from "../types/types";

import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import dynamic from "next/dynamic";
import {getItemStyle} from "../helperComponents/looseComps/StyledComponents";
import {cleaner, components, CustomEditProps, CustomProps, getNameStr, validator} from "./custom/helperFuncs";
import CustomNewSection from "./custom/CustomNewSection";

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

export default function Custom({data, setData, handleValues, setIsWrong}: CustomProps) {
  const [showOptions, setShowOptions] = useState<HTMLButtonElement | null>(null);
  const [openEmpty, setOpenEmpty] = useState<number | undefined>(undefined);
  const [emptyValue, setEmptyValue] = useState<string>('');
  const [expander, setExpander] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{index: number, item: string} | undefined>(undefined);
  const [open, setOpen] = useState<CustomEditProps | null>(null); // aims to editor

  const handleOptions = (e: MouseEvent<HTMLButtonElement>) => {
    setShowOptions(e.currentTarget);
  }

  const handleCloseDlg = useCallback(() => {
    setEmptyValue('');
    setOpenEmpty(undefined);
  }, []);

  const handleAdd = (item?: string) => {
    setData((prev: DataType) => {
      const newData = {...prev};
      if (!newData.custom) { newData.custom = []; } // @ts-ignore
      const itemName = item || emptyValue;
      newData.custom.push(itemName);
      setExpander(itemName);
      if (openEmpty) { handleCloseDlg(); }
      return newData;
    });
  }

  const handleDelete = (index: number, item: string) => {
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      newData.custom.splice(index, 1); // @ts-ignore
      if (!newData.custom.length) { delete newData.custom; }
      cleaner(newData, item);
      return newData;
    });
  }

  const handleRemove = (index: number, item: string) => () => {
    setConfirm({index, item});
  };

  const handleEdit = (index: number, item: string) => (event: MouseEvent<HTMLButtonElement>) => {
    setOpen({item, index, anchor: event.currentTarget});
  };

  const handle = (item: string) => () => {
    if (item === 'empty') {
      setOpenEmpty(-1); // @ts-ignore
    } else {
      handleAdd(item);
    }
    setShowOptions(null);
  }

  const onDragEnd = (result: any) => {
    if (!result?.destination) { return null; }

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
    const errors = validator(data, data.custom || []);
    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="Create a custom QR Link on your own, using the predefined sections.">
      <Box sx={{mt: 1, width: '100%'}}>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={handleOptions}>{'Sections...'}</Button>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: any) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {data.custom?.map((x: CustomType | string, index: number) => (
                  <Draggable key={`item${index}`} draggableId={`item${index}`} index={index} isDragDisabled={data.custom?.length === 1}>
                    {(prov: any, snap: any) => (
                      <Box sx={{my: 4, width: '100%', ...getItemStyle(snap.isDragging, prov.draggableProps.style)}}
                           ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                        {typeof x === "string" ? (
                          <DragPaper elevation={2} sx={{p: 1}} avoidIcon={data.custom?.length === 1} // @ts-ignore
                                     editFunc={handleEdit(index, x)} removeFunc={handleRemove(index, x)}>
                            <Expander expand={expander} setExpand={setExpander} item={x} title={getNameStr(x)} />
                            {expander === x && (<>
                              {x === components[0].type && <RenderAddressData data={data} handleValues={handleValues} />}
                              {x === components[1].type && <RenderCompanyData data={data} handleValues={handleValues} />}
                              {x === components[2].type && <RenderDateSelector data={data} setData={setData} label="Date" />}
                              {x === components[3].type && <RenderEmailWeb data={data} handleValues={handleValues} />}
                              {x === components[4].type && <RenderEasiness data={data} setData={setData} />}
                              {x === components[5].type && <RenderLinks data={data} setData={setData} />}
                              {x === components[6].type && <RenderOrganization data={data} handleValues={handleValues} />}
                              {x === components[7].type && <RenderPhones data={data} handleValues={handleValues} />}
                              {x === components[8].type && <RenderPresentation data={data} handleValues={handleValues} />}
                              {x === components[9].type && <RenderOpeningTime data={data} setData={setData} />}
                              {x === components[10].type && <RenderSocials data={data} setData={setData} />}
                              {x === components[11].type && (
                                <RenderTitleDesc handleValues={handleValues} title={data.titleAbout} noHeader noPaper
                                                 description={data.descriptionAbout} sx={{mt: '5px'}}/>
                              )}
                            </>)}
                          </DragPaper>
                        ) : x}
                      </Box>
                    )}
                  </Draggable>
                ))}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      {showOptions && <CustomMenu handle={handle} data={data} showOptions={showOptions} setShowOptions={setShowOptions} />}
      {open && <CustomEditSection handleClose={() => setOpen(null)} anchor={open.anchor} value={open.item} />}
      {openEmpty !== undefined && (
        <CustomNewSection
          emptyValue={emptyValue} setEmptyValue={setEmptyValue} // @ts-ignore
          handleAdd={handleAdd} handleCloseDlg={handleCloseDlg} />
      )}
      {confirm !== undefined && (
        <RenderConfirmDlg
          handleCancel={() => setConfirm(undefined)}
          handleOk={() => {
            handleDelete(confirm.index, confirm.item);
            setConfirm(undefined);
          }}
          title="Confirm" noMsg="No" yesMsg="Yes"
          message="You are going to remove the selected section."
          confirmationMsg="Are you sure?"
        />
      )}
    </Common>
  );
}

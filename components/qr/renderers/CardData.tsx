// import {useEffect, useMemo, useState} from 'react';
// import Box from "@mui/material/Box";
//
// import Common from '../helperComponents/Common';
// import Expander from "./helpers/Expander";
// import DragPaper from "../helperComponents/looseComps/DragPaper";
// import {EMAIL, PHONE, ZIP} from "../constants";
import {DataType} from "../types/types";
// import {isValidUrl} from "../../../utils";
// import socialsAreValid from "./validator";
//
// import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
//
// import dynamic from "next/dynamic";
// import {getItemStyle} from "../helperComponents/looseComps/StyledComponents";
import CardDataStatic from "./custom/CardDataStatic";
import Custom from "./Custom";

// const RenderPresentation = dynamic(() => import("./contents/RenderPresentation"));
// const RenderPhones = dynamic(() => import("./contents/RenderPhones"));
// const RenderOrganization = dynamic(() => import("./contents/RenderOrganization"));
// const RenderAddressData = dynamic(() => import("./contents/RenderAddressData"));
// const RenderEmailWeb = dynamic(() => import("./contents/RenderEmailWeb"));
// const RenderSocials = dynamic(() => import("./contents/RenderSocials"));

interface CardDataProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export default function CardData({data, setData, handleValues, setIsWrong}: CardDataProps) {
  if (!Boolean(data?.isDynamic)) {
    return <CardDataStatic data={data} handleValues={handleValues} setIsWrong={setIsWrong} />
  }

  return (
    <Custom
      data={data}
      setData={setData}
      handleValues={handleValues}
      setIsWrong={setIsWrong}
      tip="Your contact details. Users can store your info or contact you right away."
      predefined={['presentation', 'phones', 'organization', 'address', 'email']} />
  );

/*  const [expander, setExpander] = useState<string | null>(null);

  const isDynamic = useMemo(() => Boolean(data?.isDynamic), []) as boolean;  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let errors = false;
    if (!data.firstName?.trim().length || (data.phone?.trim().length && !PHONE.test(data.phone)) ||
      (data.fax?.trim().length && !PHONE.test(data.fax)) || (data.cell?.trim().length && !PHONE.test(data.cell)) ||
      (data.zip?.trim().length && !ZIP.test(data.zip)) || (data.web?.trim().length && !isValidUrl(data.web)) ||
      (data.email?.trim().length && !EMAIL.test(data.email))) {
      errors = true;
    } else if (data?.isDynamic) {
      errors = !socialsAreValid(data);
    }

    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderOne = () => (<DragPaper elevation={2} sx={{p: 1}} avoidIcon={!isDynamic}>
    <RenderPresentation data={data} handleValues={handleValues} message="Presentation" index={-1} />
    <RenderPhones data={data} handleValues={handleValues} message="Phones" index={-1} />
    <RenderOrganization data={data} handleValues={handleValues} message="Organization" index={-1} />
  </DragPaper>);

  const renderTwo = () => (<DragPaper elevation={2} sx={{p: 1}} avoidIcon={!isDynamic}>
    <Expander expand={expander} setExpand={setExpander} item="address" title="Address and other info"/>
    {expander === "address" && (
      <Box sx={{width: '100%'}}>
        <RenderAddressData data={data} handleValues={handleValues} index={-1} />
        <RenderEmailWeb data={data} handleValues={handleValues} sx={{ mt: 1 }} index={-1} />
      </Box>
    )}
  </DragPaper>);

  const renderThree = () => (<DragPaper elevation={2} sx={{p: 1}} avoidIcon={!isDynamic}>
    <Expander expand={expander} setExpand={setExpander} item="socials" title="Social networks" />
    {expander === "socials" && <RenderSocials data={data} setData={setData} index={-1} />}
  </DragPaper>);

  const onDragEnd = (result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
      const tempo = {...prev};

      const newPositions = tempo.index ? [...tempo.index] : [0, 1, 2];
      const [removed] = newPositions.splice(result.source.index, 1);
      newPositions.splice(result.destination.index, 0, removed);

      if (newPositions.toString() === '0,1,2' && tempo.index !== undefined) {
        delete tempo.index;
      } else {
        tempo.index = newPositions;
      }

      return tempo;
    });
  }

  return (
    <Common msg="Your contact details. Users can store your info or contact you right away.">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {(data.index || [0, 1, 2]).map((x: number, index: number) => (
                <Draggable key={`businessItem${x}`} draggableId={`businessItem${x}`} index={index} isDragDisabled={!isDynamic}>
                  {(provided: any, snapshot: any) => (
                    <Box sx={{...getItemStyle(snapshot.isDragging, provided.draggableProps.style),
                      my: 4, width: '100%'}} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {x === 0 && renderOne()}
                      {x === 1 && renderTwo()}
                      {isDynamic && x === 2 ? renderThree() : null}
                    </Box>
                  )}
                </Draggable>
              ))}
            </Box>
            )}
        </Droppable>
      </DragDropContext>
    </Common>
  );*/
}

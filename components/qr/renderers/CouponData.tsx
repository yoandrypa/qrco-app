import {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Common from '../helperComponents/Common';
import {DataType} from "../types/types";
import Expander from "./helpers/Expander";
import {isValidUrl} from "../../../utils";
import {ZIP} from "../constants";
import RenderTextFields from "./helpers/RenderTextFields";
import Topics from "./helpers/Topics";
import socialsAreValid from "./validator";
import RenderProposalsTextFields from "./helpers/RenderProposalsTextFields";
import DragPaper from "../helperComponents/looseComps/DragPaper";

import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {getItemStyle} from "../helperComponents/looseComps/StyledComponents";

import dynamic from "next/dynamic";

const RenderDateSelector = dynamic(() => import("./contents/RenderDateSelector"));
const RenderAddressData = dynamic(() => import("./contents/RenderAddressData"));

type CouponProps = {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

const CouponData = ({data, setData, handleValues, setIsWrong}: CouponProps) => {
  const [expander, setExpander] = useState<string | null>(null);

  const renderItem = (item: string, label: string, required?: boolean, placeholder?: string) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || '' as string;

    // @ts-ignore
    if (data[item] !== undefined  && (item === 'zip' && !ZIP.test(value) || (item === 'urlOptionLink' && !isValidUrl(value)))) {
      isError = true;
    }

    if (['prefix', 'urlOptionLabel'].includes(item)) {
      return (<RenderProposalsTextFields
        options={item === 'prefix' ? ['Get coupon', '10% off', 'Get for free'] : ['Shop online', 'Buy online', 'Get a discount', 'Buy & get a discount']}
        value={value}
        item={item}
        required={required}
        label={label}
        placeholder={placeholder}
        isError={isError}
        handleValues={handleValues}
      />);
    }

    return (
      <RenderTextFields
        handleValues={handleValues}
        value={value}
        item={item}
        label={label}
        placeholder={placeholder}
        isError={isError}
        required={required}
      />
    );
  };

  useEffect(() => {
    let errors = false;
    if (!data.urlOptionLabel?.trim().length || !data.urlOptionLink?.trim().length ||
      !isValidUrl(data.urlOptionLink) || !data.title?.trim().length || !data.name?.trim().length ||
      (data.zip?.trim && !ZIP.test(data.zip)) || !socialsAreValid(data)) {
      errors = true;
    }
    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // the date goes to the field value

  return (
    <Common msg="Share a coupon for sales promotion.">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {(data.index || [0, 1, 2]).map((x: number, index: number) => (
                <Draggable key={`businessItem${x}`} draggableId={`businessItem${x}`} index={index}>
                  {(provided: any, snapshot: any) => (
                    <Box sx={{my: 4, width: '100%', ...getItemStyle(snapshot.isDragging, provided.draggableProps.style)}}
                         ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {x === 0 && (<DragPaper elevation={2} sx={{p: 1}}>
                        <Topics message={'Promotion info'} />
                        <Grid container spacing={1}>
                          <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
                            {renderItem('company', 'Company')}
                          </Grid>
                          <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
                            {renderItem('title', 'Title', true)}
                          </Grid>
                          <Grid item xs={12} style={{paddingTop: 0}}>
                            {renderItem('about', 'Description')}
                          </Grid>
                          <Grid item xs={12} style={{paddingTop: 0}}>
                            {renderItem('prefix', 'Badge')}
                          </Grid>
                          <Grid item xs={6} style={{paddingTop: 0}}>
                            {renderItem('urlOptionLabel', 'Button text', true)}
                          </Grid>
                          <Grid item xs={6} style={{paddingTop: 0}}>
                            {renderItem('urlOptionLink', 'Link', true)}
                          </Grid>
                        </Grid>
                      </DragPaper>)}
                      {x === 1 && (<DragPaper elevation={2} sx={{ p: 1 }}>
                        <Expander expand={expander} setExpand={setExpander} item="coupon" title="Coupon data *" required={!data?.name?.length} />
                        {expander === "coupon" && (
                          <Grid container spacing={1}>
                            <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
                              {renderItem('name', 'Coupon code', true)}
                            </Grid>
                            <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
                              <RenderDateSelector data={data} setData={setData} label="Valid until" />
                            </Grid>
                            <Grid item xs={12} style={{paddingTop: 0}}>
                              {renderItem('text', 'Terms and conditions')}
                            </Grid>
                          </Grid>
                        )}
                      </DragPaper>)}
                      {x === 2 && (<DragPaper elevation={2} sx={{ p: 1 }}>
                        <Expander expand={expander} setExpand={setExpander} item="address" title="Address" />
                        {expander === "address" && <RenderAddressData data={data} handleValues={handleValues} />}
                      </DragPaper>)}
                    </Box>
                  )}
                </Draggable>
              ))}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Common>
  );
}

export default CouponData;

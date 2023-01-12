import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Common from '../helperComponents/Common';
import Expander from "./helpers/Expander";

import {DataType} from "../types/types";
import {isValidUrl} from "../../../utils";
import socialsAreValid from "./validator";
import RenderTextFields from "./helpers/RenderTextFields";

import dynamic from "next/dynamic";
import RenderProposalsTextFields from "./helpers/RenderProposalsTextFields";
import RenderCompanyData from "./contents/RenderCompanyData";
import RenderAddressData from "./contents/RenderAddressData";
import {EMAIL, PHONE, ZIP} from "../constants";
import DragPaper from "../helperComponents/looseComps/DragPaper";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {getItemStyle} from "../helperComponents/looseComps/StyledComponents";

const RenderEasiness = dynamic(() => import("./contents/RenderEasiness"));
const RenderSocials = dynamic(() => import("./contents/RenderSocials"));
const RenderOpeningTime = dynamic(() => import("./contents/RenderOpeningTime"));

interface BusinessProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export default function BusinessData({data, setData, handleValues, setIsWrong}: BusinessProps) {
  const [expander, setExpander] = useState<string | null>(null);

  const renderItem = (item: string, label: string, required?: boolean) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;
    if ((value.trim().length === 0 && ['urlOptionLabel', 'urlOptionLink'].includes(item)) ||
      (item === 'urlOptionLink' && !isValidUrl(value))) {
      isError = true;
    }
    if (item === 'urlOptionLabel') {
      return (<RenderProposalsTextFields
        options={['View menu', 'Shop online', 'Book now', 'Apply now', 'Learn more']}
        value={value}
        item={item}
        label={label}
        isError={isError}
        handleValues={handleValues}
      />);
    }
    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={handleValues} required={required} />;
  };

  const handleOptionButton = () => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      if (tempo.urlOptionLabel !== undefined) {
        delete tempo.urlOptionLabel;
        delete tempo.urlOptionLink;
      } else {
        tempo.urlOptionLabel = '';
        tempo.urlOptionLink = '';
      }
      return tempo;
    });
  };

  const renderZero = () => <DragPaper elevation={2} sx={{p: 1}}>
    <RenderCompanyData data={data} handleValues={handleValues} message="Business info" />
  </DragPaper>;

  const renderOne = () => <DragPaper elevation={2} sx={{p: 1}}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography sx={{ my: 'auto' }}>{'Action button'}</Typography>
      <Button sx={{ mb: '5px' }} variant="outlined" color={data.urlOptionLabel === undefined ? 'primary' : 'error'} onClick={handleOptionButton}>
        {data.urlOptionLabel === undefined ? 'Add action button' : 'Remove action button'}
      </Button>
    </Box>
    {data.urlOptionLabel !== undefined && (
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('urlOptionLabel', 'Label')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('urlOptionLink', 'Link')}
        </Grid>
      </Grid>
    )}
  </DragPaper>;

  const renderTwo = () => <DragPaper elevation={2} sx={{p: 1}}>
    <Expander expand={expander} setExpand={setExpander} item="address" title="Address" />
    {expander === "address" && <RenderAddressData data={data} handleValues={handleValues} />}
  </DragPaper>;

  const renderThree = () => <DragPaper elevation={2} sx={{p: 1}}>
    <Expander expand={expander} setExpand={setExpander} item="opening" title="Opening time" />
    {expander === "opening" && <RenderOpeningTime data={data} setData={setData} />}
  </DragPaper>;

  const renderFour = () => <DragPaper elevation={2} sx={{p: 1}}>
    <Expander expand={expander} setExpand={setExpander} item="easiness" title="Business easiness" />
    {expander === "easiness" && <RenderEasiness data={data} setData={setData} />}
  </DragPaper>;

  const renderFive = () => <DragPaper elevation={2} sx={{p: 1}}>
    <Expander expand={expander} setExpand={setExpander} item="socials" title="Social networks" />
    {expander === "socials" && <RenderSocials data={data} setData={setData} />}
  </DragPaper>;

  useEffect(() => {
    let errors = false;
    if (data.urlOptionLabel !== undefined && data.urlOptionLink !== undefined) {
      if (!data.urlOptionLabel.trim().length || !data.urlOptionLink.trim().length || !isValidUrl(data.urlOptionLink)) {
        errors = true;
      }
    } else if ((data.companyWebSite?.trim().length && !isValidUrl(data.companyWebSite)) ||
      (data.companyEmail?.trim().length && !EMAIL.test(data.companyEmail)) ||
      (data.companyPhone?.trim().length && !PHONE.test(data.companyPhone)) ||
      (data.zip?.trim().length && !ZIP.test(data.zip))) {
      errors = true;
    } else if (!data.company?.trim().length) {
      errors = true;
    } else {
      errors = !socialsAreValid(data);
    }
    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragEnd = (result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
      const tempo = {...prev};

      const newPositions = tempo.index ? [...tempo.index] : [0, 1, 2, 3, 4, 5];
      const [removed] = newPositions.splice(result.source.index, 1);
      newPositions.splice(result.destination.index, 0, removed);

      if (newPositions.toString() === '0,1,2,3,4,5' && tempo.index !== undefined) {
        delete tempo.index;
      } else {
        tempo.index = newPositions;
      }

      return tempo;
    });
  }

  return (
    <Common msg="Your business or company details. Users can contact your business or company right away.">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {(data.index || [0, 1, 2, 3, 4, 5]).map((x: number, index: number) => (
                <Draggable key={`businessItem${x}`} draggableId={`businessItem${x}`} index={index}>
                  {(provided: any, snapshot: any) => (
                    <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                         sx={{...getItemStyle(snapshot.isDragging, provided.draggableProps.style), my: 4, width: '100%'}}>
                      {x === 0 && renderZero()}
                      {x === 1 && renderOne()}
                      {x === 2 && renderTwo()}
                      {x === 3 && renderThree()}
                      {x === 4 && renderFour()}
                      {x === 5 && renderFive()}
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

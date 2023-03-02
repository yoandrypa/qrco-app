import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import pluralize from "pluralize";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {DataType, KeyValues, Type} from "../../types/types";
import TableRow from "@mui/material/TableRow";
import {getItemStyle} from "../../helperComponents/looseComps/StyledComponents";
import TableCell from "@mui/material/TableCell";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RenderTextFields from "../helpers/RenderTextFields";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import {ChangeEvent, useCallback, useEffect} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";

interface KeyValueProps {
  index: number;
  data?: Type;
  setData: Function;
  topics?: string;
}

export default function RenderKeyValue({data, setData, topics, index}: KeyValueProps) {
  const onDragEnd = useCallback((result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      const newPairs = Array.from(newData.custom[index].data.keyValues || []);
      const [removed] = newPairs.splice(result.source.index, 1);
      newPairs.splice(result.destination.index, 0, removed); // @ts-ignore
      newData.custom[index].data.keyValues = newPairs;
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const add = useCallback(() => {
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      newData.custom[index].data.keyValues.push({value: ''});
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = useCallback((idx: number) => () => {
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      newData.custom[index].data.keyValues.splice(idx, 1); // @ts-ignore
      if (newData.custom[index].data.keyValues.length === 1 && newData.custom[index].data.position === 'middle') { // @ts-ignore
        delete newData.custom[index].data.position;
      }
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeValue = useCallback((item: string, idx: number) => (payload: ChangeEvent<HTMLInputElement> | string) => { // @ts-ignore
    const value = payload.target?.value !== undefined ? payload.target.value : payload;
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      newData.custom[index].data.keyValues[idx][item] = value;
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSplit = useCallback(() => {
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      if (newData.custom[index].data.splitInTwoColumns === undefined) {  // @ts-ignore
        newData.custom[index].data.splitInTwoColumns = true;
      } else { // @ts-ignore
        delete newData.custom[index].data.splitInTwoColumns;
      }
      return newData;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      if (!newData?.custom?.[index]?.data) { newData.custom[index].data = {}; } // @ts-ignore
      if (!newData.custom[index].data.keyValues?.length) { newData.custom[index].data.keyValues = [{value: ''}]; }
      return newData;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{width: '100%'}}>
      {topics !== undefined && (
        <Topics message={topics} top="3px" secMessage={data?.keyValues && `(${pluralize('item', data.keyValues?.length || 0, true)})`}/>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <TableContainer sx={{mt: '-8px'}}>
              <Table size="small">
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {(data?.keyValues || []).map((x: KeyValues, idx: number) => {
                    const itemId = `item${idx}`;
                    return ( // @ts-ignore
                      <Draggable key={itemId} draggableId={itemId} index={idx} isDragDisabled={data.keyValues.length === 1}>
                        {(provided: any, snapshot: any) => (
                          <TableRow
                            sx={{p: 0, width: '100%'}}
                            key={`trow${idx}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}> {/* @ts-ignore */}
                            {data.keyValues.length > 1 && (
                              <TableCell sx={{p: 0, pr: 1, width: '40px', borderBottom: 'none'}}>
                                <DragIndicatorIcon sx={{ color: theme => theme.palette.text.disabled, mt: '8px' }} />
                              </TableCell>
                            )}
                            <TableCell sx={{p: 0, pr: 1, width: '100%', borderBottom: 'none'}}>
                              <Box sx={{width: '100%', display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
                                <Box sx={{width: '100%'}}>
                                  <RenderTextFields
                                    required
                                    index={index}
                                    placeholder="Label here"
                                    value={x.key || ''}
                                    handleValues={handleChangeValue('key', idx)}
                                  />
                                </Box>
                                <Box sx={{mr: {sm: 1, xs: 0}}}/>
                                <Box sx={{width: '100%'}}>
                                  <RenderTextFields
                                    required
                                    index={index}
                                    placeholder="Value here"
                                    value={x.value}
                                    handleValues={handleChangeValue('value', idx)}
                                  />
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{p: 0, borderBottom: 'none'}} align="right">
                              {idx + 1 === (data?.keyValues?.length || 0) ? (
                                <Tooltip title={'Add item'}>
                                  <IconButton onClick={add}><AddBoxIcon color="primary"/></IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title={'Remove item'}>
                                  <IconButton onClick={remove(idx)}><DeleteIcon color="error"/></IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>
      {(data?.keyValues || []).length > 1 && (
        <FormControl>
          <FormControlLabel control={<Switch onChange={handleSplit} checked={Boolean(data?.splitInTwoColumns)} />}
                            label="Split in two columns" />
        </FormControl>
      )}
    </Box>
  );
}

import { AddBox, Delete, DragIndicator } from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useContext } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { validate } from '../../../utils';
import Context from '../../context/Context';
import { DataType, validTypes } from '../types/types';

interface RenderType {
  key: 'otherDetails' | 'urls';
  label: string;
  type?: validTypes;
  requireLabel?: boolean;
  requireValue?: boolean;
}
interface MultipleFieldDataProps {
  item: RenderType;
}


// this is the component render a multiple field with drag and drop functionality
// and store the data in the context with this structure:
// {
//   "key": {
//     "heading": "heading",
//     "items": [
//       {
//         "label": "label",
//         "value": "value"
//       }
//     ]
//   }
export default function MultipleField({ item }: MultipleFieldDataProps) {
  //@ts-ignore
  const { data, setData } = useContext(Context);
  if (!data?.[item.key]) {
    setData({
      ...data,
      [item.key]: {
        heading: '',
        items: []
      }
    });
    return (<></>)
  }
  const add = (index: number) => {
    const oldItems = data?.[item.key]?.items || [];
    const newItems =
      index === 0
        ? [...oldItems, { label: '', value: '' }]
        : [
            ...oldItems.slice(0, index + 1),
            { label: '', value: '' },
            ...oldItems.slice(index + 1)
          ];
    setData({
      ...data,
      [item.key]: {
        ...data[item.key],
        items: newItems
      }
    });
  };
  const remove = (index: number) => {
    const newItems =
      (data?.[item.key]?.items
        ? data?.[item.key]?.items.filter((item: any, i: Number) => i !== index)
        : []) || [];
    setData({
      ...data,
      [item.key]: { ...data[item.key], items: [...newItems] }
    });
  };
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none',
    background: isDragging ? '#ebe8e1' : 'none',
    ...draggableStyle
  });
  const onDragEnd = (result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
      const tempo = { ...prev };

      const newLinks = Array.from(tempo?.[item.key]?.items || []);
      const [removed] = newLinks.splice(result.source.index, 1);
      newLinks.splice(result.destination.index, 0, removed);
      //@ts-ignore
      tempo[item.key].items = newLinks;
      return tempo;
    });
  };
  const heading = data?.[item.key]?.heading || ('' as string);
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <TableContainer sx={{ mt: '-8px' }}>
              <Table size="small">
                <TableHead sx={{ p: 0, width: '100%' }}>
                  <TableRow sx={{ p: 0, width: '100%' }}>
                    <TableCell sx={{ p: 0, pr: 1, width: '90%', borderBottom: 'none' }}>
                      <TextField
                        label={'Headline'}
                        size="small"
                        fullWidth
                        margin="dense"
                        value={heading}
                        placeholder={'Headline'}
                        onChange={e => {
                          setData({
                            ...data,
                            [item.key]: {
                              ...data[item.key],
                              heading: e.target.value
                            }
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ p: 0, width: '10%', pt:1, borderBottom: 'none' }}>
                      {
                        // @ts-ignore
                        !data?.[item.key]?.items ||
                          (!data?.[item.key].items.length && (
                            <Tooltip title={`Add a ${item.label}`}>
                              <IconButton
                                onClick={() => {
                                  add(0);
                                }}>
                                <AddBox color="primary" />
                              </IconButton>
                            </Tooltip>
                          ))
                      }
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Table size="small">
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {data?.[item.key]?.items.map((i: any, index: number) => {
                    const itemId = `${item.key}-${index}`;
                    return (
                      <Draggable
                        key={itemId}
                        draggableId={itemId}
                        index={index}>
                        {(provided: any, snapshot: any) => (
                          <TableRow
                            sx={{ p: 0, width: '100%' }}
                            key={`trow${index}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}>
                            <TableCell
                              sx={{
                                p: 0,
                                pr: 1,
                                width: '5%',
                                borderBottom: 'none'
                              }}>
                              { data[item.key].items.length>1 &&(<DragIndicator
                                sx={{
                                  color: theme => theme.palette.text.disabled,
                                  mt: '8px'
                                }}
                              />)}
                            </TableCell>
                            <TableCell
                              sx={{
                                p: 0,
                                pr: 1,
                                width: '40%',
                                borderBottom: 'none'
                              }}>
                              <TextField
                                label={`Label here`}
                                size="small"
                                fullWidth
                                margin="dense"
                                value={i.label || ''}
                                placeholder={'Label'}
                                required={item.requireLabel}
                                InputProps={{
                                  endAdornment: (
                                    item.requireLabel &&!i.value.trim().length ? (
                                      <InputAdornment position="end">
                                        <Typography color="error">{'REQUIRED'}</Typography>
                                      </InputAdornment>
                                    ) : null
                                  )
                                }}
                                onChange={e => {
                                  //@ts-ignore
                                  const newItems = [
                                    ...data[item.key].items
                                  ].map((newItem, newIndex) => {
                                    if (index == newIndex)
                                      newItem.label = e.target.value;
                                    return newItem;
                                  });
                                  setData({
                                    ...data,
                                    [item.key]: {
                                      ...data[item.key],
                                      items: newItems
                                    }
                                  });
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                p: 0,
                                pr: 1,
                                width: '40%',
                                borderBottom: 'none'
                              }}>
                              <TextField
                                label={`${item.label} here`}
                                size="small"
                                fullWidth
                                margin="dense"
                                value={i.value || ''}
                                placeholder={'Text'}
                                error={i.value? validate(i.value || '', item.type? item.type : 'text') : false}
                                required={item.requireValue}
                                InputProps={{
                                  endAdornment: (
                                    item.requireValue &&!i.value.trim().length ? (
                                      <InputAdornment position="end">
                                        <Typography color="error">{'REQUIRED'}</Typography>
                                      </InputAdornment>
                                    ) : null
                                  )
                                }}
                                onChange={e => {
                                  //@ts-ignore
                                  const newItems = [
                                    ...data[item.key].items
                                  ].map((newItem, newIndex) => {
                                    if (index == newIndex)
                                      newItem.value = e.target.value;
                                    return newItem;
                                  });
                                  setData({
                                    ...data,
                                    [item.key]: {
                                      ...data[item.key],
                                      items: newItems
                                    }
                                  });
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{ p: 0, borderBottom: 'none', width: '5%' }}
                              align="right">
                              <Tooltip title={'Add an item'}>
                                <IconButton
                                  onClick={() => {
                                    add(index);
                                  }}>
                                  <AddBox color="primary" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{ p: 0, borderBottom: 'none', width: '5%' }}
                              align="right">
                              <Tooltip title={'Remove an item'}>
                                <IconButton onClick={() => remove(index)}>
                                  <Delete color="error" />
                                </IconButton>
                              </Tooltip>
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
    </>
  );
}

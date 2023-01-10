import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DataType, DragFields } from '../../types/types';
import Expander from '../helpers/Expander';

interface RenderDragDropProps {
  fields: DragFields;
	setData: Function;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  background: isDragging ? '#ebe8e1' : 'none',
  ...draggableStyle
});

export default function RenderDragDrop({
	fields,
	setData
}: RenderDragDropProps) {
  const [expander, setExpander] = useState<string | null>(null);

  const remove = (index: number) => {
      setData((prev: DataType) => {
        const tempo = { ...prev };
        tempo.fields = tempo.fields?.filter((_, i) => i !== index);
        return tempo;
      });
    }

  const onDragEnd = (result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
      const tempo = { ...prev };
      const newFields = Array.from(tempo.fields || []);
      const [removed] = newFields.splice(result.source.index, 1);
      newFields.splice(result.destination.index, 0, removed);
      tempo.fields = newFields;
      return tempo;
    });
  };

  return (
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <TableContainer sx={{paddingBottom:2}}>
              <Table size="small">
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {fields?.map((field: any, index: number) => {
                    const itemId = `item-${index}`;
                    return (
                      <Draggable
                        key={itemId}
                        draggableId={itemId}
                        index={index}
                        isDragDisabled={fields?.length === 1}>
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
                                width: '40px',
                                borderBottom: 'none'
                              }}>
                              {/* @ts-ignore */}
                              {fields.length > 1 && (
                                <DragIndicatorIcon
                                  sx={{
                                    color: theme => theme.palette.text.disabled
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                p: 0,
                                pr: 1,
                                width: '95%',
                                borderBottom: 'none'
                              }}>
                              <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
                                <Expander
                                  expand={expander}
                                  setExpand={() =>
                                    setExpander(
                                      index.toString() === expander
                                        ? ''
                                        : index.toString()
                                    )
                                  }
                                  item={`item-${index}`}
                                  title={field.header}
                                  deleteButton
                                  handleDelete={() => remove(index)}
                                />
                                {expander === index.toString() && (
                                  <>{field.component}</>
                                )}
                              </Paper>
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
  );
}

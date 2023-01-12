import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import pluralize from "pluralize";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {DataType, LinkType} from "../../types/types";
import TableRow from "@mui/material/TableRow";
import {getItemStyle} from "../../helperComponents/looseComps/StyledComponents";
import TableCell from "@mui/material/TableCell";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import RenderProposalsTextFields from "../helpers/RenderProposalsTextFields";
import RenderTextFields from "../helpers/RenderTextFields";
import {isValidUrl} from "../../../../utils";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import {ChangeEvent, useCallback} from "react";

interface RenderLinksProps {
  data: DataType;
  setData: Function;
  topics?: string;
}

export default function RenderLinks({data, setData, topics}: RenderLinksProps) {
  const onDragEnd = (result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
      const tempo = {...prev};

      const newLinks = Array.from(tempo.links || []);
      const [removed] = newLinks.splice(result.source.index, 1);
      newLinks.splice(result.destination.index, 0, removed);

      tempo.links = newLinks;
      return tempo;
    });
  }

  const add = useCallback(() => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      tempo.links?.push({label: '', link: ''});
      return tempo;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = useCallback((index: number) => () => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      tempo.links?.splice(index, 1);
      if (tempo.links?.length === 1 && data?.position === 'middle') {
        delete data.position; // under by default
      }
      return tempo;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeValue = useCallback((item: string, index: number) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      // @ts-ignore
      tempo.links[index][item] = payload.target?.value !== undefined ? payload.target.value : payload;
      return tempo;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (<Box sx={{width: '100%'}}>
    {topics && <Topics message={topics} top="3px" secMessage={data.links && `(${pluralize('link', data.links.length, true)})`}/>}
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided: any) => (
          <TableContainer sx={{mt: '-8px'}}>
            <Table size="small">
              <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                {data.links?.length && data.links.map((x: LinkType, index: number) => {
                  const itemId = `item${index}`;
                  return ( // @ts-ignore
                    <Draggable key={itemId} draggableId={itemId} index={index} isDragDisabled={data.links.length === 1}>
                      {(provided: any, snapshot: any) => (
                        <TableRow
                          sx={{p: 0, width: '100%'}}
                          key={`trow${index}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}> {/* @ts-ignore */}
                          {data.links.length > 1 && (
                            <TableCell sx={{p: 0, pr: 1, width: '40px', borderBottom: 'none'}}>
                              <DragIndicatorIcon sx={{ color: theme => theme.palette.text.disabled, mt: '8px' }} />
                            </TableCell>
                          )}
                          <TableCell sx={{p: 0, pr: 1, width: '50%', borderBottom: 'none'}}>
                            <RenderProposalsTextFields
                              required
                              options={['My website', 'My youtube channel', 'My blog', 'My portfolio', 'My podcast', 'My store']}
                              placeholder="Label here"
                              value={x.label}
                              handleValues={handleChangeValue('label', index)}
                            />
                          </TableCell>
                          <TableCell sx={{p: 0, width: '50%', borderBottom: 'none'}}>
                            <RenderTextFields
                              required
                              placeholder="URL here"
                              value={x.link}
                              handleValues={handleChangeValue('link', index)}
                              isError={x.link.trim().length > 0 && !isValidUrl(x.link)}
                            />
                          </TableCell>
                          <TableCell sx={{p: 0, borderBottom: 'none'}} align="right">
                            {index + 1 === (data.links?.length || 0) ? (
                              <Tooltip title={'Add a link'}>
                                <IconButton onClick={add}><AddBoxIcon color="primary"/></IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title={'Remove link'}>
                                <IconButton onClick={remove(index)}><DeleteIcon color="error"/></IconButton>
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
  </Box>)
}

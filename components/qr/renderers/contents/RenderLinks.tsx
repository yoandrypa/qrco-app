import Box from "@mui/material/Box";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {DataType, LinkType, Type} from "../../types/types";
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
import {ChangeEvent, useCallback, useEffect} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";

interface RenderLinksProps {
  index: number;
  data?: Type;
  setData: Function;
}

export default function RenderLinks({data, setData, index}: RenderLinksProps) {
  const onDragEnd = useCallback((result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      const newLinks = Array.from(newData.custom[index].data.links || []);
      const [removed] = newLinks.splice(result.source.index, 1);
      newLinks.splice(result.destination.index, 0, removed); // @ts-ignore
      newData.custom[index].data.links = newLinks;
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const add = useCallback(() => {
    setData((prev: DataType) => {
      const newData = {...prev};  // @ts-ignore
      newData.custom[index].data.links.push({label: '', link: ''});
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = useCallback((idx: number) => () => {
    setData((prev: DataType) => {
      const newData = {...prev};// @ts-ignore
      newData.custom[index].data.links.splice(idx, 1); // @ts-ignore
      if (newData.custom[index].data.links.length === 1 && newData.custom[index].data.position === 'middle') { // @ts-ignore
        delete newData.custom[index].data.position;
      }
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeValue = useCallback((item: string, idx: number) => (payload: ChangeEvent<HTMLInputElement> | string) => { // @ts-ignore
    const value = payload.target?.value !== undefined ? payload.target.value : payload;
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      newData.custom[index].data.links[idx][item] = item === 'link' ? value.toLowerCase() : value
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOnly = useCallback((item: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      if (!newData?.custom?.[index]?.data) { newData.custom[index].data = {}; }
      if (item === 'avoidButtons') {
        if (!e.target.checked) { // @ts-ignore
          newData.custom[index].data.avoidButtons = true;
        } else { // @ts-ignore
          delete newData.custom[index].data.avoidButtons;
        }
      } else {
        if (e.target.checked) { // @ts-ignore
          newData.custom[index].data.linksOnlyLinks = true;
        } else { // @ts-ignore
          delete newData.custom[index].data.linksOnlyLinks;
        }
      }
      return newData;
    });
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      if (!newData?.custom?.[index]?.data) { newData.custom[index].data = {}; } // @ts-ignore
      if (!newData.custom[index].data.links?.length) { newData.custom[index].data.links = [{label: '', link: ''}]; }
      return newData;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{width: '100%'}}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <TableContainer sx={{mt: '-8px'}}>
              <Table size="small">
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {data?.links?.length && data.links.map((x: LinkType, idx: number) => {
                    const itemId = `item${idx}`;
                    return ( // @ts-ignore
                      <Draggable key={itemId} draggableId={itemId} index={idx} isDragDisabled={data.links.length === 1}>
                        {(provided: any, snapshot: any) => (
                          <TableRow
                            sx={{p: 0, width: '100%'}}
                            key={`trow${idx}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}> {/* @ts-ignore */}
                            {data.links.length > 1 && (
                              <TableCell sx={{p: 0, pr: 1, width: '40px', borderBottom: 'none'}}>
                                <DragIndicatorIcon sx={{ color: theme => theme.palette.text.disabled, mt: '8px' }} />
                              </TableCell>
                            )}
                            <TableCell sx={{p: 0, width: '100%', borderBottom: 'none'}}>
                              <Box sx={{width: '100%', display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
                                {!data?.linksOnlyLinks && (
                                  <Box sx={{width: '100%'}}>
                                    <RenderProposalsTextFields
                                    required
                                    index={index}
                                    options={['My website', 'My youtube channel', 'My blog', 'My portfolio', 'My podcast', 'My store']}
                                    placeholder="Label here"
                                    value={x.label || ''}
                                    handleValues={handleChangeValue('label', idx)}
                                  />
                                </Box>)}
                                {!data?.linksOnlyLinks && <Box sx={{mr: {sm: 1, xs: 0}}}/>}
                                <Box sx={{width: '100%'}}>
                                  <RenderTextFields
                                    required
                                    index={index}
                                    placeholder="URL here"
                                    value={x.link}
                                    handleValues={handleChangeValue('link', idx)}
                                    isError={x.link.trim().length > 0 && !isValidUrl(x.link)}
                                  />
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{p: 0, borderBottom: 'none'}} align="right">
                              {idx + 1 === (data?.links?.length || 0) ? (
                                <Tooltip title={'Add a link'}>
                                  <IconButton onClick={add}><AddBoxIcon color="primary"/></IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title={'Remove link'}>
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
      <Box sx={{width: '100%', display: 'flex', mt: '-5px', flexDirection: {sm: 'row', xs: 'column'}}}>
        <FormControl disabled={data?.linksOnlyLinks}>
          <FormControlLabel control={<Switch onChange={handleOnly('avoidButtons')} checked={!Boolean(data?.avoidButtons)} />}
            label="Links as buttons" />
        </FormControl>
        <FormControl sx={{mr: '5px'}}>
          <FormControlLabel control={<Switch onChange={handleOnly('linksOnlyLinks')} checked={data?.linksOnlyLinks || false} />}
            label="Only links" />
        </FormControl>
      </Box>
    </Box>
  );
}

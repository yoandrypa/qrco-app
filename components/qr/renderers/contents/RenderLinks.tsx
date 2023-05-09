import Box from "@mui/material/Box";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {DataType, LinkType, RenderLinksBtnsProps} from "../../types/types";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import renderText, {getOptions} from "../helpers/textfieldHelpers/textHandler";
import {EMAIL, PHONE} from "../../constants";

interface Payload { payload: ChangeEvent<HTMLInputElement> | string | {type: string} | File }

export default function RenderLinks({data, setData, index, isButtons}: RenderLinksBtnsProps) {
  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });

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

  const handleChangeValue = useCallback((item: string, idx: number) => (payload: Payload) => { // @ts-ignore
    const value = payload.target?.value !== undefined ? payload.target.value : payload;
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      const element = newData.custom[index].data.links[idx] as any;
      if (typeof value === 'string') {
        element[item] = item === 'link' ? value.toLowerCase() : value;
      } else if (value instanceof File) {
        element.icon = payload; // @ts-ignore
        newData.custom[index].data.iconName = payload.name; // this item is meant only to force the component to render, must be removed
      } else if (value.type === 'clearIcon') {
        delete element.icon; // @ts-ignore
        if (newData.custom[index].data.iconName) { delete newData.custom[index].data.iconName; }
      } else {
        element.type = value.type;
        if (element.type === 'link') { delete element.type; }
      }
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
          newData.custom[index].data[item] = true;
        } else { // @ts-ignore
          delete newData.custom[index].data[item];
          newData.custom?.[index]?.data?.links?.forEach(x => { delete x.icon; });
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

  const renderTableRow = (item: LinkType, idx: number, length: number) => {
    const itemId = `item${idx}`;

    const removeItem = (adj?: boolean) => {
    const sx = {width: '40px', height: '40px'} as any;
    if (adj) { sx.mt = '8px'; sx.mr = '-7px'; }
    return (
      <Tooltip title={`Remove ${isButtons ? 'button' : 'link'}`}>
        <IconButton onClick={remove(idx)} sx={sx}><DeleteIcon color="error"/></IconButton>
      </Tooltip>
    )};

    let isError = false;
    if (item.link.trim().length > 0) {
      if ((item.type === undefined || item.type === 'link')) {
        isError = !isValidUrl(item.link);
      } else if (item.type === 'email') {
        isError = !EMAIL.test(item.link);
      } else {
        isError = !PHONE.test(item.link);
      }
    }

    return <Draggable key={itemId} draggableId={itemId} index={idx} isDragDisabled={length === 1}>
      {(provided: any, snapshot: any) => (
        <TableRow
          sx={{p: 0, width: '100%'}}
          key={`row${itemId}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}> {/* @ts-ignore */}
          {length > 1 && (
            <TableCell sx={{p: 0, pr: 1, width: '40px', borderBottom: 'none'}}>
              <DragIndicatorIcon sx={{ color: theme => theme.palette.text.disabled, mt: '8px' }} />
            </TableCell>
          )}
          <TableCell sx={{p: 0, width: '100%', borderBottom: 'none'}}>
            <Box sx={{width: '100%', display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
              {!data?.linksOnlyLinks && (
                <Box sx={{width: !isButtons? '100%' : {xs: '100%', sm: '70%'}}}>
                  <RenderProposalsTextFields
                    required
                    options={getOptions(item.type)}
                    placeholder="Label here"
                    value={item.label || ''}
                    handleValues={handleChangeValue('label', idx)}
                  />
                </Box>)}
              {!data?.linksOnlyLinks && <Box sx={{mr: {sm: 1, xs: 0}}}/>}
              <Box sx={{width: '100%', display: 'flex'}}>
                <RenderTextFields
                  required
                  type={item.type}
                  icon={item.icon}
                  isButtons={isButtons}
                  index={index}
                  placeholder={renderText(item.type)}
                  value={item.link}
                  handleValues={handleChangeValue('link', idx)}
                  isError={isError}
                  includeIcon={data?.showIcons || false}
                />
                {isWide && idx !== 0 && idx + 1 === length && removeItem(true)}
              </Box>
            </Box>
          </TableCell>
          <TableCell sx={{p: 0, borderBottom: 'none', pt: '5px'}} align="right">
            {idx + 1 === length ? (
              <>
                <Tooltip title={`Add a ${isButtons ? 'button' : 'link'}`}>
                  <IconButton onClick={add}><AddBoxIcon color="primary"/></IconButton>
                </Tooltip>
                {!isWide && idx !== 0 && removeItem()}
              </>
            ) : removeItem()}
          </TableCell>
        </TableRow>
      )}
    </Draggable>
  }

  const renderTable = (provided: any) => {
    const length = data?.links?.length || 0;
    return (
      <TableContainer sx={{mt: '-8px'}}>
        <Table size="small">
          <TableBody {...provided.droppableProps} ref={provided.innerRef}>
            {length > 0 && data?.links?.map((x: LinkType, idx: number) => renderTableRow(x, idx, length))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Box sx={{width: '100%'}}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">{(provided: any) => renderTable(provided)}</Droppable>
      </DragDropContext>
      {!isButtons ? (
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
      ) : (
        <FormControl>
          <FormControlLabel control={<Switch onChange={handleOnly('showIcons')} checked={data?.showIcons || false} />}
                            label="Show icons" />
        </FormControl>
      )}
    </Box>
  );
}

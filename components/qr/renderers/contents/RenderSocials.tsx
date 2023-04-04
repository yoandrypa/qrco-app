import {ChangeEvent, useCallback, useRef} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {capitalize} from "@mui/material";

import RenderSocial from "../../helperComponents/smallpieces/RenderSocial";
import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";
import {DataType, SocialNetworksType, SocialsType} from "../../types/types";
import {PHONE} from "../../constants";
import {NETWORKS, RenderSocialsProps} from "../custom/helperFuncs";
import {getItemStyle} from "../../helperComponents/looseComps/StyledComponents";

import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import dynamic from "next/dynamic";

const Switch = dynamic(() => import("@mui/material/Switch"));
const FormControlLabel = dynamic(() => import("@mui/material/FormControlLabel"));
const FormControl = dynamic(() => import("@mui/material/FormControl"));
const InputLabel = dynamic(() => import("@mui/material/InputLabel"));

const RenderSocials = ({data, setData, index, isSolidButton}: RenderSocialsProps) => {
  const selection = useRef<SocialsType | null>(null);

  const handleValues = (item: SocialsType) => (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: DataType) => {
      const newData = {...prev};
      if (newData.custom?.[index]?.data?.socials) { // @ts-ignore
        const network = newData.custom[index].data.socials.find((x: SocialNetworksType) => x.network === item);
        if (network) { network.value = event.target.value; }
      }
      return newData;
    });
  };

  const renderSocial = (item: SocialNetworksType) => {
    if (item !== undefined) {
      let isError = !item.value?.length;

      if (item.network === 'whatsapp' && !isError && !PHONE.test(item.value || '')) { isError = true;}

      return (
        <Box sx={{width: '100%', display: 'flex'}}>
          {data?.socials?.length !== 1 && <DragIndicatorIcon sx={{ color: theme => theme.palette.text.disabled, mt: '15px' }} />}
          <TextField
            label={capitalize(item.network)}
            autoFocus={item.network === selection.current}
            size="small"
            fullWidth
            placeholder={`Enter just your ${item.network !== 'whatsapp' ? 'username' : 'cell number'}`}
            margin="dense"
            value={item.value || ''}
            onChange={handleValues(item.network)}
            error={isError}
            InputProps={{
              startAdornment: <InputAdornment position="start"><RenderIcon icon={item.network} enabled/></InputAdornment>
            }}
          />
        </Box>
      );
    }
    return null;
  };

  const handleSelection = (item: SocialsType) => {
    selection.current = item;
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      if (!newData.custom?.[index]?.data?.socials || !newData.custom[index].data.socials.some((x: SocialNetworksType) => x.network === item)) { // @ts-ignore
        if (!newData.custom?.[index]?.data) { newData.custom[index].data = {}; } // @ts-ignore
        if (!newData.custom?.[index]?.data?.socials) { newData.custom[index].data.socials = []; } // @ts-ignore
        newData.custom[index].data.socials.push({network: item, value: ''});
      } else { // @ts-ignore
        const idx = newData.custom[index].data.socials.findIndex((x: SocialNetworksType) => x.network === item); // @ts-ignore
        newData.custom[index].data.socials.splice(idx, 1); // @ts-ignore
        if (newData.custom[index].data.socials.length === 0) { // @ts-ignore
          delete newData.custom[index].data.socials; // @ts-ignore
          if (newData.custom[index].data.socialsOnlyIcons !== undefined) { delete newData.custom[index].data.socialsOnlyIcons; }
        }
      }
      return newData;
    });
  }

  const onDragEnd = (result: any) => {
    if (!result?.destination) { return null; }
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      const newSocials = Array.from(newData.custom[index].data.socials || []);
      const [removed] = newSocials.splice(result.source.index, 1);
      newSocials.splice(result.destination.index, 0, removed); // @ts-ignore
      newData.custom[index].data.socials = newSocials;
      return newData;
    });
  }

  const handlerSwitch = (prop: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setData((prev: DataType) => { debugger;
      const newData = {...prev};
      if (isChecked) { // @ts-ignore
        if (!newData.custom[index].data) { newData.custom[index].data = {}; } // @ts-ignore
        newData.custom[index].data[prop] = true; // @ts-ignore
        if (prop === 'linksAsButtons' && newData.custom?.[index]?.data?.socialsOnlyIcons) { delete newData.custom[index].data.socialsOnlyIcons; }
      } else { // @ts-ignore
        const elementData = newData.custom[index].data as any;
        delete elementData[prop];
        if (prop !== 'hideNetworkIcon' && elementData.iconSize !== undefined) {  delete elementData.iconSize; }
        if (prop === 'socialsOnlyIcons' && elementData.invertIconColors !== undefined) { delete elementData.invertIconColors; }
        if (elementData.hideNetworkIcon !== undefined) { delete elementData.hideNetworkIcon; }
        if (elementData.showOnlyNetworkName !== undefined) { delete elementData.showOnlyNetworkName; }
      }
      return newData;
    });
  }

  const beforeSend = (event: SelectChangeEvent): void => {
    const {value} = event.target;
    setData((prev: DataType) => {
      const newData = {...prev};
      if (value !== 'default') { // @ts-ignore
        if (!newData.custom[index].data) { newData.custom[index].data = {}; } // @ts-ignore
        newData.custom[index].data.iconSize = value;
      } else { // @ts-ignore
        delete newData.custom[index].data.iconSize;
      }
      return newData;
    });
  }

  const exists = useCallback((network: SocialsType) => (
    data?.socials !== undefined && data.socials.some((x: SocialNetworksType) => x.network === network)
  ), [data?.socials?.length || 0]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'fit-content', margin: '0 auto'}}>
          {NETWORKS.map(x => (
            <RenderSocial key={x.property} property={x.property} selected={exists(x.property)} tooltip={x.tooltip} handleSelection={handleSelection} />
          ))}
        </Box>
      </Grid>
      <Grid item xs={12} sx={{pl: '12px'}}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef} sx={{width: '100%'}}>
                {data?.socials?.map((x: SocialNetworksType, index: number) => {
                  const itemId = `item${x.network}`
                  return (
                    <Draggable key={itemId} draggableId={itemId} index={index} isDragDisabled={data?.socials?.length === 1}>
                      {(provided, snapshot) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                             sx={{background: 'red', ...getItemStyle(snapshot.isDragging, provided.draggableProps.style)}}>
                          {renderSocial(x)}
                        </Box>
                      )}
                    </Draggable>
                  )
                })}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        {data?.socials !== undefined && data?.socials?.length !== 0 && (
          <Box sx={{display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
            <FormControlLabel control={<Switch onChange={handlerSwitch('linksAsButtons')} />} label="As buttons" />
            {!data.linksAsButtons ? (
              <FormControlLabel control={<Switch checked={data?.socialsOnlyIcons || false}
                onChange={handlerSwitch('socialsOnlyIcons')} />} label="Only icons"  />
            ) : (<>
              <FormControlLabel control={<Switch checked={data?.hideNetworkIcon || false}
                onChange={handlerSwitch('hideNetworkIcon')} />} label="Hide network icon from button" />
              <FormControlLabel control={<Switch checked={data?.showOnlyNetworkName || false}
                onChange={handlerSwitch('showOnlyNetworkName')} />} label="Show only network name" />
            </>)}
            {data?.socialsOnlyIcons && (<>
              {!isSolidButton && (<FormControlLabel control={
                <Switch checked={data?.invertIconColors || false} onChange={handlerSwitch('invertIconColors')} />
              } label="Invert button colors" />)}
              <FormControl size='small' margin="dense" sx={{width: {xs: '100%', sm: '120px'}}}>
                <InputLabel>{'Icon size'}</InputLabel>
                <Select value={data?.iconSize || 'default'} label="Icon size" onChange={beforeSend}>
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                </Select>
              </FormControl>
            </>)}
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default RenderSocials;

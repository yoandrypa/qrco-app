import {ChangeEvent, useCallback, useRef} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {capitalize} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";
import {DataType, SocialNetworksType, SocialsType, Type} from "../../types/types";
import {PHONE} from "../../constants";
import SectionSelector from "../../helperComponents/SectionSelector";
import {getItemStyle} from "../../helperComponents/looseComps/StyledComponents";

import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import dynamic from "next/dynamic";

const Switch = dynamic(() => import("@mui/material/Switch"));
const FormControlLabel = dynamic(() => import("@mui/material/FormControlLabel"));

interface RenderSocialsProps {
  index: number;
  data?: Type;
  setData: Function;
}

const RenderSocials = ({data, setData, index}: RenderSocialsProps) => {
  const selection = useRef<SocialsType | null>(null);

  const handleValues = (item: SocialsType) => (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: DataType) => {
      const newData = {...prev};
      if (['titleAbout', 'descriptionAbout'].includes(item)) { // @ts-ignore
        newData.custom[index].data[item] = event.target.value;
      }
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

      if (item.network === 'whatsapp' && !isError && !PHONE.test(item.value || '')) {
        isError = true;
      }

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
      newSocials.splice(result.destination.index, 0, removed);
      // @ts-ignore
      newData.custom[index].data.socials = newSocials;
      return newData;
    });
  }

  const handleOnlyIcons = (onlyIcons: boolean) => {
    setData((prev: DataType) => {
      const newData = {...prev};
      if (onlyIcons) { // @ts-ignore
        if (!newData.custom[index].data) { newData.custom[index].data = {}; } // @ts-ignore
        newData.custom[index].data.socialsOnlyIcons = true;
      } else { // @ts-ignore
        delete newData.custom[index].data.socialsOnlyIcons;
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
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="facebook" selected={exists('facebook')}
            handleSelect={handleSelection} tooltip="Facebook" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="whatsapp" selected={exists('whatsapp')}
            handleSelect={handleSelection} tooltip="Whatsapp" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="twitter" selected={exists('twitter')}
            handleSelect={handleSelection} tooltip="Twitter" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="instagram" selected={exists('instagram')}
            handleSelect={handleSelection} tooltip="Instagram" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="youtube" selected={exists('youtube')}
            handleSelect={handleSelection} tooltip="YouTube" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="linkedin" selected={exists('linkedin')}
            handleSelect={handleSelection} tooltip="LinkedIn" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="pinterest" selected={exists('pinterest')}
            handleSelect={handleSelection} tooltip="Pinterest" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="telegram" selected={exists('telegram')}
            handleSelect={handleSelection} tooltip="Telegram" />
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
          <FormControlLabel label="Only icons" control={
            <Switch checked={data?.socialsOnlyIcons || false} inputProps={{'aria-label': 'onlyIcons'}}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleOnlyIcons(event.target.checked)} />} />
        )}
      </Grid>
    </Grid>
  );
}

export default RenderSocials;

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import {Type} from "../../types/types";
import SectionSelector from "../../helperComponents/SectionSelector";

interface EasinessProps {
  index: number;
  data?: Type;
  handleValues: Function;
}

export default function RenderEasiness({data, handleValues, index}: EasinessProps) {
  const handleSelection = (item: string) => {
    handleValues('easiness', index)(item);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'fit-content', margin: '0 auto'}}>
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="wifi" selected={data?.easiness?.wifi || false}
            handleSelect={handleSelection} tooltip="Wifi" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="accessible"
            selected={data?.easiness?.accessible || false} handleSelect={handleSelection} tooltip="Acessible" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="health"
            selected={data?.easiness?.health || false} handleSelect={handleSelection} tooltip="Health" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="toilet"
            selected={data?.easiness?.toilet || false} handleSelect={handleSelection} tooltip="Toilets and sinks" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="seat"
            selected={data?.easiness?.seat || false} handleSelect={handleSelection} tooltip="Seats" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="child"
            selected={data?.easiness?.child || false} handleSelect={handleSelection} tooltip="Children friendly" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="pets"
            selected={data?.easiness?.pets || false} handleSelect={handleSelection} tooltip="Pets friendly" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="park"
            selected={data?.easiness?.park || false} handleSelect={handleSelection} tooltip="Parks or open spaces" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="restaurant"
            selected={data?.easiness?.restaurant || false} handleSelect={handleSelection} tooltip="Restaurant" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="cafe"
            selected={data?.easiness?.cafe || false} handleSelect={handleSelection} tooltip="Cafeteria" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="bar"
            selected={data?.easiness?.bar || false} handleSelect={handleSelection} tooltip="Bar" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="fastfood"
            selected={data?.easiness?.fastfood || false} handleSelect={handleSelection} tooltip="Fast food" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="bed"
            selected={data?.easiness?.bed || false} handleSelect={handleSelection} tooltip="Bedrooms" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="shower"
            selected={data?.easiness?.shower || false} handleSelect={handleSelection} tooltip="Showers" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="gym"
            selected={data?.easiness?.gym || false} handleSelect={handleSelection} tooltip="Sports friendly" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="smoking"
            selected={data?.easiness?.smoking || false} handleSelect={handleSelection} tooltip="Smoking areas" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="climate"
            selected={data?.easiness?.climate || false} handleSelect={handleSelection} tooltip="Climate" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="training"
            selected={data?.easiness?.training || false} handleSelect={handleSelection} tooltip="Training" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="parking"
            selected={data?.easiness?.parking || false} handleSelect={handleSelection} tooltip="Parking" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="train"
            selected={data?.easiness?.train || false} handleSelect={handleSelection} tooltip="Train" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="bus"
            selected={data?.easiness?.bus || false} handleSelect={handleSelection} tooltip="Bus" />
          <SectionSelector
            icon="_" separate h='50px' w='50px' mw='50px' property="taxi"
            selected={data?.easiness?.taxi || false} handleSelect={handleSelection} tooltip="Taxi" />
        </Box>
      </Grid>
    </Grid>
  );
}

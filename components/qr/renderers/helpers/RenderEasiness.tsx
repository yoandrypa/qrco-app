import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import {CardDataProps, DataType} from "../../types/types";
import SquareSelector from "../../helperComponents/SquareSelector";

export default function RenderEasiness({data, setData}: CardDataProps) {
  const handleSelection = (item: string) => {
    setData((prev: DataType) => {
      const x = {...prev};
      if (!x.easiness) {
        x.easiness = {};
      }
      // @ts-ignore
      if (!x.easiness[item]) {
        // @ts-ignore
        x.easiness[item] = true;
      } else {
        // @ts-ignore
        delete x.easiness[item];
        if (!Object.keys(x.easiness).length) {
          delete x.easiness;
        }
      }
      return x;
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'fit-content', margin: '0 auto'}}>
          <SquareSelector
            selected={data.easiness?.wifi || false}
            tooltips
            item="wifi"
            label="WiFi"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.accessible || false}
            tooltips
            item="accessible"
            label="Accessible"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.health || false}
            tooltips
            item="health"
            label="Health"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.toilet || false}
            tooltips
            item="toilet"
            label="Toilets"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.seat || false}
            tooltips
            item="seat"
            label="Seats"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.child || false}
            tooltips
            item="child"
            label="Children friendly"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.pets || false}
            tooltips
            item="pets"
            label="Pets friendly"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.park || false}
            tooltips
            item="park"
            label="Parks or open spaces"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.restaurant || false}
            tooltips
            item="restaurant"
            label="Restaurant"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.cafe || false}
            tooltips
            item="cafe"
            label="Cafeteria"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.bar || false}
            tooltips
            item="bar"
            label="Bar"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.fastfood || false}
            tooltips
            item="fastfood"
            label="Fast food"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.bed || false}
            tooltips
            item="bed"
            label="Bedrooms"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.shower || false}
            tooltips
            item="shower"
            label="Showers"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.gym || false}
            tooltips
            item="gym"
            label="Sports friendly"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.smoking || false}
            tooltips
            item="smoking"
            label="Smoking areas"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.climate || false}
            tooltips
            item="climate"
            label="Climate"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.training || false}
            tooltips
            item="training"
            label="Training"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.parking || false}
            tooltips
            item="parking"
            label="Parking"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.train || false}
            tooltips
            item="train"
            label="Train"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.bus || false}
            tooltips
            item="bus"
            label="Bus"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.easiness?.taxi || false}
            tooltips
            item="taxi"
            label="Taxi"
            handleSelection={handleSelection}/>
        </Box>
      </Grid>
    </Grid>
  );
}

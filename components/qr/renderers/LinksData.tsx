import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';

import Common from '../helperComponents/Common';
import Topics from "./helpers/Topics";
import {isValidUrl} from "../../../utils";
import {DataType, LinkType} from "../types/types";
import Expander from "./helpers/Expander";
import RenderSocials from "./contents/RenderSocials";
import pluralize from "pluralize";
import socialsAreValid from "./validator";
import RenderLinks from "./contents/RenderLinks";
import RenderTitleDesc from "./contents/RenderTitleDesc";

interface LinksDataProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export default function LinksData({data, setData, handleValues, setIsWrong}: LinksDataProps) {
  const [expander, setExpander] = useState<string | null>(null);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setData((prev: DataType) => ({...prev, position: event.target.value}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const amount = data.socials?.length || 0;

  const linksAmount = useMemo(() => data.links?.length || 0, [data.links?.length]);
  const getMessage = useCallback((x: string) => {
    if (x === 'under') { return `Under the ${pluralize('URL', linksAmount)}`; }
    if (x === 'over') { return `Over the ${pluralize('URL', linksAmount)}`; }
    return 'In the middle of the URLs';
  }, [linksAmount, amount]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let isWrong = false;
    if (data?.links?.some((x: LinkType) => (!x.label.trim().length || !x.link.trim().length || !isValidUrl(x.link)))
      || !socialsAreValid(data)) {
      isWrong = true;
    }
    setIsWrong(isWrong);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="Add at least one link to your websites.">
      <Topics message="Main info" top="3px"/>
      <RenderTitleDesc handleValues={handleValues} title={data.titleAbout} description={data.descriptionAbout} header="Title and description" sx={{mt: 0}} index={-1} />
      <RenderLinks data={data} setData={setData} topics="Links" index={-1} />
      <Grid item xs={12}>
        <Divider sx={{my: 1}}/>
        <Paper elevation={2} sx={{p: 1, mt: 1}}>
          <Expander expand={expander} setExpand={setExpander} item="socials" title="Social information"/>
          {expander === "socials" && (
            <>
              {amount > 0 && (
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                  <Typography sx={{ my: 'auto' }}>{`Set the position of your social ${pluralize('networks', amount)}`}</Typography>
                  <FormControl sx={{m: 1, width: 250}} size="small">
                    <Select value={data?.position || 'under'} onChange={handleChange} renderValue={(x: string) => (
                      <Typography>{getMessage(x)}</Typography>
                    )}>
                      <MenuItem value="under">
                        <ListItemIcon>
                          <VerticalAlignBottomIcon color="primary" sx={{ mb: '2px', mr: '5px' }} />
                        </ListItemIcon>
                        <ListItemText>{getMessage('under')}</ListItemText>
                      </MenuItem>
                      {data.links && data.links.length > 1 && <MenuItem value="middle">
                        <ListItemIcon>
                          <VerticalAlignCenterIcon color="primary" sx={{ mb: '2px', mr: '5px' }} />
                        </ListItemIcon>
                        <ListItemText>{getMessage('middle')}</ListItemText>
                      </MenuItem>}
                      <MenuItem value="over">
                        <ListItemIcon>
                          <VerticalAlignTopIcon color="primary" sx={{ mb: '2px', mr: '5px' }} />
                        </ListItemIcon>
                        <ListItemText>{getMessage('over')}</ListItemText>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
              <RenderSocials data={data} setData={setData} index={-1}/>
            </>
          )}
        </Paper>
        <Divider sx={{my: 1}}/>
      </Grid>
    </Common>
  );
}

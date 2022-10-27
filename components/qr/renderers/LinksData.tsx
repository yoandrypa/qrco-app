import {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
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
import RenderTextFields from "./helpers/RenderTextFields";
import {DataType, LinkType} from "../types/types";
import Expander from "./helpers/Expander";
import RenderSocials from "./helpers/RenderSocials";
import pluralize from "pluralize";
import socialsAreValid from "./validator";
import {SOCIALS} from "../constants";

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
      return tempo;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeValue = useCallback((item: string, index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      // @ts-ignore
      tempo.links[index][item] = event.target.value;
      return tempo;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const amount = useMemo(() => {
    return Object.keys(data || {}).filter((x: string) => SOCIALS.includes(x)).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.facebook !== undefined, data?.whatsapp !== undefined, data?.twitter !== undefined, data?.instagram !== undefined, data?.linkedin !== undefined, data?.pinterest !== undefined, data?.telegram !== undefined, data?.youtube !== undefined]);

  const linksAmount = useMemo(() => data.links?.length || 0, [data.links?.length]);
  const getMessage = useCallback((x: string) => {
    if (x === 'under') { return `Under the ${pluralize('URL', linksAmount)}`; }
    if (x === 'over') { return `Over the ${pluralize('URL', linksAmount)}`; }
    return 'In the middle of the URLs';
  }, [linksAmount, amount]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let isWrong = false;
    if (!data?.title?.trim().length || data?.links?.some((x: LinkType) => (!x.label.trim().length ||
      !x.link.trim().length || !isValidUrl(x.link))) || !socialsAreValid(data)) {
      isWrong = true;
    }
    setIsWrong(isWrong);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!data.links?.length) {
      setData((prev: DataType) => ({...prev, links: [{label: '', link: ''}]}));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="Your contact details. Users can store your info or contact you right away.">
      <Topics message="Main info" top="3px"/>
      <Grid container spacing={1}>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {/* @ts-ignore */}
          <RenderTextFields item="title" label="Title" value={data?.title || ''} handleValues={handleValues} required/>
        </Grid>
        <Grid item sm={8} xs={12} style={{paddingTop: 0}}>
          {/* @ts-ignore */}
          <RenderTextFields item="about" label="Description" value={data?.about || ''} handleValues={handleValues}/>
        </Grid>
      </Grid>
      <Topics message="Links" top="3px" secMessage={data.links && `(${pluralize('link', data.links.length, true)})`}/>
      <TableContainer sx={{mt: '-8px'}}>
        <Table size="small">
          <TableBody>
            {data.links?.length && data.links.map((x: LinkType, index: number) => (
              <TableRow sx={{p: 0, width: '100%'}} key={`trow${index}`}>
                <TableCell sx={{p: 0, pr: 1, width: '50%', borderBottom: 'none'}}>
                  <RenderTextFields
                    required
                    placeholder="Enter the label here"
                    value={x.label}
                    handleValues={handleChangeValue('label', index)}
                  />
                </TableCell>
                <TableCell sx={{p: 0, width: '50%', borderBottom: 'none'}}>
                  <RenderTextFields
                    required
                    placeholder="Enter the URL link here"
                    value={x.link}
                    handleValues={handleChangeValue('link', index)}
                    isError={x.link.trim().length > 0 && !isValidUrl(x.link)}
                  />
                </TableCell>
                <TableCell sx={{p: 0, borderBottom: 'none'}} align="right">
                  {index === 0 ? (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid item xs={12}>
        <Divider sx={{my: 1}}/>
        <Paper elevation={2} sx={{p: 1, mt: 1}}>
          <Expander expand={expander} setExpand={setExpander} item="socials" title="Social information"/>
          {expander === "socials" && (
            <>
              {amount > 0 && (
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                  <Typography sx={{ my: 'auto' }}>{`Set the position of your social ${pluralize('networks', amount)}`}</Typography>
                  <FormControl sx={{m: 1, width: 200}} size="small">
                    <Select value={data?.position || 'under'} onChange={handleChange} renderValue={(x: string) => {
                      return <Typography>{getMessage(x)}</Typography>;
                    }}>
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
              <RenderSocials data={data} setData={setData}/>
            </>
          )}
        </Paper>
        <Divider sx={{my: 1}}/>
      </Grid>
    </Common>
  );
}

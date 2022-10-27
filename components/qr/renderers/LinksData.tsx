import {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";

import Common from '../helperComponents/Common';
import Topics from "./helpers/Topics";
import {EMAIL, PHONE, ZIP} from "../constants";
import {isValidUrl} from "../../../utils";
import RenderTextFields from "./helpers/RenderTextFields";
import {DataType, LinkType} from "../types/types";
import Expander from "./helpers/Expander";
import RenderSocials from "./helpers/RenderSocials";
import pluralize from "pluralize";

interface LinksDataProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export default function LinksData({data, setData, handleValues, setIsWrong}: LinksDataProps) {
  const [expander, setExpander] = useState<string | null>(null);

  const renderItem = (item: string, label: string, required?: boolean) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length) {
      if (['phone', 'fax'].includes(item) && !PHONE.test(value)) {
        isError = true;
      } else if (item === 'cell' && !PHONE.test(value)) {
        isError = true;
      } else if (item === 'zip' && !ZIP.test(value)) {
        isError = true;
      } else if (item === 'web' && !isValidUrl(value)) {
        isError = true;
      } else if (item === 'email' && !EMAIL.test(value)) {
        isError = true;
      }
    }

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={handleValues}
                             required={required || false}/>;
  };

  const add = () => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      tempo.links?.push({label: '', link: ''});
      return tempo;
    });
  };

  const remove = (index: number) => () => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      tempo.links?.splice(index, 1);
      return tempo;
    });
  };

  useEffect(() => {
    if (!data.links?.length) {
      setData((prev: DataType) => ({...prev, links: [{label: '', link: ''}]}));
    }
  }, []);

  return (
    <Common msg="Your contact details. Users can store your info or contact you right away.">
      <Topics message={'Main info'} top="3px"/>
      <Grid container spacing={1}>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem('title', 'Title', true)}
        </Grid>
        <Grid item sm={8} xs={12} style={{paddingTop: 0}}>
          {renderItem('about', 'Description')}
        </Grid>
      </Grid>
      <Topics message={'Links'} top="3px" secMessage={data.links && `(${pluralize('link', data.links.length, true)})`} />
      <TableContainer sx={{mt: '-8px'}}>
        <Table size="small">
          <TableBody>
            {data.links?.length && data.links.map((x: LinkType, index: number) => (
              <TableRow sx={{p: 0, width: '100%'}}>
                <TableCell sx={{p: 0, pr: 1, width: '50%', borderBottom: 'none'}}>
                  <RenderTextFields item="" label="" required placeholder="Enter the label here" value={x.label}
                                    handleValues={() => {
                                    }}/>
                </TableCell>
                <TableCell sx={{p: 0, width: '50%', borderBottom: 'none'}}>
                  <RenderTextFields item="" label="" required placeholder="Enter the URL link here" value={x.link}
                                    handleValues={() => {
                                    }}/>
                </TableCell>
                <TableCell sx={{p: 0, borderBottom: 'none'}} align="right">
                  {index === 0 ? (
                    <Tooltip title={'Add a link'}>
                      <IconButton onClick={add}>
                        <AddBoxIcon color="primary"/>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={'Remove link'}>
                      <IconButton onClick={remove(index)}>
                        <DeleteIcon color="error"/>
                      </IconButton>
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
          {expander === "socials" &&
            <RenderSocials data={data} setData={setData}/>}
        </Paper>
        <Divider sx={{my: 1}}/>
      </Grid>
    </Common>
  );
}

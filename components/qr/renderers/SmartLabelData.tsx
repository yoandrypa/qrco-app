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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Common from '../helperComponents/Common';
import Topics from "./helpers/Topics";
import {isValidUrl} from "../../../utils";
import RenderTextFields from "./helpers/RenderTextFields";
import {DataType, LinkType} from "../types/types";
import Expander from "./helpers/Expander";
import RenderSocials from "./helpers/RenderSocials";
import pluralize from "pluralize";
import socialsAreValid from "./validator";
import RenderProposalsTextFields from "./helpers/RenderProposalsTextFields";

interface SmartLabelDataProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  background: isDragging ? "#ebe8e1" : "none",
  ...draggableStyle
});

export default function SmartLabelData({data, setData, handleValues, setIsWrong}: SmartLabelDataProps) {
  const [expander, setExpander] = useState<string | null>(null);

  const handleChange = useCallback((event: SelectChangeEvent) => {
    setData((prev: DataType) => ({...prev, position: event.target.value}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const add = useCallback(() => {
    // setData((prev: DataType) => {
    //   const tempo = {...prev};
    //   tempo.links?.push({label: '', link: ''});
    //   return tempo;
    // });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = useCallback((index: number) => () => {
    // setData((prev: DataType) => {
    //   const tempo = {...prev};
    //   tempo.links?.splice(index, 1);
    //   if (tempo.links?.length === 1 && data?.position === 'middle') {
    //     delete data.position; // under by default
    //   }
    //   return tempo;
    // });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeValue = useCallback((item: string, index: number) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    // setData((prev: DataType) => {
    //   const tempo = {...prev};
    //   // @ts-ignore
    //   tempo.links[index][item] = payload.target?.value !== undefined ? payload.target.value : payload;
    //   return tempo;
    // });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const amount = data.socials?.length || 0;

  const linksAmount = useMemo(() => data.links?.length || 0, [data.links?.length]);
  const getMessage = useCallback((x: string) => {
    if (x === 'under') { return `Under the ${pluralize('URL', linksAmount)}`; }
    if (x === 'over') { return `Over the ${pluralize('URL', linksAmount)}`; }
    return 'In the middle of the URLs';
  }, [linksAmount, amount]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragEnd = (result: any) => {
    if (!result?.destination) {
      return null;
    }

    setData((prev: DataType) => {
    //   const tempo = {...prev};

    //   const newLinks = Array.from(tempo.links || []);
    //   const [removed] = newLinks.splice(result.source.index, 1);
    //   newLinks.splice(result.destination.index, 0, removed);

    //   tempo.links = newLinks;
    //   return tempo;
    });
  }

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
    // smart Label msg
    <Common msg="Smart Label">
      <Topics message="Main info" top="3px"/>
      
    </Common>
  );
}

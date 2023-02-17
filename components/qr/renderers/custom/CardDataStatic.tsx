import {useEffect, useState} from 'react';
import Box from "@mui/material/Box";

import Common from '../../helperComponents/Common';
import Expander from "../helpers/Expander";
import {EMAIL, PHONE, ZIP} from "../../constants";
import {DataType} from "../../types/types";
import {isValidUrl} from "../../../../utils";

import dynamic from "next/dynamic";
import RenderPresentation from "../contents/RenderPresentation";
import RenderPhones from "../contents/RenderPhones";
import RenderOrganization from "../contents/RenderOrganization";
import Paper from "@mui/material/Paper";

const RenderAddressData = dynamic(() => import("../contents/RenderAddressData"));
const RenderEmailWeb = dynamic(() => import("../contents/RenderEmailWeb"));

interface CardDataProps {
  data: DataType;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export default function CardDataStatic({data, handleValues, setIsWrong}: CardDataProps) {
  const [expander, setExpander] = useState<string | null>(null);

  useEffect(() => {
    let errors = false;
    if (!data.firstName?.trim().length || (data.phone?.trim().length && !PHONE.test(data.phone)) ||
      (data.fax?.trim().length && !PHONE.test(data.fax)) || (data.cell?.trim().length && !PHONE.test(data.cell)) ||
      (data.zip?.trim().length && !ZIP.test(data.zip)) || (data.web?.trim().length && !isValidUrl(data.web)) ||
      (data.email?.trim().length && !EMAIL.test(data.email))) {
      errors = true;
    }

    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="Your contact details. Users can store your info or contact you right away.">
      <Box sx={{my: 4, width: '100%'}}>
        <Paper elevation={2} sx={{p: 1}}>
          <RenderPresentation data={data} handleValues={handleValues} message="Presentation" index={-1} />
          <RenderPhones data={data} handleValues={handleValues} message="Phones" index={-1} />
          <RenderOrganization data={data} handleValues={handleValues} message="Organization" index={-1} />
        </Paper>
        <Paper elevation={2} sx={{p: 1, mt: 2}}>
          <Expander expand={expander} setExpand={setExpander} item="address" title="Address and other info"/>
          {expander === "address" && (
            <Box sx={{width: '100%'}}>
              <RenderAddressData data={data} handleValues={handleValues} index={-1} />
              <RenderEmailWeb data={data} handleValues={handleValues} sx={{ mt: 1 }} index={-1} />
            </Box>
          )}
        </Paper>
      </Box>
    </Common>
  );
}

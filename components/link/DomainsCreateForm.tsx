import FormControl from "@mui/material/FormControl";
import React from "react";
import { isValidUrl } from "../../utils";
import Router from "next/router";
import * as DomainHandler from "../../handlers/domains";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

interface State {
  address?: string;
  homepage?: string;
}

const initialState: State = {
  address: "",
  homepage: ""
};

const DomainsCreateForm = ({ user }: any) => {
  const [values, setValues] = React.useState<State>(initialState);
  const [loading, setLoading] = React.useState(false);

  const handleCreateDomain = async () => {
    try {
      const domain = await DomainHandler.create({
        // @ts-ignore
        body: {
          ...values,
          userId: user?.attributes?.sub
        }
      });
      if (domain) {
        setValues(initialState);
        await Router.push("/settings");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validUrl = (values.homepage && !isValidUrl(values.homepage)) === true;

  return (
    <Grid container spacing={2}>
      <Grid item xs={5}>
        <TextField
          //error={validUrl}
          id="input-domain"
          size="small"
          type="text"
          value={values.address}
          onChange={handleChange("address")}
          label="DomainModel"
          fullWidth
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          error={validUrl}
          id="input-homepage"
          size="small"
          type="text"
          value={values.homepage}
          onChange={handleChange("homepage")}
          label="Homepage"
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <Button fullWidth variant="contained" disabled={validUrl} onClick={handleCreateDomain}>Add domain</Button>
      </Grid>
    </Grid>
  )
    ;
};
export default DomainsCreateForm;

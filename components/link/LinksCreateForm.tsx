import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import FormControl from "@mui/material/FormControl";
import React from "react";
import { generateId, isValidUrl } from "../../utils";
import Router from "next/router";
import * as LinkHandler from "../../handlers/links";
import LinksCreateFormOptions from "./LinksCreateFormOptions";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as DomainHandler from "../../handlers/domains";
import Context from "../context/Context";

interface State {
  password?: string;
  customUrl?: string;
  description?: string;
  expireIn?: string | null;
  domain?: string;
  target: string;
}

const initialState: State = {
  password: "",
  customUrl: "",
  description: "",
  expireIn: null,
  domain: "",
  target: ""
};

const LinksCreateForm = ({ domains, user }: any) => {
  const [values, setValues] = React.useState<State>(initialState);
  const [checked, setChecked] = React.useState(false);
  // @ts-ignore
  const { setLoading } = React.useContext(Context);

  const handleCreateLink = async () => {
    try {
      setLoading(true);
      const address = await generateId();
      // @ts-ignore
      const domain = "";//TODO values.domain ? await DomainHandler.get(values.domain) : values.domain;
      const link = await LinkHandler.create({
        // @ts-ignore
        body: {
          ...values,
          reuse: true,
          // @ts-ignore
          domain,
          customUrl: values.customUrl || address
        },
        user: { id: user?.attributes?.sub }
      });
      if (link) {
        setValues(initialState);
        setChecked(false);
        Router.push("/links").then(() => setLoading(false));
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };
  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const validUrl = (values.target && !isValidUrl(values.target)) === true;

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="input-link">Link</InputLabel>
      <OutlinedInput
        error={validUrl}
        id="input-link"
        size="small"
        type="text"
        value={values.target}
        onChange={handleChange("target")}
        label="Link"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="create new short link"
              onClick={handleCreateLink}
              edge="end"
              disabled={validUrl}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
      <FormControlLabel control={
        <Checkbox
          checked={checked}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setChecked(event.target.checked);
          }}
        />}
                        label="Show advanced options"
      />
      {checked && <LinksCreateFormOptions domains={domains} parentValues={values} parentHandleChange={handleChange} />}
    </FormControl>
  );
};
export default LinksCreateForm;

import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { PRIMARY_LIGHT_COLOR } from "../../consts";
import Grid from "@mui/material/Grid";

import * as UserHandler from "../../handlers/users";
import * as LinkHandler from "../../handlers/links";
import Router from "next/router";
import Context from "../context/Context";

export default function LinkEditForm({ open, setOpen, linkForEdit, user }: any) {
  const [values, setValues] = useState(linkForEdit);
  // @ts-ignore
  const { setLoading } = React.useContext(Context);

  const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateLink = async () => {
    try {
      setLoading(true);
      const userData = await UserHandler.get(user?.attributes?.sub);
      //const domain = await DomainHandler.find({ id: values.domain }) || null;
      const link = await LinkHandler.edit({
        body: {
          ...values,
          expireIn: null
        },
        user: userData
      });
      if (link) {
        setOpen(false);
        Router.push("/links").then(() => setLoading(false));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle color="white" style={{ backgroundColor: PRIMARY_LIGHT_COLOR }}>Edit link</DialogTitle>
        <DialogContent dividers sx={{
          display: "flex",
          flexDirection: "column",
          m: "auto",
          width: "fit-content"
        }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                id="target-text"
                autoComplete="off"
                value={values.target}
                label="Target"
                onChange={handleChange("target")}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="address-text"
                autoComplete="off"
                value={values.address}
                placeholder="Custom address"
                label="/"
                onChange={handleChange("address")}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="expires-in-text"
                value={values.expireIn}
                label="Expire in"
                placeholder="2 minutes/hours/days"
                onChange={handleChange("expireIn")}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="description-text"
                value={values.description}
                label="Description"
                onChange={handleChange("description")}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateLink}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

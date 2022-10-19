import {useMemo} from "react";
import CardContent from "@mui/material/CardContent";
import MainMicrosite from "./MainMicrosite";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

import Link from 'next/link'
import {getColors} from "./renderers/helper";
import RenderField from "./renderers/RenderField";
import {humanDate} from "../../helpers/generalFunctions";
import RenderAddress from "./renderers/RenderAddress";

interface CouponProps {
  newData: any;
}

export default function Coupons({newData}: CouponProps) {
  const colors = useMemo(() => (getColors(newData)), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainMicrosite colors={colors} url={newData.shortlinkurl} badge={newData.prefix} type={newData.qrType}>
      <CardContent>
        <Grid container spacing={1}>
          {(newData.company || newData.title || newData.about || newData.urlOptionLink) && (
            <>
              <Grid item xs={1}>
                <PlaylistAddCheckIcon sx={{color: colors.p}}/>
              </Grid>
              <Grid item xs={11}>
                <Grid container spacing={1}>
                  {newData.company && <RenderField label="Company" value={newData.company} />}
                  {newData.title && <RenderField label="Title" value={newData.title} />}
                  {newData.about && <RenderField label="Description" value={newData.about} />}
                  {newData.urlOptionLink && (
                    <Grid item xs={12} style={{paddingTop: 0}}>
                      <Link href={newData.urlOptionLink}>
                        <Button
                          variant="contained"
                          sx={{
                            height: '28px',
                            width: '100%',
                            color: colors.p,
                            background: colors.s,
                            my: '5px',
                            '&:hover': {color: colors.s, background: colors.p}}}>
                          {newData.urlOptionLabel || 'Get link'}
                        </Button>
                      </Link>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </>
          )}
          {(newData.name || newData.value || newData.text) && (
            <>
            <Grid item xs={1}>
              <ConfirmationNumberIcon sx={{color: colors.p}}/>
            </Grid>
            <Grid item xs={11}>
              <Grid container spacing={1}>
                {newData.name && <RenderField label="Coupon code" value={newData.name} />}
                {newData.value && <RenderField label="Valid until" value={humanDate(newData.value, 'en', true)} />}
                {newData.text && <RenderField label="Terms and conditions" value={newData.text} />}
              </Grid>
            </Grid>
            </>
          )}
          <RenderAddress newData={newData} colors={colors} />
        </Grid>
      </CardContent>
    </MainMicrosite>
  );
}

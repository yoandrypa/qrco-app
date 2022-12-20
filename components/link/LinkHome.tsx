import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinksTable from "./LinksTable";
import LinksCreateForm from "./LinksCreateForm";

export default function LinkHome({ linksData, domainsData, userInformation }: any) {
  const { data, total } = JSON.parse(linksData);
  const domains = JSON.parse(domainsData);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LinksCreateForm user={userInformation} domains={domains} />
        </Grid>
        {data &&
          <Grid item xs={12}>
            <LinksTable links={data} total={total} user={userInformation} domains={domains} />
          </Grid>
        }
      </Grid>
    </Box>
  );
};

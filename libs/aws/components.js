import React from "react";
import { Heading, Image, useTheme,} from "@aws-amplify/ui-react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from '@mui/material/Alert'

const components = {
  Header() {
    return (
      <>    
        <Stack direction="row" padding={ 2 } spacing={ 2 } alignItems="flex-end" justifyContent="center" margin={2}>
        <Image
          alt="Ebanux logo"
          src="/ebanuxQr.svg"
          height="12%"
          width="12%"
        />
        <Typography variant="h4" sx={ { fontWeight: "bold" } }>The QR Link</Typography>    
      </Stack>
      <Stack direction="row" spacing={ 2 } alignItems="flex-end" justifyContent="center" margin={2}>
    <Image
        alt="Ebanux Logo"
        src='/ebanux.svg'
        height='20%'
        width='20%'
        />
        <Typography sx={{mt:2}} variant="caption" >Powered by Ebanux</Typography>
      </Stack>
      </>

    );
  },
  SignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={ `${ tokens.space.xl } 0 0 ${ tokens.space.xl }` } level={ 5 }>
        </Heading>
      );
    }
  },
  SignUp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={ `${ tokens.space.xl } 0 0 ${ tokens.space.xl }` } level={ 5 }>
          <Alert severity="info">
            Password must be at least 8 characters long, and contain one or more special symbols (like @,%,#) and capital letters.
          </Alert>
        </Heading>
      );
    },
   
  },
  
};

export const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'your@email.com',
    },
  },
  signUp: {
    username:{
      label: 'Email',
      placeholder: 'your@email.com',
      order: 1
    },
    password: {
      label: 'Password:',
      placeholder: 'Enter your Password:',
      isRequired: true,
      order: 2,
    }  
  }
}

export default components;

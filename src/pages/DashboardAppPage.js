import { Helmet } from 'react-helmet-async';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

import {

  AppWidgetAlarmTunedOn,

} from '../sections/@dashboard/app';
import { useStateContext } from '../context/ContextProvider';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const {alarmsC,alarmsA} = useStateContext();

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, bienvenido
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} >
            <AppWidgetAlarmTunedOn title="Alarms Tuned On" 
            alarms={alarmsC} activeAlarm={alarmsA} icon={'ant-design:android-filled'} 
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}
            sx={ {
              bgcolor: 'background.default',
              borderStyle: 'dashed',
            }}
          >
             <Typography variant="h4">
            Just another widget to be implement in future sprints ...
             </Typography>
            
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

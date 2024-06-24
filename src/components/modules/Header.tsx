import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Unstable_Grid2';
import logo from '../../img/logo.png';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar sx={{py: 1}}>
        <Box sx={{ flexGrow: 1}}>
        <Grid container>
              <Grid xs={4}></Grid>
              <Grid justifyContent="center" xs={4}>
                <img src={logo} alt='logo' style={{width: 50}}></img>
              </Grid>
              <Grid xs={4}></Grid>
          </Grid>
        </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// App.tsx
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import CameraApp from "./components/modules/CameraApp";
import Header from "./components/modules/Header";


const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Box sx={{ flexGrow: 1}}>
        <Grid container justifyContent="center">
          <Grid item xs={9}>
            <CameraApp/>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;


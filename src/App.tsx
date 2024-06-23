// App.tsx
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import CameraApp from "./components/modules/CameraApp";
import Header from "./components/modules/Header";

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Box sx={{ flexGrow: 1, width: '100%'}}>
        <Grid container justifyContent="center">
          <Grid xs={12}>
            <CameraApp/>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;


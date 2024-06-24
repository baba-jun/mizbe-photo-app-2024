// App.tsx
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import CameraApp from "./components/modules/CameraApp";
import LogoCharaAFrame from './frame/logo-charaA-frame.png';
import LogoCharaBFrame from './frame/logo-charaB-frame.png';
import LogoCharaCFrame from './frame/logo-charaC-frame.png';
import LogoFrame from './frame/logo-frame.png';

const theme = createTheme();
const frame = [
  LogoFrame,
  LogoCharaAFrame,
  LogoCharaBFrame,
  LogoCharaCFrame,
];

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, width: '100%'}}>
        <Grid container justifyContent="center">
          <Grid xs={12}>
            <CameraApp bgColor='linear-gradient(to bottom right, #6b4e9b, #5a85cc)' frames={frame}/>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;


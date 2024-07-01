// App.tsx
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import CameraApp from "./components/modules/CameraApp";
import LogoCharaAtateFrame from './frame/logo-charaA-frame.png';
import LogoCharaBtateFrame from './frame/logo-charaB-frame.png';
import LogoCharaCtateFrame from './frame/logo-charaC-frame.png';
import LogotateFrame from './frame/logo-frame.png';
import ClocksquareFrame from './frame/mizbe2024_frame_01_square.png';
import ClockyokoFrame from './frame/mizbe2024_frame_01_yoko.png';

const theme = createTheme();
const tateFrame = [
  LogotateFrame,
  LogoCharaAtateFrame,
  LogoCharaBtateFrame,
  LogoCharaCtateFrame,
];
const yokoFrame = [
  ClockyokoFrame,
]

const squareFrame = [
  ClocksquareFrame,
]

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, width: '100%'}}>
        <Grid container justifyContent="center">
          <Grid xs={12}>
            <CameraApp bgColor='linear-gradient(to bottom right, #6b4e9b, #5a85cc)' tateframes={tateFrame} yokoframes={yokoFrame} squareframes={squareFrame}/>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;


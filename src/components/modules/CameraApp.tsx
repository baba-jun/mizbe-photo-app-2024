import CameraRoundedIcon from '@mui/icons-material/CameraRounded';
import CameraswitchRoundedIcon from '@mui/icons-material/CameraswitchRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Unstable_Grid2';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useEffect, useRef, useState } from 'react';
import Carousel from './Carousel';



const theme = createTheme({
  palette: {
    secondary: {
      main: '#FFFFFF',
    },
  },
});

const CameraApp = (props: {bgColor: string, frames: string[]}) => {
  const {bgColor} = props
  const {frames} = props
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>(frames[0]);

  const getDevices = async (): Promise<void> => {
    await navigator.mediaDevices.getUserMedia({ video: true });
    try {
      const mediaDevices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
      const videoDevices: MediaDeviceInfo[] = mediaDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting devices:', error);
    }
  };

  const getStream = async (): Promise<void> => {
    if (selectedDeviceId) {
      try {
        if (stream) {
          stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }
        const newStream: MediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 3000 },
            height: { ideal: 3000 },
            aspectRatio: { exact: 1.5 }
          },
        });
        setStream(newStream);
        if (videoRef.current) {
          (videoRef.current as HTMLVideoElement).srcObject = newStream;
        }
      } catch (error) {
        console.error('Error getting stream:', error);
      }
    }
  };

  const takePicture = (): void => {
    if (canvasRef.current && videoRef.current) {
      const context: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
      if (context) {
        const FrameImg = new Image();
        FrameImg.src = selectedImage;
        canvasRef.current.height = videoRef.current.videoHeight;
        canvasRef.current.width = canvasRef.current.height / 1.5;
        const OriginalVideoWidth: number = videoRef.current.videoWidth;
        const CroppedVideoWidth: number = canvasRef.current.width;
        const OriginalVideoHeight: number = canvasRef.current.height;
        context.drawImage(
          videoRef.current,
          (OriginalVideoWidth - CroppedVideoWidth) / 2,
          0,
          CroppedVideoWidth,
          OriginalVideoHeight,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        context.drawImage(FrameImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPhotoDataUrl(dataUrl);
        setIsModalOpen(true);
      }
    }
  };

  const switchCamera = (): void => {
    if (devices.length > 1) {
      const currentIndex: number = devices.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex: number = (currentIndex + 1) % devices.length;
      setSelectedDeviceId(devices[nextIndex].deviceId);
    }
  };

  const savePicture = (): void => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'photo.png';
      link.click();
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const drawImageOnCanvas = (imageSrc: string): void => {
    setSelectedImage(imageSrc);
  };


  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    getStream();
  }, [selectedDeviceId]);


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: '100%' }}>
        <Box sx={{
            position: 'relative',
            width: '100%',
            marginBottom: '-4px',
            }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', objectFit: 'cover', aspectRatio: '2/3', objectPosition: 'center' }} />
          <img src={selectedImage} alt='frame-img' style={{position: 'absolute', top: 0, left: 0, width: '100%', objectFit: 'cover'}}/>
        </Box>
          <Box sx={{
            flexGrow: 1,
            textAlign: 'center',
            position: 'relative',
            padding: '2.5vh 2vw',
            background: bgColor,
            }}>
            <Grid container>
              <Grid justifyContent="center" xs={4}>
                <Button color='secondary' onClick={switchCamera}><CameraswitchRoundedIcon sx={{ fontSize: 50, "@media screen and (min-width:700px)":{fontSize: 60}  }} /></Button>
              </Grid>
              <Grid justifyContent="center" xs={4}>
                <Button color='secondary' onClick={takePicture}><CameraRoundedIcon sx={{ fontSize: 50, "@media screen and (min-width:700px)":{fontSize: 60}  }} /></Button>
              </Grid>
              <Grid xs={4}></Grid>
            </Grid>
          </Box>
        <Box sx={{ py: 2, textAlign: 'center', backgroundColor: '#262626' }}>
          <Carousel images={frames} onImageSelect={drawImageOnCanvas} />
        </Box>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Modal sx={{ width: '70%', margin: 'auto' }} open={isModalOpen} onClose={handleCloseModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid justifyContent="center" xs={12}>
                  {photoDataUrl && <img src={photoDataUrl} alt="Captured" style={{ width: '100%' }} />}
                </Grid>
                <Grid justifyContent="center" sx={{ textAlign: 'left' }} xs={4}>
                  <IconButton onClick={handleCloseModal}><KeyboardReturnRoundedIcon sx={{ fontSize: 40, "@media screen and (min-width:700px)":{fontSize: 60} }}></KeyboardReturnRoundedIcon></IconButton>
                </Grid>
                <Grid justifyContent="center" xs={4}>
                  <IconButton onClick={savePicture}><DownloadRoundedIcon sx={{ fontSize: 70, color: '#00a0e9' }}></DownloadRoundedIcon></IconButton>
                </Grid>
                <Grid justifyContent="center" xs={4}>

                </Grid>
                <Grid xs={4}></Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default CameraApp;

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
import React, { useEffect, useRef, useState } from 'react';
import frameBlue from '../../frame/frame-blue.png';
import frameGreen from '../../frame/frame-green.png';
import framePurple from '../../frame/frame-purple.png';
import frameRed from '../../frame/frame-red.png';
import frameYellow from '../../frame/frame-yellow.png';
import Carousel from './Carousel';



const theme = createTheme({
  palette: {
    secondary: {
      main: '#FFFFFF',
    },
  },
});

const CameraApp: React.FC = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = [
      frameRed,
      frameBlue,
      frameGreen,
      framePurple,
      frameYellow,
  ];
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);


  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting devices:', error);
      }
    };
    getDevices();
  }, []);

  useEffect(() => {
    const getStream = async () => {
      if (selectedDeviceId) {
        try {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: selectedDeviceId },
              width: { ideal: 720 },
              height: { ideal: 1080 },
            },
          });
          setStream(newStream);
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
        } catch (error) {
          console.error('Error getting stream:', error);
        }
      }
    };
    getStream();
  }, [selectedDeviceId]);

  const takePicture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const FrameImg = new Image();
        FrameImg.src = selectedImage;
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(FrameImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPhotoDataUrl(dataUrl);
        setIsModalOpen(true);
      }
    }
  };

  const savePicture = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'photo.png';
      link.click();
    }
  };

  const switchCamera = () => {
    if (devices.length > 1) {
      const currentIndex = devices.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % devices.length;
      setSelectedDeviceId(devices[nextIndex].deviceId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const drawImageOnCanvas = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='camera-container'>
        <div className='video-container'>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
          <img src={selectedImage} alt='frame-img' />
        </div>
        <div className='camera-control-container'>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Grid container>
              <Grid justifyContent="center" xs={4}>
                <Button color='secondary' onClick={switchCamera}><CameraswitchRoundedIcon sx={{ fontSize: 50 }} /></Button>
              </Grid>
              <Grid justifyContent="center" xs={4}>
                <Button color='secondary' onClick={takePicture}><CameraRoundedIcon sx={{ fontSize: 50 }} /></Button>
              </Grid>
              <Grid xs={4}></Grid>
            </Grid>
          </Box>
        </div>
        <Box sx={{ mt: 2, textAlign: 'center'  }}>
            <Carousel images={images} onImageSelect={drawImageOnCanvas} />
          </Box>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Grid container spacing={2} alignItems="flex-end">
                    <Grid justifyContent="center" xs={12}>
                      {photoDataUrl && <img src={photoDataUrl} alt="Captured" style={{ maxWidth: '100%', maxHeight: '40vh' }} />}
                    </Grid>
                    <Grid justifyContent="center" xs={4}>
                        <IconButton onClick={handleCloseModal}><KeyboardReturnRoundedIcon sx={{ fontSize: 50 }}></KeyboardReturnRoundedIcon></IconButton>
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
      </div>
    </ThemeProvider>
  );
};

export default CameraApp;

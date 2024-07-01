import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import CameraRoundedIcon from '@mui/icons-material/CameraRounded';
import CameraswitchRoundedIcon from '@mui/icons-material/CameraswitchRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import '../../css/index.css';
import Carousel from './Carousel';
import getCroppedImg from './getCroppedImg';


const theme = createTheme({
  palette: {
    secondary: {
      main: '#FFFFFF',
    },
  },
});



const CameraApp = (props: {bgColor: string, tateframes: string[], yokoframes: string[], squareframes: string[]}) => {
  const {bgColor} = props
  const {tateframes: tateFrames} = props
  const {yokoframes: yokoFrames} = props
  const {squareframes: squareFrames} = props
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [base64Image, setBase64Image] = useState<string>('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadedImageRef = useRef<HTMLImageElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>(tateFrames[0]);
  const checkNames = ['mirorSwitch'] as const;
  type checkName = typeof checkNames[number];
  const [selectedMirorMode, setSelectedMirorMode] = useState<Record<checkName, boolean>>({
    mirorSwitch: false,
  });
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  const [aspectRate, setAspectRate] = useState<number>(1.5)

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
        canvasRef.current.width = canvasRef.current.height / aspectRate;
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

  const drawUploadImage = (): void => {
    if(canvasRef.current && uploadedImageRef.current){
      const context: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
      if (context) {
        const FrameImg = new Image();
        FrameImg.src = selectedImage;
        canvasRef.current.height = uploadedImageRef.current.height;
        canvasRef.current.width = uploadedImageRef.current.width;
        context.drawImage(
          uploadedImageRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        context.drawImage(FrameImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpg');
        setPhotoDataUrl(dataUrl);
        setIsModalOpen(true);
      }
    }
  }

  const switchCamera = (): void => {
    if (devices.length > 1) {
      const currentIndex: number = devices.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex: number = (currentIndex + 1) % devices.length;
      setSelectedDeviceId(devices[nextIndex].deviceId);
      setSelectedMirorMode(prevState => ({
        ...prevState,
        'mirorSwitch' : false,
      }))
    }
  };

  const importPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(files){
      const uploadImageFile = files[0]
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          return;
        }
        setBase64Image(result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(uploadImageFile);
    }
  }

  const savePicture = (): void => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/jpg');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'photo.png';
      link.click();
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);


  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleCropCloseModal = async (): Promise<void> => {
    if(!croppedAreaPixels) return;
    try{
      const croppedImage = await getCroppedImg(base64Image,croppedAreaPixels);
      setBase64Image(croppedImage)
    }catch (e){
      console.error(e)
    }
    setIsCropModalOpen(false);
  };
  const drawImageOnCanvas = (imageSrc: string): void => {
    setSelectedImage(imageSrc);
  };

  const changemirorSwitch = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const {name, checked} = event.target;
    setSelectedMirorMode(prevState => ({
      ...prevState,
      [name] : checked,
    }))
  }

  const deleteImageLoaded = (): void =>{
    setBase64Image('')
  }

  const changeAspect = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const cameraView = document.getElementById('cameraView')!
    setAspectRate(Number(event.target.value))
    cameraView.style.aspectRatio = String(1/aspectRate)
  }


  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    getStream();
  }, [selectedDeviceId]);

  useEffect(() => {
    const cameraView = document.getElementById('cameraView')!
    if(base64Image){
      setIsImageLoaded(true);
      cameraView.style.display = 'none'
    }else{
      setIsImageLoaded(false);
      cameraView.style.display = 'block'
    }
  },[base64Image])


  useEffect(() =>{
    const cameraView = document.getElementById('cameraView')!
    if(selectedMirorMode['mirorSwitch']){
      cameraView.style.transform = 'scaleX(-1)'
    }else{
      cameraView.style.transform = 'scaleX(1)'
    }
  },[selectedMirorMode])

  useEffect(() =>{
    switch (aspectRate){
      case 1.5:
        setSelectedImage(tateFrames[0])
      break;

    case 1.0:
        setSelectedImage(squareFrames[0])
      break;

    case 0.67:
        setSelectedImage(yokoFrames[0])
      break
    default:
      setSelectedImage(tateFrames[0])
    }
  },[aspectRate])


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: '100%' }}>
        <Box sx={{
            position: 'relative',
            width: '100%',
            marginBottom: '-4px',
            }}>
          <video id="cameraView" ref={videoRef} autoPlay playsInline style={{ width: '100%', objectFit: 'cover', aspectRatio: String(1/aspectRate), objectPosition: 'center', display: base64Image && !isCropModalOpen ? 'none' : 'block'}} />
          <img id='uploadedImage' ref={uploadedImageRef} src={base64Image} style={{ width: '100%', objectFit: 'cover', objectPosition: 'center', display: isImageLoaded && !isCropModalOpen  ? 'block' : 'none'}} />
          <img id="frameImage" src={selectedImage} alt='frame-img' style={{position: 'absolute', top: 0, left: 0, width: '100%', objectFit: 'cover'}}/>
        </Box>
        <div className='camera-control-area'>
          <Box sx={{
            flexGrow: 1,
            textAlign: 'center',
            position: 'relative',
            padding: '2.5vh 0vh 2vw 2vw',
            background: bgColor,
            }}
            >
            <Grid container>
              <Grid justifyContent="center" xs={4}>
              {!isImageLoaded &&<Button color='secondary' onClick={switchCamera} ><CameraswitchRoundedIcon sx={{ fontSize: 50, "@media screen and (min-width:700px)":{fontSize: 60} }} /></Button>
              }
              {isImageLoaded && <Button color='secondary' onClick={deleteImageLoaded} component="label"><CameraAltRoundedIcon sx={{ fontSize: 50, "@media screen and (min-width:700px)":{fontSize: 60}  }}/></Button>}
              </Grid>
              <Grid justifyContent="center" xs={4}>
                {!isImageLoaded && <Button color='secondary' onClick={takePicture}><CameraRoundedIcon sx={{ fontSize: 50, "@media screen and (min-width:700px)":{fontSize: 60}}} /></Button>}
                {isImageLoaded && <Button color='secondary' onClick={drawUploadImage}><CheckCircleRoundedIcon sx={{ fontSize: 50, "@media screen and (min-width:700px)":{fontSize: 60}}}></CheckCircleRoundedIcon></Button>}
              </Grid>
              <Grid xs={4}>
              <Button
                color='secondary'
                component="label"
                >
                <AddPhotoAlternateRoundedIcon sx={{ fontSize: 50, "@media screen and (min-width:700px)":{fontSize: 60}  }}/>
                <input
                    type="file"
                    className="inputFileBtnHide"
                    onChange={importPicture}
                    style={{width:0}}
                  />
                </Button>
              </Grid>
            </Grid>
            <Grid container sx={{marginTop: '0.5rem'}}>
            <Grid justifyContent="center" xs={4}>
            {!isImageLoaded && <span className="guide-label">カメラ切り替え</span>}
            {isImageLoaded && <span className="guide-label">カメラに戻る</span>}
            </Grid>
            <Grid justifyContent="center" xs={4}>
            {!isImageLoaded && <span className="guide-label">撮影</span>}
            {isImageLoaded && <span className="guide-label">保存画面へ</span>}
            </Grid>
            <Grid justifyContent="center" xs={4}>
              <span className="guide-label">アルバムから</span>
            </Grid>
            </Grid>
            <Grid container sx={{marginTop: '1rem'}}>
              <Grid justifyContent="center" xs={4}>
              </Grid>
              <Grid justifyContent="center" xs={4}>
              {!isImageLoaded &&
                  <FormControlLabel
                      control={<Switch
                      color="warning"
                      name="mirorSwitch"
                      checked={selectedMirorMode['mirorSwitch']}
                      onChange={changemirorSwitch}
                      />}
                    label="鏡表示"
                    labelPlacement="bottom"
                  />
                      }
              </Grid>
              <Grid xs={4}></Grid>
            </Grid>
            <Grid container sx={{marginTop: '1.5rem'}}>
            <Grid justifyContent="center" xs={12}>
            <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                defaultValue={1.5}
                onChange={changeAspect}
              >
                <FormControlLabel value={1.5} control={<Radio color='secondary' />} label="縦長" />
                <FormControlLabel value={0.67} control={<Radio  color='secondary'/>} label="横長" />
                <FormControlLabel value={1} control={<Radio  color='secondary'/>} label="正方形" />
              </RadioGroup>
              </FormControl>
              </Grid>
            </Grid>
          </Box>
          </div>
        <Box sx={{ py: 2, textAlign: 'center', backgroundColor: '#262626' }}>
          <Carousel tateImages={tateFrames} yokoImages={yokoFrames} squareImages={squareFrames} rate={aspectRate} onImageSelect={drawImageOnCanvas} />
        </Box>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <Modal sx={{ width: {md: '50%', sm: '65%', xs: '65%'}, maxWidth: {md:400}, margin: 'auto' }} open={isModalOpen} onClose={handleCloseModal}>
          <div className='img-preView'>
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
              <Grid container  alignItems="flex-end">
                <Grid justifyContent="center" xs={12} sx={{position: 'relative', padding: 0, margin:1,}}>
                  {photoDataUrl && <img src={photoDataUrl} alt="Captured" style={{ width: '100%' }} />}
                  {(iosPlatforms.includes(platform) || (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)))
                  && <TouchAppIcon className='promote-icon' sx={{fontSize: 90, position: 'absolute', left: 0, bottom: '2vh', }}></TouchAppIcon>}
                </Grid>
                <Grid xs={12} sx={{textAlign: 'left', fontSize: '1.2rem', lineHeight: '2rem'}}>
                  {(iosPlatforms.includes(platform) || (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)))
                    &&
                  <div id='iosSave'>
                    <p className='text'>{'写真を長押しして\n'}
                      <span className='text-em'>写真に追加</span>を押すと{'\n'}
                      写真を保存できます
                    </p>
                  </div>
                  }
                </Grid>
                <Grid justifyContent="center" sx={{ textAlign: 'left' }} xs={4}>
                  <IconButton onClick={handleCloseModal}><KeyboardReturnRoundedIcon sx={{ fontSize: 40, "@media screen and (min-width:700px)":{fontSize: 60} }}></KeyboardReturnRoundedIcon></IconButton>
                </Grid>
                {!(iosPlatforms.includes(platform) || (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)))
                  &&
                  <div id='otherSave'>
                    <Grid justifyContent="center" xs={4}>
                      <IconButton onClick={savePicture}><DownloadRoundedIcon sx={{ fontSize: 70, color: '#00a0e9' }}></DownloadRoundedIcon></IconButton>
                    </Grid>
                  </div>
                  }
                <Grid xs={4}></Grid>
                <Grid xs={4}></Grid>
                <Grid xs={4}>{!(iosPlatforms.includes(platform) || (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor))) &&<span className='guide-label'>保存する</span>}</Grid>
              </Grid>
            </Box>
          </Box>
          </div>
        </Modal>
        <Modal sx={{ width: {md: '60%', sm: '75%', xs: '75%'}, maxWidth: {md:400}, margin: 'auto' }} open={isCropModalOpen} onClose={handleCropCloseModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
          }}>
        <div style={{ position: 'relative', width: '100%', height: '400px', background: '#fff' }}>
          <Cropper
            image={base64Image}
            crop={crop}
            zoom={zoom}
            aspect={2 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <Button variant="contained" color="primary" onClick={handleCropCloseModal} style={{ position: 'absolute', bottom: 20, right: 20 }}>
            トリミングする
          </Button>
        </div>
        </Box>
      </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default CameraApp;

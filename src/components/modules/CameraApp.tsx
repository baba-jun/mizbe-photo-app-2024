import React, { useEffect, useRef, useState } from 'react';
import frame from '../../frame/frame-red.png';

const CameraApp: React.FC = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        const FrameImg = new Image()
        FrameImg.src = frame
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(FrameImg,0,0, canvasRef.current.width, canvasRef.current.height)
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPhotoDataUrl(dataUrl);
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

  return (
    <div>
      <div>
        <select onChange={(e) => setSelectedDeviceId(e.target.value)} value={selectedDeviceId || ''}>
          {devices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
      <div className='video-container'>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
        <img src={frame} ></img>
      </div>
      <div>
        <button onClick={takePicture}>Take Picture</button>
      </div>
      {photoDataUrl && (
        <div>
          <h2>Photo Preview</h2>
          <img src={photoDataUrl} alt="Captured" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button onClick={savePicture}>Save Picture</button>
    </div>
  );
};

export default CameraApp;

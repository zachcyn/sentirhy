import Webcam from 'react-webcam';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import Typography from '@mui/material/Typography';

function Camera() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCvReady, setIsCvReady] = useState(false);
  
    const processVideo = useCallback(() => {

      const FPS = 30;
      const classifier = new window.cv.CascadeClassifier();
      classifier.load('haarcascade_frontalface_default.xml');

      const processFrame = () => {
        const begin = Date.now();
              
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const dst = new window.cv.Mat(video.videoWidth, video.videoHeight, window.cv.CV_8UC4);

        const faces = new window.cv.RectVector();
      
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0,0, canvas.width, canvas.height);
        const src = window.cv.imread(canvas);
        const gray = new window.cv.Mat();

        src.copyTo(dst);
        window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0);
        classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
        console.log(`Detected faces: ${faces.size()}`);
        for (let i = 0; i < faces.size(); i+=1) {
          const face = faces.get(i);
          const point1 = new window.cv.Point(face.x, face.y);
          const point2 = new window.cv.Point(face.x + face.width, face.y + face.height);
          window.cv.rectangle(src, point1, point2, [255, 0, 0, 255], 2, window.cv.LINE_8, 0);
        }
        window.cv.imshow(canvas, src);
        const delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processFrame, delay);

        src.delete();
        gray.delete();
        faces.delete();
      };
  
      setTimeout(processFrame, 0);
  
      // eslint-disable-next-line consistent-return
    }, []);
  
 
    useEffect(() => {
      if (window.cv && window.opencvInitialized) {
        console.log('OpenCV.js is already loaded.');
        setIsCvReady(true);
        return;
      }
  
      const script = document.createElement('script');
      script.src = 'https://docs.opencv.org/4.5.1/opencv.js';
      script.async = true;
      script.onload = () => {
        window.cv.onRuntimeInitialized = () => {
          window.opencvInitialized = true;
          setIsCvReady(true);
          console.log("OpenCV loaded");
        };
      };
      document.body.appendChild(script);
  
      // eslint-disable-next-line consistent-return
      return () => {
        document.body.removeChild(script);
      };
    }, []);
  
    useEffect(() => {
      if (isCvReady && webcamRef && canvasRef) {
        fetch('/haarcascade_frontalface_default.xml')
        .then(response => response.arrayBuffer()) // Use arrayBuffer() for binary files
        .then(data => {
            const dataHeap = new Uint8Array(data);
            window.cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', dataHeap, true, false, false);
            processVideo();
        })
        .catch(error => console.error('Error loading classifier:', error));
            }
    }, [isCvReady, processVideo]);

  return (
    <div>
      <Typography>{isCvReady ? 'OpenCV is ready' : 'Loading OpenCV...'}</Typography>
      <Webcam ref={webcamRef} audio={false} style={{ width: "1px", height: "1px", opacity: 0, position: "absolute" }} />
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Camera;

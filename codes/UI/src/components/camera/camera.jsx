import Webcam from 'react-webcam';
import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

import Typography from '@mui/material/Typography';

const Camera = forwardRef((props, ref) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [cascade, setCascade] = useState(false);
    const [isCvReady, setIsCvReady] = useState(false);
    const [detecting, setDetecting] = useState(true);
    const detectingRef = useRef(detecting);

    useEffect(() => {
        detectingRef.current = detecting;
    }, [detecting]);

    useImperativeHandle(ref, () => ({
      toggleDetection: () => {
        setDetecting((prev) => !prev);
      },
    }));
  
    const processVideo = useCallback(() => {
      const FPS = 30;
      const classifier = new window.cv.CascadeClassifier();
      classifier.load('haarcascade_frontalface_default.xml');

      const processFrame = () => {
        if (!isCvReady || !detectingRef.current) return;

        const begin = Date.now();
              
        const video = webcamRef.current.video;
        if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
          requestAnimationFrame(processFrame);
          return;
        }
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

        if (faces.size() > 0 && detecting) {
          const face = faces.get(0);
          const rect = new window.cv.Rect(face.x, face.y, face.width, face.height);
          src.roi(rect).copyTo(dst);
          window.cv.imshow(canvas, dst);

          setDetecting(false);
          detectingRef.current = false;
          const imageData = canvas.toDataURL('image/png');
          props.onCapture(imageData); 
        }

        const delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processFrame, delay);

        src.delete();
        gray.delete();
        faces.delete();
      };
  
      setTimeout(processFrame, 0);
  
      // eslint-disable-next-line consistent-return
    }, [detecting, isCvReady, props, detectingRef]);
  
 
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
      if (isCvReady) {
        fetch('/haarcascade_frontalface_default.xml')
        .then(response => response.arrayBuffer()) // Use arrayBuffer() for binary files
        .then(data => {
            const dataHeap = new Uint8Array(data);
            window.cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', dataHeap, true, false, false);
            setCascade(true);
        })
        .catch(error => console.error('Error loading classifier:', error));
            }
    }, [isCvReady]);

    useEffect(() => {
      if (isCvReady && cascade && detecting) {
        console.log(detecting)
        processVideo();
      }
    }, [isCvReady, cascade, detecting, processVideo])

  return (
    <div>
      <Webcam ref={webcamRef} audio={false} 
<<<<<<< HEAD
      style={{width:"100%", transform: "scaleX(-1)"}}
      />
      <canvas ref={canvasRef} 
        style={{ width: "1px", height: "1px", opacity: 0, position: "absolute", transform: "scaleX(-1)" }}
=======
      style={{width:"100%"}}
      />
      <canvas ref={canvasRef} 
        style={{ width: "1px", height: "1px", opacity: 0, position: "absolute" }}
>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c
        />
    </div>
  );
});

Camera.propTypes = {
  onCapture: PropTypes.func.isRequired
};

export default Camera;

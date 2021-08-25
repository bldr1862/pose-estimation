import React, { useRef } from 'react';
import "./App.css";
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import { drawKeypoints, drawSkeleton } from './utilities';


const App = () => {

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const imageScaleFactor = 0.50; // de 0 a 1
    const flipHorizontal = false; // true - false
    const outputStride = 16; // 8 - 16
    const multiplier = 0.75 // 0,75 - 0.5 - 1
    const architecture = 'MobileNetV1' // MobileNetV1 - ResNet50

    // Load posenet
    const runPosenet = async () => {
        const net = await posenet.load({
            inputResolution:{width:640, height:480},
            architecture: architecture,
            outputStride: outputStride,
            multiplier: multiplier,
        });
        setInterval(() => {
            detect(net)
        }, 100);
    };

    const detect = async (net) => {
        if(
            typeof webcamRef.current !== 'undefined' 
            && webcamRef.current !== null 
            && webcamRef.current.video.readyState===4){

                // get video properties
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;

                // set video width
                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;

                // Detection
                const pose = await net.estimateSinglePose(video);

                drawCanvas(pose, videoWidth, videoHeight, canvasRef);

        }
    };
    
    const drawCanvas = async (pose, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext('2d');
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        drawKeypoints(pose['keypoints'], 0.6, ctx);
        drawSkeleton(pose['keypoints'], 0.7, ctx);

    };

    runPosenet();

    return <>
        <div className="App">
            <header className="App-header">
                <Webcam 
                ref={webcamRef}
                style={{
                    position:'absolute',
                    marginLeft:'auto',
                    marginRight:'auto',
                    left:0,
                    right:0,
                    textAlign:'center',
                    zindex:9,
                    width:640,
                    height:480,
                }}/>

                <canvas 
                ref={canvasRef}
                style={{
                    position:'absolute',
                    marginLeft:'auto',
                    marginRight:'auto',
                    left:0,
                    right:0,
                    textAlign:'center',
                    zindex:9,
                    width:640,
                    height:480,
                }}/>
            </header>
        </div>
    </>
}


export {App};
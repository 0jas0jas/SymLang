'use client';

import { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';

const GestureRecognition = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [label, setLabel] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [ifCount, setIfCount] = useState<number>(0);

    useEffect(() => {
        const loadModel = async () => {
            const modelURL = 'https://teachablemachine.withgoogle.com/models/SeosoDTg4/model.json';
            const metadataURL = 'https://teachablemachine.withgoogle.com/models/SeosoDTg4/metadata.json';
            const model = await tmImage.load(modelURL, metadataURL);
            setModel(model);
        };

        loadModel();

        const startVideo = async () => {
            const video = videoRef.current;
            if (video) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.play();
            }
        };

        startVideo();
    }, []);

    useEffect(() => {
        const predict = async () => {
            if (model && videoRef.current) {
                const prediction = await model.predict(videoRef.current);
                const highestPrediction = prediction.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);
                setLabel(highestPrediction.className);

                setCode(prevCode => {
                    switch (highestPrediction.className) {
                        case 'IF THEN ELSE ENDIF':
                            setIfCount(prevCount => {
                                if (prevCount === 0) {
                                    return 1;
                                } else if (prevCount === 1) {
                                    return 2;
                                } else {
                                    return 0;
                                }
                            });
                            if (ifCount === 0) {
                                return prevCode + 'IF ';
                            } else if (ifCount === 1) {
                                return prevCode + 'ENDIF\n\n';
                            } else {
                                return prevCode + 'THEN ';
                            }
                        case 'NUM1':
                            return prevCode + '1 ';
                        case 'NUM2':
                            return prevCode + '2 ';
                        case 'NUM3':
                            return prevCode + '3 ';
                        case 'NUM4':
                            return prevCode + '4 ';
                        case 'NUM5':
                            return prevCode + '5 ';
                        case 'EQUALS':
                            return prevCode + '= ';
                        case 'XVAR':
                            return prevCode + 'X ';
                        case 'PLUS':
                            return prevCode + '+ ';
                        case 'NOT':
                            return prevCode + 'NOT ';
                        case 'LOOP':
                            return prevCode + '\nLOOP ';

                        default:
                            return prevCode;
                    }
                });

                console.log(`Detected gesture: ${highestPrediction.className}`);
            }
        };

        const interval = setInterval(predict, 3000);
        return () => clearInterval(interval);
    }, [model, ifCount]);

    const handleDelete = () => {
        setCode(prevCode => prevCode.slice(0, -1));
    };

    return (
        <div className='flex flex-col gap-5 justify-center' >
            <h1>Gesture Recognition</h1>
            <video ref={videoRef} width="640" height="480" autoPlay muted></video>
            <div role="alert" className="alert">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-info h-6 w-6 shrink-0">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            {label === 'Empty' ? (
                <span>Awaiting input...</span>
            ) : (
                <span>You used {label} command</span>
            )}
            </div>
            <div className="mockup-code">
                <pre data-prefix="$"><code>{code}</code></pre>
                <button className='btn text-xl' onClick={handleDelete}>⌫</button>
            </div>
            <div className='flex flex-col items-center gap-4'>
                <button className='btn btn-primary w-32'>Compile!</button>
            </div>
        </div>
    );
};

export default GestureRecognition;

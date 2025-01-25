'use client';
import { useEffect, useRef } from 'react';
import * as handTrack from 'handtrackjs';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    const modelParams = {
      flipHorizontal: true,
      maxNumBoxes: 1,
      iouThreshold: 0.5,
      scoreThreshold: 0.6,
    };

    handTrack.load(modelParams).then((lmodel: any) => {
      modelRef.current = lmodel;
      handTrack.startVideo(videoRef.current).then((res: { status: any; }) => {
        if (res.status) {
          navigator.mediaDevices.getUserMedia({ video: true }).then((stream: MediaStream) => {
            videoRef.current!.srcObject = stream;
            setInterval(runDetection, 100);
          }).catch((err: any) => console.log(err));
          if (videoRef.current) {
            videoRef.current.style.height = ""; // Reset the height style
          }
        } else {
          console.error("Please enable video");
        }
      });
    });

    const runDetection = () => {
      modelRef.current.detect(videoRef.current).then((predictions: any) => {
        console.log(predictions);
        // Handle predictions here
      });
    };
  }, []);

  return (
    <main>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Welcome to gesLang, a language for all.
            </p>
            <button className="btn btn-primary">Get Started</button>
            <video ref={videoRef} className="video" autoPlay />
          </div>
        </div>
      </div>
      <style jsx>{`
        .video {
          width: 100%;
          max-width: 800px; /* Adjust as needed */
          height: auto;
        }
      `}</style>
    </main>
  );
}
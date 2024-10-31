// components/VideoRecorder.js
import { useState, useRef } from 'react';
import axios from 'axios';

const VideoRecorder = ({ handleVideoUpload }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunks = useRef([]);
    const videoRef = useRef(null); // Reference for the video preview
  
    const startRecording = async () => {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Set the stream to the video element for live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };
  
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/mp4' });
        setVideoBlob(blob);
        chunks.current = [];
  
        // Stop the stream once recording is done
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
  
      mediaRecorderRef.current.start();
    };
  
    const stopRecording = () => {
      setIsRecording(false);
      mediaRecorderRef.current.stop();
    };
  
    const uploadRecordedVideo = () => {
      if (!videoBlob) return;
      const file = new File([videoBlob], "recorded-video.mp4", { type: "video/mp4" });
      
      const mockEvent = {
        target: { files: [file] }
      };
      
      handleVideoUpload(mockEvent);
    };
  
    return (
      <div  className='w-[100%] flex flex-col justify-center items-center mb-8'>
        <h2 className='text-md fonr-semibold text-gray-900 mb-2'>Video Recorder</h2>
        <div>
          <video ref={videoRef} autoPlay muted width="300" />
          {/* This video element shows the live preview */}
        </div>
        
        {isRecording ? (
          <button onClick={stopRecording} className='bg-red-800 p-3 text-white text-md rounded-lg mx-auto'>Stop Recording</button>
        ) : (
          <button onClick={startRecording} className='bg-green-700 p-3 text-white text-md rounded-lg mx-auto'>Start Recording</button>
        )}
  
        {videoBlob && (
          <div className='w-[100%] flex flex-col justify-center items-center'>
            <video src={URL.createObjectURL(videoBlob)} controls width="300" />
            <button onClick={uploadRecordedVideo} className='bg-gray-800 p-3 text-white text-md rounded-lg mx-auto'>Upload Recorded Video</button>
          </div>
        )}
      </div>
    );
}

export default VideoRecorder;
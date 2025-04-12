    import React, { useState } from 'react';
    import PDFViewer from './PDFViewer';

    const DocumentUploader = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [utterance, setUtterance] = useState(null);

    // Handle file upload
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile && uploadedFile.type === 'application/pdf') {
        setFile(uploadedFile);
        setUploadStatus('');
        } else {
        setUploadStatus('Please upload a valid PDF.');
        }
    };

    // Function to start or resume speaking the text
    const speakText = () => {
        if (!extractedText) {
        alert('No text extracted from PDF.');
        return;
        }

        if (isSpeaking) {
        // If already speaking, do nothing
        return;
        }

        console.log('Speaking text:', extractedText);

        const newUtterance = new SpeechSynthesisUtterance(extractedText);
        newUtterance.onend = () => {
        setIsSpeaking(false); // Reset speaking state when speech ends
        };
        
        window.speechSynthesis.speak(newUtterance);
        setUtterance(newUtterance);
        setIsSpeaking(true);
    };

    // Function to pause the speech
    const pauseSpeech = () => {
        if (isSpeaking) {
        window.speechSynthesis.pause();
        setIsSpeaking(false);
        }
    };

    // Function to resume the speech
    const resumeSpeech = () => {
        if (!isSpeaking && utterance) {
        window.speechSynthesis.resume();
        setIsSpeaking(true);
        }
    };

    // Handle stop functionality
    const stopSpeech = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setUtterance(null);
    };

    return (
        <div className="p-6 flex flex-col items-center bg-gray-100 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Upload PDF and Listen</h2>

        {/* File Upload */}
        <input
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            type="file"
            onChange={handleFileChange}
            
        />

        {uploadStatus && <p className="text-red-500">{uploadStatus}</p>}

        {/* Display PDF and Buttons */}
        {file && (
            <>
              <div className="mt-6 space-y-4 flex flex-col items-start">
                {/* Play / Resume Button */}
                <button
                onClick={speakText}
                disabled={isSpeaking}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                🔊 Start
                </button>

                {/* Pause Button */}
                <button
                onClick={pauseSpeech}
                disabled={!isSpeaking}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                ⏸ Pause
                </button>

                {/* Stop Button */}
                <button
                onClick={stopSpeech}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                🛑 Stop
                </button>

                {/* Resume Button (if paused) */}
                <button
                onClick={resumeSpeech}
                disabled={isSpeaking || !utterance}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                ▶ Resume
                </button>
            </div>
            <PDFViewer file={file} onTextExtracted={setExtractedText} />
            
          
            </>
        )}
        </div>
    );
    };

    export default DocumentUploader;

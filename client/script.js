//script.js
const uploadForm = document.getElementById('upload-form');
const videoInput = document.getElementById('video-input');
const uploadButton = document.getElementById('upload-button');
const videoAnalysisResults = document.getElementById('video-analysis-results');

uploadButton.addEventListener('click', (e) => {
  e.preventDefault();
  const videoFile = videoInput.files[0];
  const formData = new FormData();
  formData.append('video', videoFile);

  fetch('/api/uploadVideo', {
    method: 'POST',
    body: formData
  })
 .then((response) => response.json())
 .then((data) => {
    console.log(data);
    // Call the video analysis API endpoint
    fetch('/api/analyzeVideo', {
      method: 'POST',
      body: JSON.stringify({ videoId: data.videoId }),
      headers: { 'Content-Type': 'application/json' }
    })
   .then((response) => response.json())
   .then((data) => {
      console.log(data);
      videoAnalysisResults.innerHTML = `Video analysis results: ${data.results}`;
    })
   .catch((error) => console.error(error));
  })
 .catch((error) => console.error(error));
});
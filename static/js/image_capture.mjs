// Get the elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const capturePhotoBtn = document.getElementById('capturePhotoBtn');
const imageContainer = document.getElementById('imageContainer');
const submitPhotoBtn = document.getElementById('submitPhotoBtn');
const form = document.getElementById('AddImageForm'); // Get the form element
let photoTaken = false; // Flag to track if a photo has been taken

// Automatically open the camera when the page loads
window.onload = function () {
  openCamera();
};

// Function to start the camera stream
function openCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.style.display = 'block'; // Show the video element
      })
      .catch(error => {
        console.error('Error accessing the camera: ', error);
      });
  } else {
    alert('Camera is not supported on your browser.');
  }
}

// Function to capture the photo
function takePhoto() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL('image/png');

  // Create an image element to display the captured photo
  const img = document.createElement('img');
  img.src = dataURL;

  const imageItem = document.createElement('div');
  imageItem.classList.add('image-item');
  imageItem.appendChild(img);
  
  // Add the new photo to the image container
  imageContainer.appendChild(imageItem);

  // Convert the captured image to a Blob and append it to the form as a file
  canvas.toBlob(function(blob) {
    const fileInput = document.createElement('input');
    fileInput.type = 'hidden';
    fileInput.name = 'photos';
    fileInput.value = dataURL; // If your backend can handle base64, otherwise convert to blob as a file
    form.appendChild(fileInput); // Append the hidden input to the form
  }, 'image/png');

  // Show the submit button only after one photo is taken
  if (!photoTaken) {
    submitPhotoBtn.style.display = 'block';
    photoTaken = true; // Set flag to true after first photo
  }
}

// Event listeners
capturePhotoBtn.addEventListener('click', takePhoto);

backBtn.addEventListener('click', ()=>{
  window.location.herf = '/index.html';
});

// Submit photo event
submitPhotoBtn.addEventListener('click', () => {
  // Submit the form
  form.submit();

  // Optionally, show a success alert
  alert('Photo(s) submitted successfully!');

  // Redirect if necessary
  window.location.href = '/index.html';
});

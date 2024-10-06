import {auth} from "./firebase.mjs"
// Get references to the button and file input
const addButton = document.getElementById('add-btn');
const photoInput = document.getElementById('photo-input');

// Trigger the file input when the button is clicked
addButton.addEventListener('click', function() {
  photoInput.click(); // Trigger the hidden file input click
});

// Add listener to the file input for changes (when user selects or takes a photo)
photoInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  //const items = 'example food items'; // Replace this with actual data or dynamic values
  const uid = auth.currentUser.uid; // Example user ID, replace with actual data

  if (file) {
    // Create a FormData object to send the file to the server
    const formData = new FormData();
    formData.append('picture', file); // 'picture' should match the upload.single('picture') on the backend
    //formData.append('items', items); // Append other fields (e.g., items)
    formData.append('uid', uid); // Append the UID or other metadata

    // Send the photo to the server using fetch
    fetch('/api/fridgesnap/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Photo uploaded successfully:', data);
      // Add any additional actions (e.g., display the uploaded photo)
    })
    .catch(error => {
      console.error('Error uploading photo:', error);
    });
  }
});

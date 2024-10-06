
    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBjGZyLVPKFaoKviEufK9E1Q-oKo3gClHo",
      authDomain: "hackthevally-e2037.firebaseapp.com",
      projectId: "hackthevally-e2037",
      storageBucket: "hackthevally-e2037.appspot.com",
      messagingSenderId: "154910357932",
      appId: "1:154910357932:web:9bc9a8807cf6f1d2ff6209",
      measurementId: "G-03TM5L500Q"
    };
  
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
  
    // Elements
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');
    const toggleSignupBtn = document.getElementById('toggle-signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const errorMessage = document.getElementById('error-message');
    const formTitle = document.getElementById('form-title');
    const foodBtn = document.getElementById('food-btn');
    const recipeBtn = document.getElementById('recipe-btn');
    const contentArea = document.getElementById('content-area');
    

    document.addEventListener('DOMContentLoaded', function() {
        const addBtn = document.getElementById('add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
            window.location.href = 'imageCapture.html';
            });
        }
        });

    // Toggle between Login and Sign Up Forms
    toggleSignupBtn.addEventListener('click', () => {
      const loginForm = document.getElementById('login-form');
      const signupForm = document.getElementById('signup-form');
  
      if (loginForm.style.display === 'none') {
        formTitle.textContent = 'Login';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        toggleSignupBtn.textContent = 'Create an Account';
      } else {
        formTitle.textContent = 'Sign Up';
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        toggleSignupBtn.textContent = 'Back to Login';
        
      }
    });
  
    // Show Modal when login button is clicked
    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'flex';
    });
  
    // Login with Firebase Authentication
    loginSubmitBtn.addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          loginModal.style.display = 'none';
          loginBtn.style.display = 'none';
          logoutBtn.style.display = 'block';
        })
        .catch(error => {
          errorMessage.textContent = error.message;
        });
    });
  
    // Sign up with Firebase Authentication
    signupSubmitBtn.addEventListener('click', () => {
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
  
      auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          loginModal.style.display = 'none';
          loginBtn.style.display = 'none';
          logoutBtn.style.display = 'block';
        })
        .catch(error => {
          errorMessage.textContent = error.message;
        });
    });
  
    // Logout
    logoutBtn.addEventListener('click', () => {
      auth.signOut().then(() => {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        contentArea.innerHTML = '';  // Clear content on logout
      });
    });
  
    // Check login state
    auth.onAuthStateChanged(user => {
      if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
      } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
      }
    });
  
    // Infinite Scroll Logic
    let page = 1;
    let loading = false;
    let currentType = '';
  
    // Handle Food button click (Infinite Scroll)
    foodBtn.addEventListener('click', () => {
      currentType = 'food';
      contentArea.innerHTML = '';  // Clear content area
      loadImagesAndText('food');
    });
  
    // Handle Recipe button click (Infinite Scroll)
    recipeBtn.addEventListener('click', () => {
      currentType = 'recipes';
      contentArea.innerHTML = '';  // Clear content area
      loadImagesAndText('recipes');
    });

    addBtn.addEventListener('click', () => {
        loadPage('addPhoto');
    });
  
    // Load images and text dynamically (Infinite scroll)
    function loadImagesAndText(type) {
      if (loading) return;
  
      loading = true;
      const imageUrls = generateMockData(type);
  
      imageUrls.forEach((item) => {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-item');
  
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = type;
  
        const text = document.createElement('p');
        text.textContent = item.text;
  
        imageContainer.appendChild(img);
        imageContainer.appendChild(text);
        contentArea.appendChild(imageContainer);
      });
  
      loading = false;
      page++;  // Load next set of data
    }
  
    // Simulate generating data
    function generateMockData(type) {
      const mockData = [];
  
      for (let i = 0; i < 10; i++) {
        mockData.push({
          imageUrl: `https://via.placeholder.com/150?text=${type}+Image+${(page - 1) * 10 + i + 1}`,
          text: `This is a ${type} description for item ${(page - 1) * 10 + i + 1}.`
        });
      }
      return mockData;
    }
  
    // Infinite scroll detection
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadImagesAndText(currentType);
      }
    });
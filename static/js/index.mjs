    import { getFridgeSnaps } from "./api.mjs";
    import { auth } from "./firebase.mjs";

    function onError(err) {
        console.log("Error:" + err.message);
    }


    
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
    const addBtn = document.getElementById('add-btn');
    
    document.addEventListener('DOMContentLoaded', function() {
        if (addBtn) {
            addBtn.addEventListener('click', () => {
            window.location.href = 'imageCapture.html';
            });
        }
        });
        
        loginModal.addEventListener("click", (event) => {
            // Check if the clicked target is the modal itself, not the content
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
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
        loadFood();
    });
    
    // Handle Recipe button click (Infinite Scroll)
    recipeBtn.addEventListener('click', () => {
        currentType = 'recipes';
        loadRecipes();
    });
    
    addBtn.addEventListener('click', () => {
        loadPage('addPhoto');
    });
    

    // Load images and text dynamically (Infinite scroll)
    function loadFood() {
        contentArea.innerHTML = '';  // Clear content area

        if (loading) return;
    
        loading = true;

        const uid = 0;

        getFridgeSnaps(uid, onError, function(snaps) {
            //snaps = generateMockData(type);
            snaps.forEach((snap) => {
                console.log(snap)
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-item');
        
            const img = document.createElement('img');
            img.src = "/api/fridgesnap/"+snap._id+"/image";
            img.alt = snap._id;
        
            const text = document.createElement('p');
            text.textContent = snap.food.map((f) => `${f.name}: ${f.quantity}`).join('\n');
        
            imageContainer.appendChild(img);
            imageContainer.appendChild(text);
            contentArea.appendChild(imageContainer);
            });
            loading = false;
            page++;  // Load next set of data
        });
    }


    // Load images and text dynamically (Infinite scroll)
    function loadRecipes() {
        contentArea.innerHTML = '';  // Clear content area

        if (loading) return;
    
        loading = true;

        const uid = 0;

        getFridgeSnaps(uid, onError, function(snaps) {
            //snaps = generateMockData(type);
            snaps.forEach((snap) => {
                console.log(snap)
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-item');
        
            const img = document.createElement('img');
            img.src = "/api/fridgesnap/"+snap._id+"/image";
            img.alt = snap._id;
        
            const text = document.createElement('p');
            text.textContent = snap.food.map((f) => `${f.name} ${f.quantity}`).join('\n');
        
            imageContainer.appendChild(img);
            imageContainer.appendChild(text);
            contentArea.appendChild(imageContainer);

            });
            loading = false;
            page++;  // Load next set of data
        });
    }
    
    // Simulate generating data
    // function generateMockData(type) {
    //     const mockData = [];
    
    //     for (let i = 0; i < 10; i++) {
    //     mockData.push({
    //         imageUrl: `https://via.placeholder.com/150?text=${type}+Image+${(page - 1) * 10 + i + 1}`,
    //         text: `This is a ${type} description for item ${(page - 1) * 10 + i + 1}.`
    //     });
    //     }
    //     return mockData;
    // }
    
    //   // Infinite scroll detection
    //   window.addEventListener('scroll', () => {
    //     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    //       loadFood(currentType);
    //     }
    //   });
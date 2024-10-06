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
export const auth = firebase.auth();

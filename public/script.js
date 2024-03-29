const auth = firebase.auth()

// Elements
const signInBtn = document.querySelector('.gsi-material-button');

// Firebase Auth & Providers
const provider = new firebase.auth.GoogleAuthProvider()

// Event listeners
signInBtn.onclick = () => auth.signInWithRedirect(provider)

auth.onAuthStateChanged(user => {
  if (user) {
    window.location.href = '/home.html'
  }
})

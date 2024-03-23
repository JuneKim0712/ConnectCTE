const auth = firebase.auth()

// Elements
const elements = {
  whenSignedOut: document.getElementById('whenSignedOut'),
  signInBtn: document.getElementById('signInBtn')
}

// Firebase Auth & Providers
const provider = new firebase.auth.GoogleAuthProvider()

// Event listeners
elements.signInBtn.onclick = () => auth.signInWithRedirect(provider)

auth.onAuthStateChanged(user => {
  if (user) {
    window.location.href = '/index.html'
  }
  elements.whenSignedOut.hidden = false
})

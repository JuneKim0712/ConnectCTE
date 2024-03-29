const auth = firebase.auth()
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('userDetails').innerHTML = `Hello ${user.displayName}!`
  }
}
)
document.getElementById('signOutBtn').onclick = () => auth.signOut().then(window.location.href = '/index.html')

auth.onAuthStateChanged(function(user) {
  if (user) {
    window.location = "/in"
  } else {

  }
});

function login() {
    let errBox = document.getElementById('error');
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    errBox.innerHTML = null;

    auth.signInWithEmailAndPassword(email, password)
    .then(function(cred) {
      window.location = "/in"
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      errBox.innerHTML = errorMessage;
    });
}


function logout() {
  auth.signOut();
}

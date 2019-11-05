let userOBJ
auth.onAuthStateChanged(function(user) {
  if (user) {
    userOBJ = user;
  } else {
    window.location = "/"
  }
});
const createUserForm = document.querySelector("#newUserForm");
const error = document.querySelector("#error");
createUserForm.addEventListener("submit", newUser)

function newUser(e) {
  e.preventDefault();
  const createUser = functions.httpsCallable("createUser");
  error.innerHTML = null;
  if (userOBJ) {
    createUser({email: createUserForm.email.value, password: createUserForm.password.value, name: createUserForm.name.value})
    .then(function (result) {
      
    })
  }
}

function role() {
  const addAdminRole = functions.httpsCallable('addAdminRole');
  const addSMRole = functions.httpsCallable("addSMRole");
  const addBarmanRole = functions.httpsCallable("addBarmanRole");

  switch (createUserForm.role.value) {
    case "admin":
      addAdminRole({ email: createUserForm.email.value })
      .then(function (result) {
        console.log(result)
      })
      .catch(function (err) {
        // console.error(err);
        console.log(err.code)
      })
      break;
    case "sm":
      addSMRole({ email: createUserForm.email.value })
      .then(function (result) {
        console.log(result)
      })
      .catch(function (err) {
        console.error(err);
      })
      break;
    case "barman":
      addBarmanRole({ email: createUserForm.email.value })
      .then(function (result) {
        console.log(result)
      })
      .catch(function (err) {
        console.error(err);
      })
      break;
    default:
  }
}

let userOBJ
auth.onAuthStateChanged(function(user) {
  if (user) {
    userOBJ = user;
  } else {
    window.location = "/"
  }
});
function role(role) {
  switch (role) {
    case "admin":
      return "חבר צוות"
      break;
    case "sm":
      return "אחראי משמרת"
      break
    case "barman":
      return "ברמן"
      break
    default:

  }
}
const userinfo = document.querySelector("#editUser")
const fetchUser = functions.httpsCallable("fetchUser");
const getParams = window.location.search.replace("?", "").split("=");
fetchUser({email: getParams[1]}).then(function (user) {
  for (let i = 0; i < Object.keys(user.data).length; i++) {
    if (typeof user.data[Object.keys(user.data)[i]] == "object") {
      userinfo.innerHTML += `<li>${(user.data[Object.keys(user.data)[i]]["name"])}</li>`
    } else {
      userinfo.innerHTML += `<li>${user.data[Object.keys(user.data)[i]]}</li>`
    }
  }
}).catch(function (err) {
  console.error(err);
})

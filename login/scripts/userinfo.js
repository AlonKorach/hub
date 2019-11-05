let userOBJ
auth.onAuthStateChanged(function(user) {
  if (user) {
    userOBJ = user;
  } else {
    window.location = "/"
  }
});

const userinfo = document.querySelector("#userinfo")
const fetchUser = functions.httpsCallable("fetchUser");
const getParams = window.location.search.replace("?", "").split("=");
fetchUser({email: getParams[1]}).then(function (user) {
  for (let i = 0; i < Object.keys(user.data).length; i++) {
    if (typeof user.data[Object.keys(user.data)[i]] == "object") {
      userinfo.innerHTML += `<li>${user.data[Object.keys(user.data)[i]]["name"]}</li>`
    } else {
      userinfo.innerHTML += `<li>${user.data[Object.keys(user.data)[i]]}</li>`
    }
  }
}).catch(function (err) {
  console.error(err);
})

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// -------------------
//  USER ROLE METHODS
// -------------------
// set user admin
exports.addAdminRole = functions.https.onCall((data, context) => {
  // Check if user is admin

  if (context.auth.token.role == undefiend) {
    return { error: `אין לך הרשאות מתאימות להוספת ברמן חדש`};
  }
  // get user and add admin custom claim
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      "role": {
        "id": "admin",
        "name": "חבר צוות"
      }
    }).then(() => {
      return {
        message: `הנער ${context.auth.toekn.name} הוא כעט ברמן!`
      }
    }).catch(err => {
      return err;
    });
  })
})
// set user sm
exports.addSMRole = functions.https.onCall((data, context) => {
  // Check if user is admin
  if (context.auth.token.role.id != "admin") {
    return { error: `אין לך הרשאות מתאימות להוספת ברמן חדש`};
  }

  // get user and add admin custom claim
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {role: "sm"})
  }).then(() => {
    return {
      message: `הנער ${context.auth.toekn.name} הוא כעט ברמן!`
    }
  }).catch(err => {
    return err;
  });
})

// set user barman
exports.addBarmanRole = functions.https.onCall((data, context) => {
  // Check if user is admin
  if (context.auth.token.role.id != "admin") {
    return { error: `אין לך הרשאות מתאימות להוספת ברמן חדש`};
  }
  // get user and add admin custom claim
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {role: "barman"})
  }).then(() => {
    return {
      message: `הנער ${context.auth.toekn.name} הוא כעט ברמן!`
    }
  }).catch(err => {
    return err;
  });
})

// -------------------
// USER PROFILE METHODS
// -------------------
// update user method
exports.updateUser = functions.https.onCall((data, context) => {
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().updateUser(user.uid, {
      email: data.newEmail,
      phoneNumber: data.phone,
      displayName: data.name
    })
  })
})

// create user method
exports.createUser = functions.https.onCall((data, context) => {
  return admin.auth().createUser({
    email: data.email,
    password: data.password,
    displayName: data.name
  })
    .then(user => {
      return {
        message: `המשתמש נוצר בהצלחה`
      }
    })
    .catch(err => {
        return err;
    });
})

// fetch user info method
exports.fetchUser = functions.https.onCall((data, context) => {
  return admin.auth().getUserByEmail(data.email).then(user => {
    if (!user) return {error: "משתמש לא קיים"}
      return {
        email: user.email,
        displayname: user.displayName,
        role: user.customClaims.role
    };
  })
})

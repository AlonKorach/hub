'use strict'
class FB {
    constructor(admin, serviceAccount, dbURL){
        this.admin = admin;
        this.serviceAccount = serviceAccount;
        if(!this.admin.apps.length) {
            this.connnect(dbURL);
        }
        this.db = this.admin.database();
    }

    connnect(dbURL) {
        this.app = this.admin.initializeApp({
            credential: this.admin.credential.cert(this.serviceAccount),
            databaseURL: `https://${dbURL}.firebaseio.com`
        });
        // console.log(this.app);
    }
    addDBRow(path, key, data){
        var ref =  this.db.ref("/");
        // let date = `${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}`;
        let ItemREF = ref.child(path).update({
        [key]: data
        });
        var key = ItemREF.key;
        return key;
    }

    updateDBRow(path, object){
        var ref = this.db.ref(`/`);
        ref.child(path).update(object);
    }

    readDBItems(path,cb){
        var db = this.admin.database();
        var ref = db.ref("/");
        var itemsREF = ref.child(path);
        var a = 0
        return itemsREF.once('value');
    }

    deleteDBItem(path) {
      var db = this.admin.database();
      var ref = db.ref("/items");
      var item = ref.child(path);
      item.remove();
    }

    readDBItem(path, id) {
        var ref =  this.db.ref("/");
        var itemsREF = ref.child(`${path}/${id}`);
        itemsREF.on("value", function(snapshot) {
          console.log(snapshot.val());
          return snapshot.val();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });

    }
}
module.exports = FB;

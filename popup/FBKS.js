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
    addDBRow(path, data, key){
        var ref =  this.db.ref("/");
        // let date = `${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}`;
        let ItemREF = ref.child(path).set({
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
        // console.log(a + " 44") ;
    }
    rr(path, cb) {
      var db = this.admin.database();

      const prom = val1.map((soundcast) => {
        return db.ref(`${path}/Sunday`).once("value")
      })
      const resolved = Promise.all(prom);
    }
    readDBItem(path, id) {
        var itemsREF = ref.child(`${path}/${id}`);
        itemsREF.orderByChild().on("value", (snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            }
            console.log("Cannot read a TODO ite with TODO ID %s!", id);
            return null;
        })
    }
}
module.exports = FB;

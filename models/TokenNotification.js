//---------------import packages-------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//--------------Define collection and schema-----------------
let TokenNotification = new Schema({
   email: {
      type: String
   },
   userId: {
      type: String
   },
   notificationToken: {
      type:String
   }
}, {
   collection: 'TokenNotification'
})

//----------------export modal-------------------
module.exports = mongoose.model('TokenNotification', TokenNotification)
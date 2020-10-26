//---------------import packages-------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//--------------Define collection and schema-----------------
let notification = new Schema({
    useremail:{
        type:String
    },
    messageTime: {
      type: String
   },
   from:{
      type:String
   },
   message:{
       type:String
   }, 
}, {
    timestamps: true,
},

{
   collection: 'notification'
})

//----------------export modal-------------------
module.exports = mongoose.model('notification', notification)
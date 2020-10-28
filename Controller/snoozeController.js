 //----------------import packages---------------------------------

 //----------import model
 const SnoozeShedule = require('../models/SnoozeModel')
 const notificationmodel = require('../models/Notificationmodel')




 //----------get EmailShedule DAta----------------------------------------
 exports.getSnoozeshedule = async (req, res) => {
   try {
     let datas = await SnoozeShedule.find()
     res.status(200).json({
       data: datas,
     })

   } catch (err) {}
 }

 //----------get notificationmodel DAta-----------------------------
 exports.getnotification = async (req, res) => {
   try {
     let notefication = await notificationmodel.find({
      useremail: req.User.email
     })
     res.status(200).json({
       data: notefication
     })
   } catch (err) {
     res.status(400)
   }
 }



 //---------------Update Snooze status-------------------------------------------
 exports.snoozeupdate = async (req, res, next) => {
   var ObjectId = require('mongodb').ObjectID;
   const snoozeupdate = {
     snoozeStatus: req.body.snoozeStatus
   }
   SnoozeShedule.findOneAndUpdate({
     _id: ObjectId(req.params.id)
   }, {
     $set: snoozeupdate
   }, (error, data) => {
     if (error) {
       console.log(error)
       return next(error)
     } else {
       res.json(data)
       return ("update Snooze")
     }
   })
 }
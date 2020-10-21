 //----------------import packages---------------------------------
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//----------import model
const SnoozeShedule = require('../models/SnoozeModel')




//----------get EmailShedule DAta----------------------------------------
exports.getSnoozeshedule=async (req, res) => {
  try{
     let datas=await SnoozeShedule.find()
     res.status(200).json({
       data: datas,
     })
 
   }catch (err) {}
 }
 
 
 //----------update Stop--------------------------------------------
 exports.updateStop=async (req, res,next) => {
    var ObjectId = require('mongodb').ObjectID;
    let getsnoozestop=req.body.stopsnooze
     const stopupdte={
        stopsnooze:getsnoozestop
     }
     SnoozeShedule.findOneAndUpdate( {_id : ObjectId(req.params.id)},{
       $set:stopupdte
     },(error,data)=>{
       if(error){
         console.log(error)
         return next(error)
       }else{
         res.json(data)
         return("stop Snooze")
       }
     })
   }


   exports.snoozeupdate=async (req, res,next) => {
    var ObjectId = require('mongodb').ObjectID;
     const snoozeupdate={
      snoozeStatus:req.body.snoozeStatus
     }
     SnoozeShedule.findOneAndUpdate( {_id : ObjectId(req.params.id)},{
       $set:snoozeupdate
     },(error,data)=>{
       if(error){
         console.log(error)
         return next(error)
       }else{
         res.json(data)
         return("update Snooze")
       }
     })
   }
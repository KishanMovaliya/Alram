//------------import packages-------------------------
const express = require("express");
const router = express.Router();

//------------import usercontroller file---------------
const userController = require("../Controller/userController");
const snnozecontroller = require("../Controller/snoozeController")


//------------Defined the Router api-----------------------------

//------------register user Route api----------------------------
router.post("/register", userController.registerNewUser);

//------------loginUser user Route api----------------------------
router.post("/login", userController.loginUser);

//------------emailshedule  Route api----------------------------
router.post('/sheduleemail', userController.emailshedule);

//------------updateshedule  Route api----------------------------
router.put('/updateShedule/:id', userController.updateshedule);

//------------updateStatus  Route api----------------------------
router.put('/status/:id', userController.updateStatus);

//------------getemailshedule  Route api----------------------------
router.get('/getemailshedule', userController.getemailshedule);

//------------deleteShedule  Route api----------------------------
router.delete('/deletshedule/:id', userController.deleteShedule);

//------------getSnoozeshedule  Route api----------------------------
router.get('/getsnooze', snnozecontroller.getSnoozeshedule)

//------------updateStop  Route api----------------------------
router.put('/stopupdate/:id', snnozecontroller.updateStop);

//------------snoozeupdate  Route api----------------------------
router.put('/snoozeupdate/:id', snnozecontroller.snoozeupdate);



//------------export router-------------------------------
module.exports = router;
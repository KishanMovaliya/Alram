//------------import packages-------------------------
const express = require("express");
const router = express.Router();

//------------import usercontroller file---------------
const userController = require("../Controller/userController");
const snnozecontroller = require("../Controller/snoozeController")
const checkUserToken = require("../service/tokenmiddleware")

//------------middleware----------------------------------------
const verify = require("../middleware/auth")

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
router.get('/getemailshedule', checkUserToken, userController.getemailshedule);

//------------deleteShedule  Route api----------------------------
router.delete('/deletshedule/:id', userController.deleteShedule);

//------------getSnoozeshedule  Route api----------------------------
router.get('/getsnooze', snnozecontroller.getSnoozeshedule)

//------------snoozeupdate  Route api----------------------------
router.put('/snoozeupdate/:id', snnozecontroller.snoozeupdate);

//------------get notification ---------------------------
router.get('/getnotification', snnozecontroller.getnotification);

//------------export router-------------------------------
module.exports = router;
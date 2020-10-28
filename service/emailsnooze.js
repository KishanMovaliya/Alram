//----------------import packages---------------------------------
var nodemailer = require('nodemailer');


const scheduler = require('node-schedule');
var FCM = require('fcm-node');
var serverKey = 'AAAAHV8fXR4:APA91bGmZflZantZw8gYX2TTv_yNy0TRwdXosruwSziVAUyGEuwrdzZ8reiFFRYN9s9ZP8zTs2bHw_S3QPapryow5yEmNP3rZRnfnchmrv5KfOqWaNNLw0YiWYKZf2gfpl13V4u0z_Ap'; //put your server key here
var fcm = new FCM(serverKey);



//---------------import modal---------------------------------------
const snoozeshedule = require('../models/SnoozeModel')
const notificationmodel = require('../models/Notificationmodel')
const UserToken = require('../models/TokenNotification')

//-----------------Send Mail function using Nodemailer----------- 
async function sendMailsnooze(req, res, next) {
    try {
        const getitem = UserToken.find()
        let gettoken
        let emailtoken
        getitem.then(res => {
            res.map(b => {
                gettoken = b.notificationToken
            })
        })
        scheduler.scheduleJob("*/40 * * * * *", function () {
            const snoozeshedules = snoozeshedule.find().then((response) => {
                console.log("token", gettoken,emailtoken)
                response.map(a => {
                    getid = a._id
                    const setlimit = a.limitsend
                    const getnotification = a.notification
                    const getstatusOfSnooze = a.snoozeStatus
                    var maillist = [
                        a.email,
                    ];

                    //----------------call schedular & Send Email---------------------------------------
                    let mailTransporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "abd.bodara@gmail.com",
                            pass: "password123#"
                        }
                    });
                    //---------------Setting credentials-----------------------------
                    let mailDetails = {
                        from: "abd.bodara@gmail.com",
                        to: maillist,
                        subject: "The answer to life, the universe, and everything!❤️",
                        html: '<button style="background-color: gold"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Start Snooze</a></button> <hr><button style="background-color: red"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Stop Snooze</a></button>',
                    };
                    //---------------check status snooze------------------------------
                    if (getstatusOfSnooze === true) {
                        //----------check limit-----------------------------------------
                        if (setlimit > 0) {
                            //--------------- mail send-----------------------------------
                            mailTransporter.sendMail(mailDetails,
                                function (err, data) {
                                    if (err) {
                                        return ("Error Occurs", err)
                                    } else {
                                        if (gettoken) {
                                     
                                            var message = {
                                                //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                                to: gettoken,
                                                collapse_key: 'your_collapse_key',

                                                notification: {
                                                    title: '🤩New Email Recieve🤩',
                                                    body: 'The answer to life, the universe, and everything!❤️',
                                                    click_action: 'http://localhost:4200'
                                                },

                                                data: { //you can send only notification or only data(or include both)
                                                    my_key: 'my value',
                                                    my_another_key: 'my another value'
                                                }
                                            };

                                            fcm.send(message, function (err, response) {
                                                if (err) {
                                                    console.log("Something has gone wrong!");
                                                } else {
                                                    console.log("Successfully sent with response");
                                                }
                                            })
                                        } else {
                                            console.log("Token Not Register")
                                        }

                                        //---------------end sending notification gcm---------------

                                        //----------decreament limit and update ---------------------------
                                        if (data) {
                                            let getmessageTime = data.messageTime
                                            let getfrom = data.envelope.from

                                            let getdatanotification = new notificationmodel({
                                                messageTime: getmessageTime,
                                                from: getfrom,
                                                message: "a new notifications",
                                                useremail: a.email
                                            })
                                            getdatanotification.save()


                                            let ab = setlimit - 1
                                            let note = getnotification + 1
                                            const snoozeLimit = {
                                                limitsend: ab,
                                                notification: note
                                            }
                                            snoozeshedule.findOneAndUpdate({
                                                _id: (a._id)
                                            }, {
                                                $set: snoozeLimit
                                            }, (error, data) => {
                                                if (error) {
                                                    return (error)
                                                } else {
                                                    return (data)
                                                }
                                            })
                                        } //end limit update-------------------------------------------------
                                    }
                                });
                        }
                        //----------if limit == 0 update status false and limit reset--------------------------------- 
                        else if (setlimit <= 0) {
                            var ObjectId = require('mongodb').ObjectID;
                            const snoozestop = {
                                snoozeStatus: false,
                                limitsend: 12
                            }
                            snoozeshedule.findOneAndUpdate({
                                _id: ObjectId(getid)
                            }, {
                                $set: snoozestop
                            }, (error, data) => {
                                if (error) {
                                    return (error)
                                } else {
                                    return ("update Snooze")
                                }
                            })
                            //----------For limit over then send email for continue--------------------
                            let mailDetails = {
                                from: "abd.bodara@gmail.com",
                                to: maillist,
                                subject: "Your Snooze Email Sending limit is Over if u continue to Send Mail click on start snooze buttone",
                                html: '<button style="background-color: gold"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Start Snooze</a></button> <hr><button style="background-color: red"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Stop Snooze</a></button>',
                            };
                            mailTransporter.sendMail(mailDetails, function (err, data) {
                                if (err) {
                                    return ("Error Occures", err)
                                } else {
                                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                        to: gettoken,
                                        collapse_key: 'your_collapse_key',

                                        notification: {
                                            title: '😥New Update Snooze Shdeule😥',
                                            body: 'The answer to life, the universe, and everything!❤️'
                                        },

                                        data: { //you can send only notification or only data(or include both)
                                            my_key: 'my value',
                                            my_another_key: 'my another value'
                                        }
                                    };

                                    fcm.send(message, function (err, response) {
                                        if (err) {
                                            console.log("Something has gone wrong!");
                                        } else {
                                            console.log("Successfully sent with response: ", response);
                                        }
                                    })
                                    //---------------end sending notification gcm---------------
                                }

                            }) //end here limit sending email
                        } //end if else for check limit 

                    } else if (getstatusOfSnooze === false) {} else(err) => {
                        return err
                    } //if part end getstatus check

                });
            })
            return snoozeshedules
        })
    } catch (err) {
        return (err)
    }


}
//-----------------export function-----------------------------------------
module.exports = {
    sendMailsnooze
}
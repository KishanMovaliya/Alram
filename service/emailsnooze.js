//----------------import packages---------------------------------
var nodemailer = require('nodemailer');
const notifier = require('node-notifier');

//---------sheduler Package import ----------------------
const scheduler = require('node-schedule');

//---------------import modal---------------------------------------
const snoozeshedule = require('../models/SnoozeModel')
const UserStatus = require('../models/UserStatus')
const User = require('../models/users')

//-----------------Send Mail function using Nodemailer----------- 
async function sendMailsnooze(req, res, next) {
    try {
        scheduler.scheduleJob("*/30 * * * * *", function () {
            const snoozeshedules = snoozeshedule.find().then((response) => {
                response.map(async a => {
                    const allemail = a.email
                    //----------get user status------------------
                    const UserIdArray = [a.userId]
                    UserStatus.find({
                        userId: {
                          $in: UserIdArray
                        },
                        isStatus: true
                      }, {
                        userId: 1
                      })
                        .then(async result => {
                            console.log(result)
                            let loginUserIdArray = [];
                            result.map((userObj) => {
                                loginUserIdArray.push(userObj.userId)
                            })
                            //----------find user login-------------------
                            User.find({
                                _id: {
                                    $in: loginUserIdArray
                                }
                            }, {
                                email: 1
                            }).then((response) => {
                                let userEmailList = []

                                response.map((userEmailObj) => {
                                    userEmailList.push(userEmailObj.email)
                                });
console.log(userEmailList)
                                getid = a._id
                                const setlimit = a.limitsend
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
                                                    if (userEmailList == allemail) {
                                                        notifier.notify({
                                                            title: '🤩New Snooze Email Recieve🤩 ',
                                                            message: userEmailList,
                                                            icon: 'dwb-logo.png',
                                                            contentImage: 'blog.png',
                                                            sound: true,
                                                            wait: true,
                                                            open: void 0,
                                                            wait: false,
                                                        });
                                                    } else {
                                                        res.status(401)
                                                    }


                                                    //----------decreament limit and update ---------------------------
                                                    if (data) {
                                                        let ab = setlimit - 1

                                                        const snoozeLimit = {
                                                            limitsend: ab,
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
                                            } else {}

                                        }) //end here limit sending email
                                    } //end if else for check limit 

                                } else if (getstatusOfSnooze === false) {} else(err) => {

                                    return err
                                } //if part end getstatus check
                            })
                        })
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
//----------------import packages---------------------------------
var nodemailer = require('nodemailer');
const notifier = require('node-notifier');

const scheduler = require('node-schedule');
//---------------import modal---------------------------------------
const snoozeshedule = require('../models/SnoozeModel')


//-----------------Send Mail function using Nodemailer----------- 
async function sendMailsnooze(req, res, next) {
  try {
    scheduler.scheduleJob(" */5 * * * *", function () {
      const snoozeshedules = snoozeshedule.find().then((response) => {
        response.map(a => {
          getid = a._id
          const setlimit = a.limitsend
          const getnotification=a.notification
          const getstatusOfSnooze = a.snoozeStatus

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
            to: a.email,
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
                    console.log('☑❤️❤️ Snooze 📧 Email Send Successfully❤️❤️', data)
                    notifier.notify('☑❤️❤️ New Email Recieve☑❤️❤️ ');
                    notifier.notify({
                      'title': 'The answer to life, the universe, and everything!❤️',
                      'subtitle': 'Mail send',
                      'message': 'Click "reply" to send a message back!',
                      'icon': 'dwb-logo.png',
                      'contentImage': 'blog.png',
                      'sound': 'ding.mp3',
                      'wait': true
                    });
                    notifier.on('click', (obj,options)=>{})
                    notifier.on('close', (obj, options) => {});
                    //----------decreament limit and update ---------------------------
                    if (data) {
                      var ObjectId = require('mongodb').ObjectID;
                      let ab = setlimit - 1
                      let note=getnotification + 1
                      const snoozeLimit = {
                        limitsend: ab,
                        notification:note
                      }
                      snoozeshedule.findOneAndUpdate({
                        _id: ObjectId(getid)
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
            else if (setlimit <= 0 ) {
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
                  console.log("update False Successfully")
                  return ("update Snooze")
                }
              })
              //----------For limit over then send email for continue--------------------
              let mailDetails = {
                from: "abd.bodara@gmail.com",
                to: a.email,
                subject: "Your Snooze Email Sending limit is Over if u continue to Send Mail click on start snooze buttone",
                html: '<button style="background-color: gold"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Start Snooze</a></button> <hr><button style="background-color: red"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Stop Snooze</a></button>',
              };
              mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                  return ("Error Occures", err)
                } else(data)
              }) //end here limit sending email
            } //end if else for check limit 

          } else if (getstatusOfSnooze === false) {
            console.log("✘✘✘ Email not send snooze its off ✘✘✘")
          } else(err) => {
            throw (err)
          } //if part end getstatus check

        });
      })
      return snoozeshedules
    })
  } catch (err) {
    throw (err)
  }


}
//-----------------export function-----------------------------------------
module.exports = {
  sendMailsnooze
}
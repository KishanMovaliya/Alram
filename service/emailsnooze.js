//----------------import packages---------------------------------
var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const scheduler = require('node-schedule');
//---------------import modal---------------------------------------
const snoozeshedule = require('../models/SnoozeModel')


//-----------------Send Mail function using Nodemailer----------- 
async function sendMailsnooze(req, res) {
  try {
    scheduler.scheduleJob("*/1 * * * *", function () {
      const snoozeshedules = snoozeshedule.find().then((response) => {
        response.map(a => {
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
          if (getstatusOfSnooze === true) {
            mailTransporter.sendMail(mailDetails,
              function (err, data) {
                if (err) {
                  return ("Error Occurs", err)
                } else {
                  console.log('❤️❤️Snooze Email Send Successfully❤️❤️', data)
                }
              });
          } else if (getstatusOfSnooze === false) {
            console.log("~~email not send snooze its off~~")
          } else(err) => {
            console.log(err)
          }
        });
      })
      return snoozeshedules
    })
  } catch (err) {
    console.log(err)
    return (err)
  }


}
//-----------------export function-----------------------------------------
module.exports = {
  sendMailsnooze
}
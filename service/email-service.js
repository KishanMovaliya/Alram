//----------------import packages---------------------------------
var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const scheduler = require('node-schedule');
//---------------import modal---------------------------------------
const EmailShedule = require('../models/shedulemodel');
const snoozeEmail = require('../models/SnoozeModel');


//-----------------Send Mail function using Nodemailer----------- 
async function sendMail(req, res) {
  try {
    const EmailSchedule = EmailShedule.find().then((response) => {
      response.map(a => {
        //---------------DayOfWeek Get -----------------------------------------
        //  let  daysget = JSON.parse(JSON.stringify(a.day));
        //   const dayconvert=daysget.map(item => item.day) 
        //   const dayOfWeek=dayconvert.toString()

        //---------------get status On off----------------------------------- ----
        const getstatus = a.status
        //----------------get step days----------------------------------------
        let step = a.stepday.split(":")
        const getstep = step[0]
        //-----------------Date get to converted----------------------------------
        let dates = new Date(a.date)
        let getdate = dates.toLocaleDateString()
        let datetext = getdate.split(" ")

        //-----------------Tiime get to converted----------------------------------------------------------------
        let time = new Date(a.time)
        let timeget = time.toTimeString()
        datetext = timeget.split(':');

        //------------------Assign time in hour and minute -----------------------------------------------------
        const hour = datetext[0]
        const minute = datetext[1]


        //-----------------Assign Date In month and Date
        const date = dates.getDate()

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
          html: '<button style="background-color: gold"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Start Snooze</a></button> <hr><button style="background-color: red"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn"">Stop Snooze</a></button>',

        };
        //----------------rules schedular-------------------------------------
        var rule = new scheduler.RecurrenceRule();
        rule.hour = hour == null ? null : hour;
        rule.minute = minute == null ? null : minute;
        rule.dayOfWeek = [0, new scheduler.Range(0, 6)];
        // rule.date = date == null ? null : date;
        //----------------call schedular & Send Email---------------------------------------
        scheduler.scheduleJob(rule, function () {
          if (getstatus === true) {
            mailTransporter.sendMail(mailDetails,
              function (err, data) {
                if (err) {
                  return ("Error Occurs", err)
                } else {
                  console.log('Email sent successfully', data)
                  //---------------create snooze -----------------------------
                  let datas = new snoozeEmail({
                    email: a.email,
                    time: time,
                    snoozeStatus: false
                  })
                  datas.save()
                  return ("Email sent successfully")
                }
              });
          } else {
            console.log("Status is False for this email time")
          }
        });
      })
    })
    return EmailSchedule
  } catch (err) {
    console.log(err)
    return (err)
  }


}

//-----------------export function-----------------------------------------
module.exports = {
  sendMail
}
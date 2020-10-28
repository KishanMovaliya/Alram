//----------------import packages---------------------------------
var nodemailer = require('nodemailer');
const notifier = require('node-notifier');

const scheduler = require('node-schedule');
//---------------import modal---------------------------------------
const EmailShedule = require('../models/shedulemodel');
const snoozeEmail = require('../models/SnoozeModel');
const UserToken = require('../models/TokenNotification')

//---------------fcm require------------------------------------------
var FCM = require('fcm-node');
var serverKey = 'AAAAHV8fXR4:APA91bGmZflZantZw8gYX2TTv_yNy0TRwdXosruwSziVAUyGEuwrdzZ8reiFFRYN9s9ZP8zTs2bHw_S3QPapryow5yEmNP3rZRnfnchmrv5KfOqWaNNLw0YiWYKZf2gfpl13V4u0z_Ap'; //put your server key here
var fcm = new FCM(serverKey);


//-----------------Send Mail function using Nodemailer----------- 
async function sendMail(req, res,next) {
  try {
    const EmailSchedule = EmailShedule.find().then((response) => {
      const getitem = UserToken.find()
              let gettoken
              getitem.then(res => {
                  res.map(b => {
                       gettoken = b.notificationToken 
                  })
                  console.log("emailservice", gettoken)
              })
      response.map(a => {
        const getusers = JSON.parse(JSON.stringify(a.useremail))
        const useremail = getusers.map(item => item)
        const getemailuser = useremail.toString()

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
          
        var maillist = [
          a.email,
          getemailuser
        ];


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
                  if(gettoken){
                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                      to: gettoken, 
                      collapse_key: 'your_collapse_key',
                      
                      notification: {
                          title: '☑❤️❤️ First  Email Recieve ☑❤️❤️ ', 
                          body: 'The answer to life, the universe, and everything!❤️' 
                      },
                      
                      data: {  //you can send only notification or only data(or include both)
                          my_key: 'my value',
                          my_another_key: 'my another value'
                      }
                  };
                  
                  fcm.send(message, function(err, response){
                      if (err) {
                          console.log("Something has gone wrong!");
                      } else {
                          console.log("Successfully sent with response: ", response);
                      }
                  });
                  }
                  else{
                    console.log("token not register")
                  }
              
                  //---------------create snooze -----------------------------
                  let datas = new snoozeEmail({
                    email: a.email,
                    time: time,
                    snoozeStatus: true,
                    limitsend: 12,
                    notification: 0
                  })
                  datas.save()
                  //----------new user add email snooze--------------------

                  useremail.map(res=>{
                    let multidata = new snoozeEmail({
                      email: res,
                      time: time,
                      snoozeStatus: true,
                      limitsend: 12,
                      notification: 0
        
                    })
                    multidata.save()
                    return ("☑Email sent successfully")
                  })
                }
              });

          } else {
          }
        });
      })
    })
    return EmailSchedule
  } catch (err) {
    return (err)
  }


}

//-----------------export function-----------------------------------------
module.exports = {
  sendMail
}
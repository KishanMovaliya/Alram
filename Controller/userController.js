//----------------import packages---------------------------------
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//-----------import modals------------------------------
const User = require("../models/users");
const EmailShedule = require('../models/shedulemodel')


//-----------Register user------------------------------
exports.registerNewUser = async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email
    })
    user.password = await user.hashPassword(req.body.password);
    const token = await user
    let createdUser = await user.save();
    res.status(201).send({
      user,
      token
    })
    res.status(200).json({
      msg: "New user created",
      data: createdUser
    })
  } catch (err) {
    res.status(500).json({
      error: err
    })
  }
}


//--------------login user---------------------
exports.loginUser = async (req, res) => {
  const login = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    let user = await User.findOne({
      email: login.email
    });

    //check if user exit
    if (!user) {
      res.status(400).json({
        type: "Not Found",
        msg: "Wrong Login Details"
      })
    }

    let match = await user.compareUserPassword(login.password, user.password);

    if (match) {
      let token = await user.generateJwtToken({
        user
      }, "secret", {
        expiresIn: 604800
      })
      if (token) {
        res.status(200).json({
          success: true,
          token: token,
          userCredentials: user
        })
      }
    } else {
      res.status(400).json({
        type: "Not Found",
        msg: "Wrong Login Details"
      })
    }
  } catch (err) {
    res.status(500).json({
      type: "Something Went Wrong",
      msg: err
    })
  }
}

//----------Create email schedule------------------------
exports.emailshedule = async (req, res) => {
  try {
    let datas = new EmailShedule({
      email: req.body.email,
      date: req.body.date,
      stepday: req.body.stepday,
      time: req.body.time,
      status: req.body.status,
      day: req.body.day,
      userId:req.body.userId,
    })
    let createshedule = await datas.save()
    res.status(200).json({
      msg: "User Email schedule Create Successfully",
      data: createshedule
    })
  } catch (err) {
    return (err)
  }
}

//----------get EmailShedule DAta----------------------------------------
exports.getemailshedule = async (req, res) => {
  try {
    let datas = await EmailShedule.find()
    res.status(200).json({
      data: datas
    })

  } catch (err) {
    res.status(400).json({
      type: "Not Found",
      msg: "Something Wrong"
    })
  }
}


//----------update Email schedule--------------------------------------- 
exports.updateshedule = async (req, res, next) => {
  var ObjectId = require('mongodb').ObjectID;
  const sheduledata = {
    time: req.body.time,
    day: req.body.day,
    status: req.body.status,
  }
  EmailShedule.findByIdAndUpdate({
    _id: ObjectId(req.params.id)
  }, {
    $set: sheduledata,
    upsert: true,
    new: true
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      res.status(200).json({
        type: "Sucess",
        msg: "Data updated successfully"
      })
      return ('Data updated successfully')
    }
  })
}

//----------update Status--------------------------------------------
exports.updateStatus = async (req, res, next) => {
  var ObjectId = require('mongodb').ObjectID;
  const statusupdte = {
    status: req.body.status
  }
  EmailShedule.findOneAndUpdate({
    _id: ObjectId(req.params.id)
  }, {
    $set: statusupdte
  }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
      res.status(200).json({
        type: "Sucess",
        msg: "Status updated successfully"
      })
    }
  })
}


//----------delete shedule--------------------------------------------------------
exports.deleteShedule = async (req, res, next) => {
  EmailShedule.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
}

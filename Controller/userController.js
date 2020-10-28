//----------------import packages---------------------------------

//-----------import modals------------------------------
const User = require("../models/users");
const Usernew = require('../models/usernew')
const EmailShedule = require('../models/shedulemodel')
const TokenNotificationModel = require('../models/TokenNotification')

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
                let data = {
                    token: token,
                    userId: user._id
                }
                const userToken = new Usernew(data)
                userToken.save((err, data) => {
                    res.status(200).json({
                        type: "sucess",
                        msg: data
                    })
                })

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

//get login user
exports.getloginuser = async (req, res) => {
    try {
        res.json({
            id: req.User._id,
            email: req.User.email,
            name: req.User.name
        })
    } catch (err) {
        res.status(400).json({
            type: "Not Found User",
            msg: "Something Wrong"
        })
    }
}

//logout user
exports.logout = async (req, res) => {
    try {
        req.user.deleteToken(req.token, (err, user) => {
            if (err) return res.status(400).send(err);
            res.sendStatus(200);
        });
    } catch (err) {
        res.status(400).json({
            type: "Not Found Logout",
            msg: "Something Wrong"
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
            userId: req.body.userId,
            useremail: req.body.useremail,
            notificationToken: req.body.notificationToken,
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
        let datas = await EmailShedule.find({
            userId: req.User._id
        })
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
            return ("Status updated successfully")

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

//----------get user DAta----------------------------------------
exports.getuser = async (req, res) => {
    try {
        let dataget = await User.find()
        res.status(200).json({
            data: dataget,
        })
    } catch (err) {
        res.status(400).json({
            type: "Not Found",
            msg: "Something Wrong"
        })
    }
}

//----------add shedule email user----------------------------------------
exports.getemailuseradd = async (req, res) => {
    var ObjectId = require('mongodb').ObjectID;
    let datae = req.body.checkArray;
    const emaildata = {
        useremail: datae,
    }
    EmailShedule.findByIdAndUpdate({
        _id: ObjectId(req.params.id)
    }, {
        $set: emaildata,
        upsert: true,
        new: true
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data)
            return ('Data updated successfully')
        }
    })
}

//----------add token-----------------------------------------------------
exports.gettoken = async (req, res) => {
    try {
        let user = await TokenNotificationModel.findOne({
            notificationToken: req.body.notificationToken
        });
        if (user) {
            return res.status(400).send('That Token already exisits!');
        } else {
            let datas = new TokenNotificationModel({
                email: req.body.email,
                userId: req.body.userId,
                notificationToken: req.body.notificationToken,
            })
            let createtoken = await datas.save()
            console.log(createtoken)
            res.status(200).json({
                msg: "User Token Update Successfully",
                data: createtoken
            })
        }
    } catch (err) {
    }
}

//----------get token DAta----------------------------------------
exports.gettokenNotification = async (req, res) => {
    try {
        let datas = await TokenNotificationModel.find({
            userId: req.User._id
        })
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
